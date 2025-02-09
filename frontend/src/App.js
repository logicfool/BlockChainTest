import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ChakraProvider, Box, VStack, Heading, Input, Button, Text, useToast, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import './App.css';

// ABI will need to be replaced with your actual contract ABI
const contractABI = [
  "function addBook(string memory _name, string memory _author) public",
  "function removeBook(uint _id) public",
  "function getBook(uint _id) public view returns (tuple(uint id, string name, string author))",
  "function getTotalBooks() public view returns (uint)",
  "function getEmptyIDS() public view returns (uint[] memory)"
];

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ name: '', author: '' });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(provider);
          
          // Replace with your deployed contract address
          const contractAddress = ''; // TODO: Add your contract address
          const contract = new ethers.Contract(contractAddress, contractABI, provider.getSigner());
          setContract(contract);
          
          loadBooks();
        } catch (error) {
          console.error('Error initializing:', error);
        }
      } else {
        toast({
          title: 'MetaMask not found',
          description: 'Please install MetaMask to use this application',
          status: 'error',
          duration: 5000,
        });
      }
    };
    init();
  }, []);

  const loadBooks = async () => {
    if (!contract) return;
    try {
      setLoading(true);
      const totalBooks = await contract.getTotalBooks();
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
      });
    } finally {
      setLoading(false);
    }
  };

  const addBook = async () => {
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
      });
    } finally {
      setLoading(false);
    }
  };

  const removeBook = async (id) => {
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
      });
      
      loadBooks();
    } catch (error) {
      console.error('Error removing book:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove book',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChakraProvider>
      <Box p={8}>
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
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Name</Th>
                    <Th>Author</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {books.map((book) => (
                    <Tr key={book.id}>
                      <Td>{book.id.toString()}</Td>
                      <Td>{book.name}</Td>
                      <Td>{book.author}</Td>
                      <Td>
                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={() => removeBook(book.id)}
                          isLoading={loading}
                        >
                          Remove
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text>No books available</Text>
            )}
          </Box>
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;
