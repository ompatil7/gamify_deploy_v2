import React from "react";
import {
  Button,
  Flex,
  Image,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import { DeleteIcon } from "@chakra-ui/icons";

const GameAdminCard = ({ game, games, setGames }) => {
  const showToast = useShowToast();

  const handleDeleteGame = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this game?")) return;

    try {
      const res = await fetch(`/api/games/delete/${game._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
      } else {
        showToast("Success", "Game deleted successfully", "success");
        setGames(games.filter((g) => g._id !== game._id));
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return (
    <Flex
      key={game._id}
      p={4}
      borderWidth={1}
      borderRadius={"lg"}
      alignItems={"center"}
      justifyContent={"space-between"}
      direction={{ base: "column", md: "row" }}
      mb={4}
    >
      <Flex
        alignItems={"center"}
        flexDirection={{ base: "column", md: "row" }}
        mb={{ base: 4, md: 0 }}
      >
        <Image
          boxSize="100px"
          src={game.logo}
          alt={game.name}
          mr={{ base: 0, md: 4 }}
          mb={{ base: 4, md: 0 }}
        />
        <Stack>
          <Text fontSize="xl" fontWeight="bold" color={"#40A578"}>
            {game.name}
          </Text>
          {/* <Text fontSize="sm">{truncateDescription(game.description)}</Text> */}
          <Text color={"#A91D3A"}>Players: {game.players.length}</Text>
        </Stack>
      </Flex>
      <Button
        colorScheme="red"
        onClick={handleDeleteGame}
        alignSelf={{ base: "flex-end", md: "center" }}
        m={1}
      >
        <DeleteIcon />
      </Button>
    </Flex>
  );
};

export default GameAdminCard;
