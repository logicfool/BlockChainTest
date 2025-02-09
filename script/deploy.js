const {ethers} = require("hardhat");

async function deploy(){
    const managerContract = await ethers.getContractFactory("Manager");
    const manager = await managerContract.deploy();
    console.log("Manager deployed to:", await manager.getAddress());
    return manager;
}


if (require.main === module) {
    deploy();
}