const { DataTypes } = require('sequelize');

const sequelize = require('../db');


const Payment = sequelize.define('payments', {
    id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    IP: DataTypes.STRING,
    createdAt: DataTypes.STRING,
    status: DataTypes.STRING,
    senderWallet: DataTypes.STRING,
    address: DataTypes.STRING,
    webHookId: DataTypes.STRING,
    public: DataTypes.STRING,
    path: DataTypes.STRING,
    balance: DataTypes.DOUBLE,
    btcExchangeRate: DataTypes.DOUBLE,
    priceInBtc: DataTypes.DOUBLE,
});

module.exports = Payment;
