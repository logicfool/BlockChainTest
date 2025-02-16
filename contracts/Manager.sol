pragma solidity ^0.8;

import {Library} from "./Library.sol";

contract Manager is Library{

    address public librarian;

    modifier onlyLibrarian(){
        require(msg.sender == librarian, "You are not the librarian");
        _;
    }

    event BookAdded(uint id, string name, string author);
    constructor() {
        librarian = msg.sender;
    }

    function changeLibrarian(address _librarian) public onlyLibrarian {
        librarian = _librarian;
    }

    function addBook(string memory _name, string memory _author) public override{
        uint id;
        if (binnedIDS.length > 0){
            id = binnedIDS[binnedIDS.length - 1];
            delete binnedIDS[binnedIDS.length - 1];
        }else{
            id = totalBooks;
        }
        Book memory b = Book({
            id: id,
            name: _name,
            author: _author
        });
        _Library[id] = b;
        totalBooks++;
        emit BookAdded(id, _name, _author);
    }
    // keccak256("removeBook(uint)")
    function removeBook(uint _id) public override onlyLibrarian {
        delete _Library[_id];
        binnedIDS.push(_id);
        totalBooks--;
    }
    
    // keccak256("removeBook(uint,bool)")
    function removeBook(uint _id, bool toBin) public onlyLibrarian{

    }

    function getBook(uint _id) public view returns (Book memory) {
        return _Library[_id];
    }

    function getEmptyIDS() public view returns (uint[] memory) {
        return binnedIDS;
    }
}
