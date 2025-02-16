import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  ChakraProvider,
  Box,
  VStack,
  Heading,
  Input,
  Button,
  Text,
  Container,
  useToast
} from '@chakra-ui/react';
import './App.css';

// ABI will need to be replaced with your actual contract ABI
const contractABI = [
  "function addBook(string memory _name, string memory _author) public",
  "function removeBook(uint _id) public",
  "function getBook(uint _id) public view returns (tuple(uint id, string name, string author))",
  "function getTotalBooks() public view returns (uint)",
  "function getEmptyIDS() public view returns (uint[] memory)",
  "function changeLibrarian(address _librarian) public onlyOwner",
  "function librarian() public view returns (address)"
];

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ name: '', author: '' });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [librarian, setLibrarian] = useState(null);
  const [address, setAddress] = useState(null);
  const [newLibrarian, setNewLibrarian] = useState('');


  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(provider);
          
          const contractAddress = '0x1bBD4f5BC056e2606292E85E2D5944E371C57377';
          const contract = new ethers.Contract(contractAddress, contractABI, provider.getSigner());
          setContract(contract);
          const librarian = await contract.librarian();
          setLibrarian(librarian);
          const address = await provider.getSigner().getAddress();
          setAddress(address);
        } catch (error) {
          console.error('Error initializing:', error);
        }
      } else {
        toast({
          title: 'Error',
          description: 'Please install MetaMask to use this application',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    init();
  }, []);

  useEffect(() => {
    console.log("Calling Load Books");
    loadBooks();
  },[contract])

  const loadBooks = async () => {
    if (!contract) return;
    try {
      setLoading(true);
      let totalBooks = await contract.getTotalBooks();
      console.log("Total Books : ",totalBooks);
      const emptyIDS = await contract.getEmptyIDS();
      totalBooks += emptyIDS.length;
      const loadedBooks = [];
      
      for (let i = 0; i < totalBooks; i++) {
        try {
          const book = await contract.getBook(i);
          if (book.name !== '') {
            loadedBooks.push(book);
          }
        } catch (error) {
          console.error(`Error loading book ${i}:`, error);
        }
      }
      
      setBooks(loadedBooks);
    } catch (error) {
      console.error('Error loading books:', error);
      toast({
        title: 'Error',
        description: 'Failed to load books',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const changeLibrarian = async () => {
    if (!ethers.utils.getAddress(address) == ethers.utils.getAddress(librarian)){
      toast({
        title: 'Error',
        description: 'Only Librarian can add books',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
    if (!contract || !newLibrarian) return;
    try {
      setLoading(true);
      const tx = await contract.changeLibrarian(newLibrarian);
      await tx.wait();
      
      toast({
        title: 'Success',
        description: 'Librarian changed successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Error changing librarian:', error);
      toast({
        title: 'Error',
        description: 'Failed to change librarian',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false);
    }
  }

  const addBook = async () => {
    if (!ethers.utils.getAddress(address) == ethers.utils.getAddress(librarian)){
      toast({
        title: 'Error',
        description: 'Only Librarian can add books',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
    if (!contract || !newBook.name || !newBook.author) return;
    try {
      setLoading(true);
      const tx = await contract.addBook(newBook.name, newBook.author);
      await tx.wait();
      
      toast({
        title: 'Success',
        description: 'Book added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setNewBook({ name: '', author: '' });
      loadBooks();
    } catch (error) {
      console.error('Error adding book:', error);
      toast({
        title: 'Error',
        description: 'Failed to add book',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const removeBook = async (id) => {
    if (!ethers.utils.getAddress(address) == ethers.utils.getAddress(librarian)){
      toast({
        title: 'Error',
        description: 'Only Librarian can add books',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
    if (!contract) return;
    try {
      setLoading(true);
      const tx = await contract.removeBook(id);
      await tx.wait();
      
      toast({
        title: 'Success',
        description: 'Book removed successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      loadBooks();
    } catch (error) {
      console.error('Error removing book:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove book',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChakraProvider>
      <Container maxW="container.md" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading>Library Management System</Heading>
          
          <Box>
            <Heading size="md" mb={4}>Add New Book</Heading>
            <VStack spacing={4}>
              <Input
                placeholder="Book Name"
                value={newBook.name}
                onChange={(e) => setNewBook({ ...newBook, name: e.target.value })}
              />
              <Input
                placeholder="Author"
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              />
              <Button
                colorScheme="blue"
                onClick={addBook}
                isLoading={loading}
                isDisabled={!newBook.name || !newBook.author}
              >
                Add Book
              </Button>
            </VStack>
          </Box>

          <Box>
            <Heading size="md" mb={4}>Book List</Heading>
            {books.length > 0 ? (
              <VStack spacing={4} align="stretch">
                {books.map((book) => (
                  <Box key={book.id} p={4} borderWidth={1} borderRadius="md" display="flex" justifyContent="space-between" alignItems="center">
                    <VStack align="start" spacing={1}>
                      <Text><strong>ID:</strong> {book.id.toString()}</Text>
                      <Text><strong>Name:</strong> {book.name}</Text>
                      <Text><strong>Author:</strong> {book.author}</Text>
                    </VStack>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => removeBook(book.id)}
                      isLoading={loading}
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text>No books available</Text>
            )}
          </Box>

          <Box>
            <Text>The Librarian is: {librarian}</Text>
            <Text>{address ? ethers.utils.getAddress(address) == ethers.utils.getAddress(librarian) ? "You are the librarian" : "You are not the librarian" : "Please connect your wallet"}</Text>
            <VStack spacing={4}>
            <Text>Change Librarian: </Text>

            <Input
              placeholder="Librarian Address"
              value={newLibrarian}
              onChange={(e) => setNewLibrarian(e.target.value)}
            />

            <Button
              colorScheme="blue"
              onClick={changeLibrarian}
              isLoading={loading}
              isDisabled={!newLibrarian}
            >
              Change Librarian
            </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </ChakraProvider>
  );
}

export default App;
