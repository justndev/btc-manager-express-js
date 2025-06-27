const btcService = require("./services/btcService");
const bdService = require("./services/dbService");
const axios = require("axios");

class MainService {
    async createNewPayment() {
        try {
            const derivedAddress = await btcService.deriveAddress();
            const result = await btcService.createWebhook(derivedAddress.address);
            const webHookId = result.id;
            const btcExchangeRate = (await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur')).data.bitcoin.eur;
            const priceInBtc = parseFloat((10 / btcExchangeRate).toFixed(8));
            const paymentInstance = await bdService.createNewPayment(derivedAddress, "1.1.1.1", btcExchangeRate, priceInBtc, webHookId);
            await bdService.putPaymentToUnpaidById(paymentInstance.id);

            console.log(`?createNewPayment: success, ${paymentInstance.id}`)
            return paymentInstance;
        } catch (e) {
            console.error(`@createNewPayment: ${e.message}`);
            throw e;
        }
    }

    async createNewTestPayment() {
        try {
            const derivedAddress = await btcService.deriveTestAddress()
            const result = await btcService.createTestWebhook(derivedAddress.address);
            const webHookId = result.id
            const btcExchangeRate = (await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur')).data.bitcoin.eur
            const priceInBtc = parseFloat((10 / btcExchangeRate).toFixed(8));
            const paymentInstance = await bdService.createNewPayment(derivedAddress, "1.1.1.1", btcExchangeRate, priceInBtc, webHookId)
            await bdService.putPaymentToUnpaidById(paymentInstance.id)

            console.log(`?createNewTestPayment: success, ${paymentInstance.id}`)
            return paymentInstance
        } catch (e) {
            console.error(`@createTestPayment: ${e}`);
            throw e;
        }
    }

    async createNewDummyPayment() {
        try {
            const dummyWallet = {
                address: 'dummyAddress',
                path: 'dummyPath',
                public: 'dummyPublic'
            }
            const btcExchangeRate = (await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur')).data.bitcoin.eur
            const priceInBtc = parseFloat((10 / btcExchangeRate).toFixed(8));
            const paymentInstance = await bdService.createNewPayment(dummyWallet, "1.1.1.1", btcExchangeRate, priceInBtc, 'dummyWebHookId')
            await bdService.putPaymentToUnpaidById(paymentInstance.id)

            console.log(`?createNewDummyPayment: success, ${paymentInstance.id}`)
            return paymentInstance;
        } catch (e) {
            console.error(`@createNewDummyPayment: ${e}`)
            throw e;
        }
    }

    async checkPaymentStatusById(id) {
        const payment = await bdService.getPaymentById(id)
        if (!payment) {
            throw new Error("Payment not found")
        }
        return payment[0].dataValues.status === 'paid';
    }


    async checkUnpaidPayments() {
        console.log("Deleting unpaid payments...");
        console.log(new Date().toISOString());

        const currentTime = new Date()
        const EXPIRATION_TIME_IN_MS = 10 * 60 * 60 * 1000; // 10 hours

        try {
            const unpaidPayments = await bdService.getUnpaidPayments()
            if (unpaidPayments && unpaidPayments.length > 0) {
                for (const payment of unpaidPayments) {
                    if ((currentTime - payment.createdAt) > EXPIRATION_TIME_IN_MS) {
                        await bdService.putPaymentToUnpaidById(payment.dataValues.id)
                        await bdService.changePaymentStatusById(payment.dataValues.id, 'expired')
                        await btcService.deleteTestWebhookById(payment.dataValues.webHookId)
                        console.log(`?checkUnpaidPayments: expired: ${payment.dataValues.id}`)
                    }
                }
            } else {
                console.log("No payments found");
            }
        } catch (e) {
            console.error(`@checkUnpaidPayments: ${e.message}`);
            throw e;
        }
    }

    async getPaymentById(paymentId) {
        try {
            const paymentInstance = await bdService.getPaymentById(paymentId);
            if (!paymentInstance) {
                return null;
            }

            return {
                id: paymentInstance[0].dataValues.id,
                address: paymentInstance[0].dataValues.address,
                status: paymentInstance[0].dataValues.status,
                createdAt: paymentInstance[0].dataValues.createdAt,
                totalChecks: paymentInstance[0].dataValues.totalChecks,
                lastTimeChecked: paymentInstance[0].dataValues.lastTimeChecked.lastTimeChecked,
                priceInBtc: paymentInstance[0].dataValues.priceInBtc,
                btcExchangeRate: paymentInstance[0].dataValues.btcExchangeRate,
                balance: paymentInstance[0].dataValues.balance
            };

        } catch (e) {
            console.error(`@checkPaymentById: ${e.message}`);
            throw e;
        }
    }

    async acknowledgeTestWebHookInput(webHookOutput) {
        try {
            const receiverAddress = webHookOutput.outputs[1].address[0];
            const currentBalance = await webHookOutput.outputs[1].value/100000000;
            const paymentInstance = await bdService.getPaymentByAddress(receiverAddress);

            if (currentBalance >= paymentInstance[0].dataValues.balance) {
                await bdService.changePaymentBalance(currentBalance)
                await bdService.changePaymentStatus(paymentInstance, 'idkLolWtf')
                return
            }

            const paymentId = await btcService.deleteTestWebhookById(paymentInstance[0].dataValues.id)
            const webHookId = paymentInstance[0].dataValues.webHookId;

            await btcService.deleteTestWebhookById(webHookId)

            await bdService.changePaymentBalance(paymentInstance, currentBalance)
            await bdService.removePaymentFromUnpaidById(paymentId)
            await bdService.putPaymentToPaidById(paymentId)
            await bdService.changePaymentStatus(paymentInstance, 'paid')

            //     TODO: implement backend notification
        } catch(e) {
            console.error(`@acknowledgeTestWebHookInput: ${e.message}`);
            throw e;
        }

    }
}

module.exports = new MainService();
