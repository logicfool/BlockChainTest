require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks:{
    "ethereum":{
      url: "https://ethereum-rpc.publicnode.com",
    }
  }
};
