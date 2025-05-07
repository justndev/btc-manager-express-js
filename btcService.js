const axios = require("axios");
const BLOCKCYPHER_IP= 'https://api.blockcypher.com/v1/btc/main'
const CREATE_HDWALLET_ENDPOINT = '/wallets/hd'
const BLOCKCYPHER_TOKEN = process.env.BLOCKCYPHER_TOKEN
const token = '1ae07da8e0b34b98aa43036129e1ba69'
    class BtcService {
        async createHDWallet() {
            try {
                const url = `https://api.blockcypher.com/v1/btc/main/wallets/hd?token=${'1ae07da8e0b34b98aa43036129e1ba69'}`;

                const data = {
                    name: "MyHDWallet",
                    extended_public_key: "xpub68CYsvg2Rw5QL6t8CGA1nhs9kqFsy7q26W33bPNktG3rxPh3HFKTrd8ui8kfurViHWBzCaAu3r8ABXR3ZLqk2DQSoNz567kTv2jX1SqhH9w"
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

        async deriveAddress() {
            try {
                const HDWalletName = 'MyHDWallet'
                const url = `https://api.blockcypher.com/v1/btc/main/wallets/hd/${HDWalletName}/addresses/derive?token=${token}`
                const response = await axios.post(url);
                return response.data.chains[0].chain_addresses[0];
            } catch (e) {
                console.error(`@deriveAddress: ${e}`);
                throw e;
            }
        }

        async checkAddressBalance(address = '18ytEmZHkMa3tqVs26EmENmF9nhHqWfC5F') {
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

