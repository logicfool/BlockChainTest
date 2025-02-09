const {ethers} = require("hardhat");

async function removeBook(id){
    const managerContract = await ethers.getContractAt("Manager",process.env.MANAGER_ADDRESS);
    let tx = await managerContract.removeBook(id)
    console.log("Transaction Hash: ", tx.hash);
    await tx.wait();
    console.log(`Book ${id} removed successfully`);
}

if (require.main === module) {
    removeBook(0);
}