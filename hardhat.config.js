require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks:{
    "ethereum":{
      url: "https://ethereum-rpc.publicnode.com",
    },
    "sepolia":{
      "url": "https://sepolia.drpc.org",
      "accounts": [process.env.PRIVATE_KEY]
    }
  },
  // add accounts
};
