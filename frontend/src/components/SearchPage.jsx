import React, { useState, useEffect } from "react";
import {
  Input,
  Box,
  Heading,
  Text,
  VStack,
  IconButton,
  useColorModeValue,
  List,
  Skeleton,
  SimpleGrid,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import axios from "axios";
import UserProfile from "./UserProfile"; // Import the UserProfile component

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce effect to delay search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Delay of 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch search results when debounced search term changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedSearchTerm.trim() === "") {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `/api/users/search?query=${debouncedSearchTerm}`
        );
        setSearchResults(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedSearchTerm]);

  return (
    <Box p={4} color={useColorModeValue("black", "white")}>
      <Heading mb={4}>Search</Heading>
      <Box display="flex" alignItems="center" mb={4}>
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          size="md"
        />
        {searchTerm && (
          <IconButton
            aria-label="Clear search"
            icon={<CloseIcon />}
            size="md"
            ml={2}
            onClick={() => setSearchTerm("")}
          />
        )}
      </Box>

      <Heading size="md" mt={4} mb={2}>
        Results
      </Heading>
      {loading ? (
        <VStack spacing={4}>
          {Array(5)
            .fill("")
            .map((_, index) => (
              <Skeleton key={index} height="20px" width="100%" />
            ))}
        </VStack>
      ) : (
        <SimpleGrid mb={5} columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {searchResults.length > 0
            ? searchResults.map((user, index) => (
                <UserProfile key={index} user={user} />
              ))
            : debouncedSearchTerm && <Text>No results found.</Text>}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default SearchPage;
