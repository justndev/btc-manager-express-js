const express = require("express");
const cors = require("cors");
const btcService = require("./src/services/btcService");
const mainService = require("./src/mainService");
const { Worker } = require('worker_threads');
const { Sequelize, DataTypes } = require('sequelize');
const Payment = require("./src/models/payment");
const Paid = require("./src/models/paid");
const Unpaid = require("./src/models/unpaid");


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


app.get("/wallet/create", async (req, res) => {
    console.log('1')
    const wallet = await btcService.createTestHDWallet()
    console.log(wallet);
    await btcService.getTestHDWallet()
    res.status(200).send(html);
});



app.get('/test/payment/create', async (req, res) => {
    const result = await mainService.createTestPayment()
    res.status(200).send(result);
})
app.get('/health', async (req, res) => {
    res.status(200).send();
})
app.post('/webhook', (req, res) => {
    const eventType = req.headers['x-eventtype'];
    const txData = req.body;

    console.log(`Received WebHook: ${eventType}`);
    console.log(txData);

    // Example: Mark order as paid based on tx hash or address
    // TODO: Add logic to match txData.address or outputs to your database/payment system

    res.sendStatus(200); // Must respond with 200 to avoid retries
});



app.get("/payment/get", async (req, res) => {
    const {id} = req.query;
    try {
        const result = await mainService.getPaymentById(id);
        console.log(`result`)
        console.log(result);
        res.status(200).send(result);
    } catch (e) {
        console.error(e);
        res.status(405).send("error");
    }
});

app.get("/payment/create", async (req, res) => {
    const result = await mainService.createNewPayment()
    console.log(`result`)
    console.log(result);
    res.status(200).send(result);
});

app.listen(port, () => console.log(`Server running on port ${port}`));

app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    return res.status(500).json({result: 'error', message: 'Internal server error', details: err.message});
});
