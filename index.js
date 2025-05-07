const express = require("express");
const cors = require("cors");
const btcService = require("./btcService");
const mainService = require("./src/mainService");
const { Worker } = require('worker_threads');
const { Sequelize, DataTypes } = require('sequelize');


const sequelize = new Sequelize('btc-manager-db', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres',
});

sequelize.authenticate()
require("dotenv").config();
const app = express();
const port = process.env.PORT || 6000;

app.use(express.json());
app.use(cors());
const manager = new Worker("./src/manager.js");

process.on('uncaughtException', (err) => {
    console.error('🔥 Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('⚠️ Unhandled Rejection:', reason);
});


app.get("/api/wallet/create", async (req, res) => {
    // const wallet = await btcService.createHDWallet()
    // console.log(wallet);
    // await btcService.getHDWallet()
    await btcService.checkAddressBalance()
    res.status(200).send(html);
});

app.get("/payment/create", async (req, res) => {
    res.status(200).send(await mainService.createNewPayment());
});

app.get("/payment/check", async (req, res) => {
    const {id} = req.query;
    try {
        const result = await mainService.checkPaymentById(niid);
        res.status(200).send(result);
    } catch (e) {
        console.error(e);
        res.status(405).send("error");
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));

app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    return res.status(500).json({result: 'error', message: 'Internal server error', details: err.message});
});
