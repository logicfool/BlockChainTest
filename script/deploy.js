const {ethers} = require("hardhat");

async function deploy(){
    const managerContract = await ethers.getContractFactory("Manager");
    const wallets = await ethers.getSigners();
    // console.log("Deploying With Wallet : ",wallets[0].getAddress())
    const manager = await managerContract.deploy();
    console.log("Manager deployed to:", await manager.getAddress());
    return manager;
}


if (require.main === module) {
    deploy();
}