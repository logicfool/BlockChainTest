const {ethers} = require("hardhat");

async function readBook(id){
    const managerContract = await ethers.getContractAt("Manager",process.env.MANAGER_ADDRESS);
    const book = await managerContract.getBook(id);
    console.log(`Book ${book.id} : ${book.name} by ${book.author}`);
}

if (require.main === module) {
    // console.log(process.argv);
    readBook(0);
}