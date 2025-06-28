const express = require("express");
const cors = require("cors");
const mainService = require("./src/mainService");
const { Worker } = require('worker_threads');
const { Sequelize } = require('sequelize');


const sequelize = require('./src/db');
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

// Used for test purposes
// app.get("/wallet/create", async (req, res) => {
//     console.log('1')
//     const wallet = await btcService.createTestHDWallet()
//     console.log(wallet);
//     await btcService.getTestHDWallet()
//     res.status(200).send(html);
// });
// app.get('/test', async (req, res) => {
//     res.status(200).send("success")
// })



app.get('/test/payment/create', async (req, res) => {
    try {
        const result = await mainService.createNewTestPayment()
        res.status(200).send(result);
    } catch (e) {
        console.error(`@/test/payment/create: ${e}`);
        res.status(500).send(`Internal Server Error: ${e.message}`);
    }
})

app.get('/health', async (req, res) => {
    res.status(200).send();
})

app.post('/webhook', async (req, res) => {
    try {
        const txData = req.body;
        await mainService.acknowledgeTestWebHookInput(txData)
        res.sendStatus(200);
    } catch (e) {
        console.error(`@/webhook: ${e}`);
        res.sendStatus(200);
    }
});

app.get("/payment/get", async (req, res) => {
    const {id} = req.query;
    try {
        const result = await mainService.getPaymentById(id);
        res.status(200).send(result);
    } catch (e) {
        console.error(`@/payment/get: ${e}`);
        res.status(500).send(`Internal Server Error: ${e.message}`);
    }
});

app.get("/payment/create", async (req, res) => {
    try {
        const result = await mainService.createNewPayment()
        res.status(200).send(result);
    } catch (e) {
        console.error(`@/payment/create: ${e}`);
        res.status(500).send(`Internal Server Error: ${e.message}`);
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));

app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    return res.status(500).json({result: 'error', message: 'Internal server error', details: err.message});
});
