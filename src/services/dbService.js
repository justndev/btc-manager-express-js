const Payment = require('../models/payment');
const Unpaid = require('../models/unpaid');
const Paid = require('../models/paid');

const {DataTypes} = require("sequelize");

class DBService {
    async createNewPayment(wallet, IP, btcExchangeRate, priceInBtc) {
        try {
            const newPayment = await Payment.create({
                IP: IP,
                createdAt: new Date().toISOString(),
                status: 'unpaid',
                senderWallet: '',
                lastTimeChecked: new Date(),
                totalChecks: 0,
                balance: 0,
                address: wallet.address,
                public: wallet.public,
                path: wallet.path,
                priceInBtc: priceInBtc,
                btcExchangeRate: btcExchangeRate
            });
            await Unpaid.create({id: newPayment.id});
            return {address: newPayment.address, id: newPayment.id, createdAt: newPayment.createdAt, price: newPayment.priceInBtc};
        } catch (e) {
            console.error(`@createNewPayment: ${e}`);
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
        return await Payment.findAll({
            where: {id: id}
        });
    }

    async changePaymentToPaid(payment) {
        try {
            console.log("id:" + payment[0].dataValues.id )
            const isDeleted = await Unpaid.destroy({
                where: {id: payment[0].dataValues.id}
            })
            if (isDeleted) {
                await Paid.create({id: payment[0].dataValues.id})
            }
            payment[0].status = 'paid'
            payment[0].save()
        } catch (e) {
            console.error(`@changePaymentToPaid: ${e}`);
            throw e;
        }
    }

    async changePaymentBalance(payment, newBalance) {
        try {
            payment[0].balance = newBalance
            payment[0].save()
        } catch (e) {
            console.error(`@changePaymentToPaid: ${e}`);
            throw e;
        }
    }

    findPaymentByUid(uid) {
        // return payment object or null
    }
}

module.exports = new DBService();
