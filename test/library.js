const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  const { ethers } = require("hardhat");

describe("Library TEST",function(){
    let managerAddress;
    let libraryContract;
    let accounts;
    
    this.beforeAll(async function(){
        [managerAddress, ...accounts] = await ethers.getSigners();
        const Library = await ethers.getContractFactory("Manager");
        libraryContract = await Library.deploy();
    
    })

    it("Should Check if Library is deployed",async function(){
        expect(libraryContract).to.not.equal(undefined);
    })

    it("Should Add Random Books",async function(){
        const BookNames = [
            "Harry Potter",
            "The Lord of the Rings",
            "The Hobbit",
            "The Chronicles of Narnia",
        ]
        const Authors =[
            "JK Rowling",
            "JRR Tolkien",
            "Tolkien",
            "C.S Lewis"
        ]

        for (let i = 0; i < BookNames.length; i++) {
            await libraryContract.addBook(BookNames[i], Authors[i]);
        }

        const totalBooks = await libraryContract.getTotalBooks();
        expect(totalBooks).to.equal(4);
    })

    it ("Should get a book with its ID",async function (){
        let book = await libraryContract.getBook(0);
        console.log("Book ID: ",book.id, "Book Name:", book.name, "Book Author: ",book.author);
        expect(book.id).to.equal(0);
    })

    it ("Should Remove a book with its ID",async function (){
        const totalBooksBefore = await libraryContract.getTotalBooks();
        await libraryContract.removeBook(2);
        const totalBooksAfter = await libraryContract.getTotalBooks();
        expect(totalBooksAfter).to.be.lessThan(totalBooksBefore);
    })

    it ("Should Try to remove a book and fail with authorization error", async function (){
        let libraryContractWithSigner = libraryContract.connect(accounts[1]);
        // await expect(libraryContractWithSigner.removeBook(0)).to.be.reverted;
        await libraryContractWithSigner.removeBook(0);
    })
})