const btcService = require("./services/btcService");
const bdService = require("./services/dbService");
const unpaidInstance = require("./models/unpaid");
const axios = require("axios");

class MainService {
    checks = 0;
    currentHour = 25;

    async createNewPayment() {
        try {
            const derivedAddress = await btcService.deriveAddress()
            const btcExchangeRate = (await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur')).data.bitcoin.eur
            const priceInBtc = parseFloat((10 / btcExchangeRate).toFixed(8));
            return await bdService.createNewPayment(derivedAddress, "1.1.1.1", btcExchangeRate, priceInBtc)
        } catch (e) {
            console.error(`@createNewPayment: ${e}`)
        }
    }

    async checkPaymentStatusById(id) {
        const payment = await bdService.getPaymentById(id)
        if (!payment) {
            throw new Error("Payment not found")
        }
        return payment[0].dataValues.status === 'paid';
    }

    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    async checkUnpaidPayments() {
        console.log("Checking unpaid payments...");
        console.log(new Date().toISOString());
        const currentHour = this.getCurrentHour();
        console.log(this.checks)
        if (currentHour !== this.currentHour) {
            this.currentHour = currentHour;
            this.checks = 0;
        }

        try {
            const unpaidPayments = await bdService.getUnpaidPayments()
            if (unpaidPayments && unpaidPayments.length > 0) {
                for (const payment of unpaidPayments) {
                    console.log(`Starting checking unpaid payment`);
                    const paymentInstance = await bdService.getPaymentById(payment.dataValues.id);
                    if (paymentInstance[0].dataValues.totalChecks < 6 && this.checks < 30) {
                        const isChecked = await this.tryCheckUnpaidPayment(paymentInstance)

                        if (isChecked) {
                            this.checks = this.checks + 1;
                            paymentInstance[0].totalChecks = paymentInstance[0].dataValues.totalChecks + 1;
                            paymentInstance[0].lastTimeChecked = new Date();
                            await paymentInstance[0].save();
                        }
                    } else {
                        console.log(`Counts overreached or checks full`);
                    }
                }
            } else {
                console.log("No payments found");
            }
        } catch (e) {
            console.error(`@checkUnpaidPayments: ${e}`);
        }
    }

    isPaymentNeedToBeChecked(date, currentChecks, createdAt) {
        const timePastInMins = (new Date() - date)/60000*144;

        console.log(new Date() - new Date(createdAt));

        const timePastInMinsFromCreation = (new Date() - new Date(createdAt))/60000*144;
        console.log(`@isPaymentNeedToBeChecked. timePastInMins: ${timePastInMins}`);

        switch (currentChecks) {
            case (0):
                if (timePastInMins > 20) {
                    console.log(`@isPaymentNeedToBeChecked. true; 0; ${timePastInMins}; ${timePastInMinsFromCreation}`);
                    return true;
                }
                break;
            case (1):
                if (timePastInMins > 20) {
                    console.log(`@isPaymentNeedToBeChecked. true; 1; ${timePastInMins}; ${timePastInMinsFromCreation}`);
                    return true;
                }
                break;
            case (2):
                if (timePastInMins > 20) {
                    console.log(`@isPaymentNeedToBeChecked. true; 2; ${timePastInMins}; ${timePastInMinsFromCreation}`);
                    return true;
                }
                break;
            case (3):
                if (timePastInMins > 60) {
                    console.log(`@isPaymentNeedToBeChecked. true; 3; ${timePastInMins}; ${timePastInMinsFromCreation}`);
                    return true;
                }
                break;
            case (4):
                if (timePastInMins > 180) {
                    console.log(`@isPaymentNeedToBeChecked. true; 4; ${timePastInMins}; ${timePastInMinsFromCreation}`);
                    return true;
                }
                break;
            case (5):
                if (timePastInMins > 60*19) {
                    console.log(`@isPaymentNeedToBeChecked. true; 5; ${timePastInMins}; ${timePastInMinsFromCreation}`);
                    return true;
                }
                break;
            case (6):
                console.log(`@isPaymentNeedToBeChecked. false; 6; ${timePastInMins}; ${timePastInMinsFromCreation}`);
                return false
        }


    }

    async tryCheckUnpaidPayment(paymentInstance) {
        console.log('Checking unpaid payment: ', paymentInstance[0].dataValues.id);
        try {
            if (!this.isPaymentNeedToBeChecked(paymentInstance[0].dataValues.lastTimeChecked, paymentInstance[0].dataValues.totalChecks, paymentInstance[0].dataValues.createdAt)) {
                console.log('Checking unpaid payment, returning false coz dont need to be checked');

                return false;
            }
            // const balance = await btcService.checkAddressBalance(paymentInstance[0].dataValues.address);

            if (0 >= paymentInstance[0].dataValues.priceInBtc) {
                await bdService.changePaymentToPaid(paymentInstance[0].dataValues.id)
            }
            console.log('Checking unpaid payment, returning true coz needed to be checked');
            return true;
        } catch (e) {
            console.error(`@checkUnpaidPayments: ${e}`);
            console.log('Checking unpaid payment, error occurred and false returned');
            return false;
        }
    }

    async checkPaymentById(paymentId) {
        try {
            const paymentInstance = bdService.getPaymentById(paymentId);
            if (!paymentInstance) {
                return "No payment found";
            }
            const balance = await btcService.checkAddressBalance(paymentInstance[0].dataValues.address);
            if (0 >= paymentInstance[0].dataValues.priceInBtc) {
                await bdService.changePaymentToPaid(paymentInstance[0].dataValues.id)
                return "Payment was paid!"
            } else {
                return `Not enough money transferred. Current balance: ${balance}, required: ${paymentInstance[0].dataValues.priceInBtc}`
            }
        } catch (e) {
            console.error(`@checkPaymentById: ${e}`);
            return "Too many request or unexpected error"
        }
    }

    getCurrentHour() {
        const currentHours = new Date().getHours()
        console.log(`currentHours: ${currentHours}`);
        return currentHours;
    }
}

module.exports = new MainService();
