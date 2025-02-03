const {ethers} = require("hardhat");

async function main(){
    const balance = await ethers.provider.getBalance("0xe40a79C4ca144954b3Eb468c290EE01E7bE5B59d");
    console.log("Balance: ", ethers.formatEther(balance));
}

if (require.main === module) {
    main();
}
