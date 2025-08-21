require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // To manage private keys securely

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20", // The same version as in our contract
  networks: {
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      accounts: [process.env.PRIVATE_KEY] // We will set this up later
    }
  }
};