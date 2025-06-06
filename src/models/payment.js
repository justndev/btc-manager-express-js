const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('btc-manager-db', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres',
});
const Payment = sequelize.define('payments', {
    id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    IP: DataTypes.STRING,
    lastTimeChecked: {type: DataTypes.DATE, defaultValue: new Date()},
    totalChecks: {type: DataTypes.INTEGER, defaultValue: 0},
    createdAt: DataTypes.STRING,
    status: DataTypes.STRING,
    senderWallet: DataTypes.STRING,
    address: DataTypes.STRING,
    public: DataTypes.STRING,
    path: DataTypes.STRING,
    balance: DataTypes.DOUBLE,
    btcExchangeRate: DataTypes.DOUBLE,
    priceInBtc: DataTypes.DOUBLE,
});

module.exports = Payment;
