const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('btc-manager-db', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres',
});

const Unpaid = sequelize.define('paid', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    paidAt: DataTypes.STRING,
});

module.exports = Unpaid;
