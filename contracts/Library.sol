pragma solidity ^0.8;

contract Library {
    struct Book{
        uint id;
        string name;
        string author;
    }

    mapping(uint => Book) internal _Library;
    uint internal totalBooks;
    uint[] internal binnedIDS;

    // efficient algorithm that can check if a certain ID is free in the binnedIDS

    // Virtual means I can override this function in child Contracts (Derive or impliment this contract) 
    function addBook(string memory _name, string memory _author) virtual public {}

    function removeBook(uint _id) virtual public {}

    function getTotalBooks() public view returns (uint) {
        return totalBooks;
    }
}