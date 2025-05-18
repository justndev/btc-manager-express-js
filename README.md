# Bitcoin Payment Manager (In Progress...)

A Node.js application for processing Bitcoin payments with automatic payment status checking and management. It uses BlockCypher API and requires BIP39 wallet for further HDWallet operations.

## Overview

This service allows you to create and manage Bitcoin payment processes. It generates unique Bitcoin addresses for payments, tracks their status, and provides APIs for payment creation and verification. Currently, API allows to manually check if created payment was paid. But there is also implemented an algorithm, which will be checking unpaid addresses (6 times) in one day period. 

## Features

- **Bitcoin Address Generation**: Creates unique Bitcoin addresses for each payment
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
npm start
```

## API Endpoints

### Create Payment
```
GET /payment/create
```
Creates a new payment and returns the Bitcoin address and payment ID.

**Response:**
```json
{
  "address": "bitcoin_address",
  "id": "payment_id"
}
```

### Check Payment Status
```
GET /payment/check?id=payment_id
```
Checks the status of a payment by ID.

**Response:**
- If paid: `"Payment was paid!"`
- If unpaid: `"Not enough money transferred. Current balance: [balance], required: [required_amount]"`
- If error: `"Too many request or unexpected error"`

## System Architecture

### Components

1. **Main Service**: Manages payment creation and status checking
2. **BTC Service**: Interacts with BlockCypher API for Bitcoin operations
3. **DB Service**: Handles database operations
4. **Worker Thread Manager**: Runs background jobs for checking unpaid payments

### Payment Lifecycle

1. Payment is created with a unique Bitcoin address
2. Payment status is initially set to "unpaid"
3. Worker thread periodically checks payment status
4. When sufficient funds are received, payment status changes to "paid"

### Payment Status Checking Algorithm

The system uses a smart checking algorithm with increasing intervals:
- First 3 checks: Every 20 minutes
- 4th check: After 60 minutes
- 5th check: After 180 minutes
- 6th check: After 19 hours

## Database Schema

### Payments Table
- `id`: UUID, primary key
- `IP`: Client IP address
- `lastTimeChecked`: Timestamp of last status check
- `totalChecks`: Number of status checks performed
- `createdAt`: Payment creation timestamp
- `status`: Payment status ('paid' or 'unpaid')
- `senderWallet`: Sender's wallet (if available)
- `address`: Bitcoin address for payment
- `public`: Public key
- `path`: HD wallet path
- `btcExchangeRate`: BTC to EUR exchange rate at creation
- `priceInBtc`: Required payment amount in BTC

### Unpaid Table
- `id`: Payment ID (foreign key)

### Paid Table
- `id`: Payment ID (foreign key)
- `paidAt`: Timestamp when payment was marked as paid

## License

[MIT License]
