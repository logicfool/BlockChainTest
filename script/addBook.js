const {ethers} = require("hardhat");
require("dotenv").config();

async function addBook(name,author){
    const managerContract = await ethers.getContractAt("Manager",process.env.MANAGER_ADDRESS);
    (await managerContract.addBook(name,author)).wait();
    console.log(`Book ${name} by ${author} added successfully`);
}

if (require.main === module) {
    // console.log(process.argv);
    addBook("Harry","JK");
}