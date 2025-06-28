const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Unpaid = sequelize.define('paid', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    paidAt: DataTypes.STRING,
});

module.exports = Unpaid;
