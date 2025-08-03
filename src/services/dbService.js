const Payment = require('../models/payment');
const Unpaid = require('../models/unpaid');
const Paid = require('../models/paid');

class DBService {
    async createNewPayment(wallet, IP, btcExchangeRate, priceInBtc, webHookId) {
        try {
            const newPayment = await Payment.create({
                IP: IP,
                createdAt: new Date().toISOString(),
                status: 'unpaid',
                senderWallet: '',
                balance: 0,
                webHookId: webHookId,
                address: wallet.address,
                public: wallet.public,
                path: wallet.path,
                priceInBtc: priceInBtc,
                btcExchangeRate: btcExchangeRate
            });
            return {address: newPayment.address, id: newPayment.id, createdAt: newPayment.createdAt, priceInBtc: newPayment.priceInBtc, balance: 0, status: 'unpaid'};
        } catch (e) {
            console.error(`@createNewPayment: ${e.message}`);
            throw e;
        }
    }

    async getUnpaidPayments() {
        try {
            return await Unpaid.findAll()
        } catch (e) {
            return null;
        }
    }

    async getPaymentById(id) {
        try {
            return await Payment.findAll({
                where: {id: id}
            });
        } catch(e) {
            console.error(`@getPaymentById: ${e.message}`);
            throw e;
        }
    }

    async getPaymentByAddress(address) {
        try {
            return await Payment.findAll({
                where: {address: address},
            })
        } catch(e) {
            console.error(`@getPaymentByAddress: ${e.message}`);
            throw e;
        }
    }

    async changePaymentStatus(payment, newStatus) {
        try {
            payment.status = newStatus
            payment.save()
        } catch (e) {
            console.error(`@changePaymentStatusById: ${e.message}`);
            throw e;
        }
    }

    async removePaymentFromUnpaidById(paymentId) {
        try {
            const isDeleted = await Unpaid.destroy({
                where: {id: paymentId}
            })
            if (isDeleted) {
                console.log(`?removePaymentFromUnpaidById: success, ${paymentId}`)
            } else {
                console.log(`?removePaymentFromUnpaidById: not found, ${paymentId}`)
            }
        } catch (e) {
            console.error(`@removePaymentFromUnpaidById: ${e.message}`);
            throw e;
        }
    }

    async putPaymentToUnpaidById(paymentId) {
        try {
            await Unpaid.create({id: paymentId});
        } catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                console.log(`?putPaymentToUnpaidById: already exists, ${paymentId}`)
                throw e
            } else {
                console.error(`@putPaymentToUnpaidById: ${e.message}`);
            }
            throw e;
        }
    }

    async removePaymentFromPaidById(paymentId) {
        try {
            const isDeleted = await Paid.destroy({
                where: {id: paymentId}
            })
            if (isDeleted) {
                console.log(`?removePaymentFromPaidById: success, ${paymentId}`)
            } else {
                console.log(`?removePaymentFromPaidById: not found, ${paymentId}`)
            }
        } catch (e) {
            console.error(`@removePaymentFromPaidById: ${e.message}`);
            throw e;
        }
    }

    async putPaymentToPaidById(paymentId) {
        try {
            await Paid.create({id: paymentId});
        } catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                console.log(`?putPaymentToPaidById: already exists, ${paymentId}`)
                throw e
            } else {
                console.error(`@putPaymentToPaidById: ${e.message}`);
            }
            throw e;
        }
    }

    async changePaymentBalance(payment, newBalance) {
        try {
            payment.balance = newBalance
            payment.save()
        } catch (e) {
            console.error(`@changePaymentBalance: ${e.message}`);
            throw e;
        }
    }
}

module.exports = new DBService();
