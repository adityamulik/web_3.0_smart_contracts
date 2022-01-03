// https://eth-ropsten.alchemyapi.io/v2/0ATfvitg9EyxOq7srEo24M3aPGyjD6o0

require('dotenv').config();
require('@nomiclabs/hardhat-waffle');

const privateKey = process.env.ACCOUNT_PRIVATE_KEY;

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: "https://eth-ropsten.alchemyapi.io/v2/0ATfvitg9EyxOq7srEo24M3aPGyjD6o0",
      accounts: [privateKey]
    }
  }
}