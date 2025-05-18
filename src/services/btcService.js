const axios = require("axios");
const BLOCKCYPHER_TOKEN = process.env.BLOCKCYPHER_TOKEN
    class BtcService {
        async createHDWallet(extendedPublicKey) {
            try {
                const url = `https://api.blockcypher.com/v1/btc/main/wallets/hd?token=${BLOCKCYPHER_TOKEN}`;

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

        async checkAddressBalance(address ) {
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

