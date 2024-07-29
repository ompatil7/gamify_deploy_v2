import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";

const UpdateGameModal = ({ games, onGameUpdate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState("");
  const [rank, setRank] = useState("");
  const showToast = useShowToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/users/addgame`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId: selectedGame._id,
          gameName: selectedGame.name,
          rank,
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
      } else {
        showToast("Success", data.message, "success");
        onGameUpdate(data.game); // Pass the updated game to the callback
        onClose(); // Close the modal on success
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="pink" mb={7}>
        Add a Game or Update Rank
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Game</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Select
                    placeholder="Select Game"
                    onChange={(e) =>
                      setSelectedGame(
                        games.find((game) => game._id === e.target.value)
                      )
                    }
                  >
                    {games.map((game) => (
                      <option key={game._id} value={game._id}>
                        {game.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Rank in game</FormLabel>
                  <Input
                    placeholder="gold, silver.. (write in smallcaps)"
                    _placeholder={{ color: "gray.500" }}
                    type="text"
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                  />
                </FormControl>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button
                bg={"red.400"}
                color={"white"}
                mr={3}
                _hover={{
                  bg: "red.500",
                }}
                onClick={() => {
                  setSelectedGame("");
                  setRank("");
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button
                bg={"green.400"}
                color={"white"}
                _hover={{
                  bg: "green.500",
                }}
                type="submit"
                isLoading={loading}
              >
                Add
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGameModal;
