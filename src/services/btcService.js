const axios = require("axios");
const {bitcoin} = require("bitcoinjs-lib/src/networks");
require("dotenv").config();
const token = process.env.BLOCKCYPHER_TOKEN

class BtcService {
    // < - - - - - - - - -      HD WALLET    - - - - - - - - - >
    async createHDWallet(extendedPublicKey) {
        try {
            const url = `https://api.blockcypher.com/v1/btc/main/wallets/hd?token=${token}`;

            const data = {
                name: "MyHDWallet",
                extended_public_key: extendedPublicKey
            };

            const response = await axios.post(url, data);
            return response.data;
        } catch (e) {
            console.error(`createHDWallet: ${e.message}`);
            if (e.response) {
                console.error('API response:', e.response.data);
            }
            throw e;
        }
    }

    async createTestHDWallet() {
        try {
            const url = `https://api.blockcypher.com/v1/btc/test3/wallets/hd?token=${token}`;

            const data = {
                name: "MyTestHDWallet",
                extended_public_key: 'xpub68CYsvg2Rw5QL6t8CGA1nhs9kqFsy7q26W33bPNktG3rxPh3HFKTrd8ui8kfurViHWBzCaAu3r8ABXR3ZLqk2DQSoNz567kTv2jX1SqhH9w'
            };

            const response = await axios.post(url, data);
            return response.data;
        } catch (e) {
            console.error(`@createTestHDWallet: ${e.message}`);
            if (e.response) {
                console.error('API response:', e.response.data);
            }
            throw e;
        }
    }

    async getHDWallet() {
        try {
            const response = await axios.get(`https://api.blockcypher.com/v1/btc/main/wallets/hd/${"MyHDWallet"}?token=${token}`);
            return response.data;
        } catch (e) {
            console.error(`@getHDWallet: ${e.message}`);
            throw e;
        }
    }

    async getTestHDWallet() {
        try {
            const url = `https://api.blockcypher.com/v1/btc/test3/wallets/hd/${"MyTestHDWallet"}?token=${token}`

            const response = await axios.get(url);
            return response.data;
        } catch (e) {
            console.error(`@getTestHDWallet: ${e.message}`);
            throw e;
        }
    }

    // < - - - - - - - - -      ADDRESS    - - - - - - - - - >

    async deriveAddress() {
        try {
            const HDWalletName = 'MyHDWallet'
            const url = `https://api.blockcypher.com/v1/btc/main/wallets/hd/${HDWalletName}/addresses/derive?token=${token}`
            const response = await axios.post(url);
            return response.data.chains[0].chain_addresses[0];
        } catch (e) {
            console.error(`@deriveAddress: ${e.message}`);
            throw e;
        }
    }

    async deriveTestAddress() {
        try {
            const HDWalletName = 'MyTestHDWallet'
            const url = `https://api.blockcypher.com/v1/btc/test3/wallets/hd/${HDWalletName}/addresses/derive?token=${token}`
            const response = await axios.post(url);
            return response.data.chains[0].chain_addresses[0];
        } catch (e) {
            console.error(`@deriveTestAddress: ${e.message}`);
            throw e;
        }
    }

    async checkAddressBalance(address) {
        var response = ''
        try {
            response = await axios.get(`https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance?token=${token}`, {token: token});
            return response.data.balance;
        } catch (e) {
            console.error(`@checkAddressBalance: ${e.message}`);
            throw e;
        }
    }

    async checkTestAddressBalance(address) {
        var response = ''
        try {
            response = await axios.get(`https://api.blockcypher.com/v1/btc/test3/addrs/${address}/balance?token=${token}`, {token: token});
            return response.data.balance;
        } catch (e) {
            console.error(`@checkTestAddressBalance: ${e.message}`);
            throw e;
        }
    }

    // < - - - - - - - - -      WEBHOOKS    - - - - - - - - - >

    async createWebhook(address) {
        try {
            const response = await axios.post(`https://api.blockcypher.com/v1/btc/main/hooks?token=${token}`,
                {
                    event: 'confirmed-tx',
                    address: address,
                    url: 'https://tempchat.xyz/btc/webhook'
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
            return response.data;
        } catch(e) {
            console.error(`@createWebhook: ${e.message}`);
            throw e;
        }
    }

    async createTestWebhook(address) {
        try {
            const response = await axios.post(`https://api.blockcypher.com/v1/btc/test3/hooks?token=${token}`,
                {
                    event: 'confirmed-tx',
                    address: address,
                    url: 'https://tempchat.xyz/btc/webhook'
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
            return response.data;
        } catch (e) {
            console.error(`@createTestWebhook: ${e.message}`);
            throw e;
        }
    }

    async getWebhooks() {
        try {
            const response = await axios.get(`https://api.blockcypher.com/v1/btc/main/hooks?token=${token}`)
            return response.data;
        } catch (e) {
            console.error(`@getWebhooks: ${e.message}`);
            throw e;
        }
    }

    async getTestWebhooks() {
        try {
            const response = await axios.get(`https://api.blockcypher.com/v1/btc/test3/hooks?token=${token}`)
            return response.data;
        } catch (e) {
            console.error(`@getTestWebhooks: ${e.message}`);
            throw e;
        }
    }

    async deleteWebhookById(id) {
        try {
            await axios.delete(`https://api.blockcypher.com/v1/btc/main/hooks/${id}?token=${token}`)
        } catch (e) {
            console.error(`@deleteWebhookById: ${e.message}`);
            throw e;
        }
    }

    async deleteTestWebhookById(id) {
        try {
            await axios.delete(`https://api.blockcypher.com/v1/btc/test3/hooks/${id}?token=${token}`)
        } catch (e) {
            console.error(`@deleteTestWebhookById: ${e.message}`);
            throw e;
        }
    }

    // < - - - - - - - - -      TRANSACTIONS    - - - - - - - - - >

    // TODO: WIP
    async createTestTransaction(addressSender, addressReceiver) {
        const dto = {
            inputs: [
                {
                    addresses: [addressSender],
                }
            ],
            outputs: [
                {
                    addresses: [addressReceiver],
                }
            ],
            value: 10000
        }
        try {
            const response = await axios.post('https://api.blockcypher.com/v1/bcy/test/txs/new', dto);

        } catch (e) {
            console.log(e)
        }
    }

    /**
     * Sends BTC on Bitcoin Testnet3 from one address to another.
     *
     * @param {string} fromAddress - Sender address
     * @param {string} toAddress - Recipient address
     * @param {string} privateKeyWIF - Sender's private key in WIF format
     * @param {number} amountSatoshis - Amount to send (in satoshis)
     * @param {number} fee - Fee to subtract from balance (in satoshis)
     */
    // TODO: WIP
    async sendTestnetBTC( fromAddress, toAddress, privateKeyWIF, amountSatoshis, fee ) {
        const network = bitcoin.networks.testnet;
        const keyPair = bitcoin.ECPair.fromWIF(privateKeyWIF, network);

        try {
            // 🔍 Get UTXOs from Blockstream API
            const utxoRes = await axios.get(`https://blockstream.info/testnet/api/address/${fromAddress}/utxo`);
            const utxos = utxoRes.data;

            if (!utxos.length) throw new Error('No UTXOs found for address');

            // 🧮 Use the first UTXO
            const utxo = utxos[0];
            if (utxo.value < amountSatoshis + fee) throw new Error('Insufficient balance');

            // 🧱 Build transaction
            const psbt = new bitcoin.Psbt({ network });

            psbt.addInput({
                hash: utxo.txid,
                index: utxo.vout,
                witnessUtxo: {
                    script: bitcoin.address.toOutputScript(fromAddress, network),
                    value: utxo.value,
                },
            });

            psbt.addOutput({
                address: toAddress,
                value: amountSatoshis,
            });

            const change = utxo.value - amountSatoshis - fee;
            if (change > 0) {
                psbt.addOutput({
                    address: fromAddress,
                    value: change,
                });
            }

            psbt.signAllInputs(keyPair);
            psbt.finalizeAllInputs();

            const rawTx = psbt.extractTransaction().toHex();

            // 🚀 Broadcast transaction
            const res = await axios.post('https://blockstream.info/testnet/api/tx', rawTx, {
                headers: { 'Content-Type': 'text/plain' }
            });

            console.log('✅ Transaction broadcasted! TXID:', res.data);
            return res.data;
        } catch (e) {
            console.error('❌ Error sending transaction:', e.response?.data || e.message);
            throw e;
        }
    }

}

module.exports = new BtcService();
