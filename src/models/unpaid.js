const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('btc-manager-db', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres',
});

const unpaidInstance = sequelize.define('unpaid', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
});

module.exports = unpaidInstance;
