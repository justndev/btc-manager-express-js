const axios = require("axios");
require("dotenv").config();
const token = process.env.BLOCKCYPHER_TOKEN

class BtcService {
    async createHDWallet(extendedPublicKey) {
        try {
            const url = `https://api.blockcypher.com/v1/btc/main/wallets/hd?token=${token}`;

            const data = {
                name: "MyHDWallet",
                extended_public_key: extendedPublicKey
            };

            const response = await axios.post(url, data);
            return response.data;
        } catch (error) {
            console.error('Error creating HD wallet:', error.message);
            if (error.response) {
                console.error('API response:', error.response.data);
            }
            throw error;
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
        } catch (error) {
            console.error('Error creating HD wallet:', error.message);
            if (error.response) {
                console.error('API response:', error.response.data);
            }
            throw error;
        }
    }

    async getHDWallet() {
        try {
            const url = `https://api.blockcypher.com/v1/btc/main/wallets/hd/${"MyHDWallet"}?token=${token}`

            const response = await axios.get(url);
            console.log(response.data);
        } catch (error) {

        }
    }

    async getTestHDWallet() {
        try {
            const url = `https://api.blockcypher.com/v1/btc/test3/wallets/hd/${"MyTestHDWallet"}?token=${token}`

            const response = await axios.get(url);
            console.log(response.data);
        } catch (error) {

        }
    }

    async deriveAddress() {
        try {
            const HDWalletName = 'MyHDWallet'
            console.log(`token: ${token}`)
            const url = `https://api.blockcypher.com/v1/btc/main/wallets/hd/${HDWalletName}/addresses/derive?token=${token}`
            const response = await axios.post(url);
            return response.data.chains[0].chain_addresses[0];
        } catch (e) {
            console.error(`@deriveAddress: ${e}`);
            throw e;
        }
    }

    async deriveTestAddress() {
        try {
            const HDWalletName = 'MyTestHDWallet'
            console.log(`token: ${token}`)
            const url = `https://api.blockcypher.com/v1/btc/test3/wallets/hd/${HDWalletName}/addresses/derive?token=${token}`
            const response = await axios.post(url);
            return response.data.chains[0].chain_addresses[0];
        } catch (e) {
            console.error(`@deriveAddress: ${e}`);
            throw e;
        }
    }

    async createTestWebHook(address) {
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
    }

    async checkAddressBalance(address) {
        var response = ''
        try {
            const url = `https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance?token=${token}`
            response = await axios.get(url, {token: token});
            return response.data.balance;
        } catch (e) {
            console.error(`@checkAddressBalance: ${e}`);
            throw e;
        }
    }

    createSubsequentWallet() {

    }

    checkSubsequentWalletBalance() {

    }
}


module.exports = new BtcService();

