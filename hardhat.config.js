require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

module.exports = {
  solidity: "0.8.27",
  networks: {
    // localhost: {
    //   url: "http://127.0.0.1:8545",
    //   accounts: ["0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e"]
    // },
    sepolia: {
      url: process.env.URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      gasPrice: 200000000000
    }
  },
  paths: {
    artifacts: './client/src/artifacts',
  }
};
