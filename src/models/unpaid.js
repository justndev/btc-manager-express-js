const { DataTypes } = require('sequelize');

const sequelize = require('../db');


const unpaidInstance = sequelize.define('unpaid', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
});

module.exports = unpaidInstance;
