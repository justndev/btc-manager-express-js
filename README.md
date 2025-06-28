# Bitcoin Payment Manager (In Progress...)

## Overview
Hi, visitor!
This project is part of tempchat.xyz, but I’ve made it available as a standalone tool. It’s a Node.js application for processing Bitcoin payments, supporting automatic status checks and payment management.
It uses the BlockCypher API and requires a BIP39 wallet for HD Wallet operations. You can test the service using the Bitcoin Testnet (testnet3). Feel free to ask me for a test BTC faucet link or find one yourself.

Note: Fund transferring is not yet implemented but is planned.
If you find this useful, consider leaving a ⭐ on the repository!

## Features

- **Bitcoin Address Generation**: Creates unique Bitcoin addresses for each payment from HD Wallet
- **Payment Status Tracking**: Automatically checks payment statuses at configurable intervals
- **Exchange Rate Integration**: Fetches current BTC to EUR exchange rates
- **Database Persistence**: Stores all payment information in PostgreSQL
- **Payment Lifecycle Management**: Tracks payments from creation to completion

## Tech Stack

- **Node.js & Express.js**: Backend server and API
- **PostgreSQL & Sequelize**: Database and ORM
- **BlockCypher API**: Bitcoin blockchain interaction
- **Worker Threads**: Background processing for payment status checks

## Prerequisites

- Node.js (v12+ recommended)
- PostgreSQL database
- BIP39 Wallet
- BlockCypher API token

## Installation

1. Clone the repository
```bash
git clone https://github.com/justndev/btc-manager-express-js.git
cd btc-manager-express-js
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
   Create a `.env` file with the following:
```
BLOCKCYPHER_TOKEN=your_blockcypher_token
```

4. Set up PostgreSQL database
```
Database name: btc-manager-db
Username: postgres
Password: postgres
Host: localhost
```

5. Start the application
```bash
node index.js
```

## API Endpoints

### Create Payment
```
GET /payment/create
```
```
GET /test/payment/create
```
Creates a new payment and returns the Bitcoin address and payment ID. Test endpoint creates it in testnet3.

**Response:**
```json
{
  "address": "...",
  "id": "...",
  "btcExchangeRate": 91565,
  "IP": "1.1.1.1",
  "createdAt": "2025-06-28 11:36:42.005+00",
  "status":  "unpaid",
  "senderWallet":  "...",
  "webHookId": "...",
  "public":  "...",
  "path": "m/1",
  "balance": 0,
  "priceInBtc": 0.00010921
}
```

### Get Payment
```
GET /payment/get?id=payment_id
```
Basically retrieves payment from database. Suitable of course both for testnet3 and main networks. 

**Response:**
```json
{
  "address": "...",
  "id": "...",
  "btcExchangeRate": 91565,
  "createdAt": "2025-06-28 11:36:42.005+00",
  "status":  "unpaid"/"paid"/"expired"/"low_amount",
  "balance": 0,
  "priceInBtc": 0.00010921
}
```

## System Architecture

### Components

1. **index.js**: Controller. App starting point
2. **Main Service**: Manages payment creation and status checking
3. **BTC Service**: Interacts with BlockCypher API for Bitcoin operations
4. **DB Service**: Handles database operations
5. **Worker Thread Manager**: Runs background jobs for checking unpaid payments
6. **Models, db**: ORM related files

### Payment Lifecycle

1. Payment is created with a unique Bitcoin address, setting up webhook
2. Worker thread will remove expired (after 12h) payments and delete webhooks
3. When sufficient funds are received, payment status changes to "paid", or will be marked as "low_amount"


## Database Schema

### Payments Table
- `id`: UUID, primary key
- `IP`: Client IP address
- `createdAt`: Payment creation timestamp
- `status`: Payment status ('paid' | 'unpaid' | 'expired' | 'low_amount')
- `senderWallet`: Sender's wallet (if available) # No usages currently
- `address`: Bitcoin address for payment
- `public`: Public key
- `path`: HD wallet path
- `btcExchangeRate`: BTC to EUR exchange rate at creation
- `priceInBtc`: Required payment amount in BTC

### Unpaid Table
- `id`: Payment ID (foreign key)

### Paid Table
- `id`: Payment ID (foreign key)

## In Progress:
- `Create Transaction`: send funds from address 1 to address 2. Unfortunately, BlockCypher do not support creating TX in testnet3. Yes I am broke :D   


## License

[MIT License]
