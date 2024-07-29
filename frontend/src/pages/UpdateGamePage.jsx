import React, { useEffect, useState, useCallback } from "react";
import {
  Flex,
  Stack,
  Text,
  Box,
  Badge,
  Switch,
  Button,
  useColorModeValue,
  AvatarBadge,
  Heading,
} from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import useGetUserProfile from "../hooks/useGetUserProfile";
import UpdateGameModal from "../components/UpdateGameModal";
import PlayGameModal from "../components/PlayGameModal";

const UpdateGamePage = () => {
  const { user, refetch } = useGetUserProfile();
  const showToast = useShowToast();
  const [games, setGames] = useState([]);
  const [currentGame, setCurrentGame] = useState(null);
  const [playDuration, setPlayDuration] = useState(null);
  const [isPlayModalOpen, setIsPlayModalOpen] = useState(false);

  const fetchGames = useCallback(async () => {
    try {
      const res = await fetch(`/api/games/allnames`);
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
      } else {
        setGames(data);
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  }, [showToast]);

  const handleStatusChange = async (game, isPlaying) => {
    if (!isPlaying) {
      setIsPlayModalOpen(true);
      setCurrentGame(game);
      return;
    }

    try {
      const endpoint = "/api/users/remove-status";
      const payload = { gameId: game.gameId };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        showToast("Success", data.message, "success");
        refetch();
        setCurrentGame(null);
      } else {
        showToast(
          "Error",
          data.error || "Failed to update game status",
          "error"
        );
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  const handlePlaySubmit = async () => {
    try {
      const endpoint = "/api/users/set-status";
      const payload = { gameId: currentGame.gameId, playDuration };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        showToast("Success", data.message, "success");
        refetch();
        setIsPlayModalOpen(false);
        setPlayDuration(null);
        setCurrentGame(null);
      } else {
        showToast(
          "Error",
          data.error || "Failed to update game status",
          "error"
        );
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  const handleGameUpdate = (updatedGame) => {
    setGames((prevGames) =>
      prevGames.map((game) =>
        game._id === updatedGame?._id ? updatedGame : game
      )
    );
    refetch(); // Optionally refetch user profile data
  };

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  return (
    <>
      <Heading textAlign={"center"}>Game Update or Add here</Heading>
      <Flex direction="column" align="center" justify="center" my={6}>
        <UpdateGameModal games={games} onGameUpdate={handleGameUpdate} />
        {user?.games.length === 0 && (
          <Text>Add some games to your profile</Text>
        )}
        {isPlayModalOpen && (
          <PlayGameModal
            game={currentGame}
            playDuration={playDuration}
            setPlayDuration={setPlayDuration}
            onSubmit={handlePlaySubmit}
            onClose={() => setIsPlayModalOpen(false)}
          />
        )}

        <Stack spacing={4} w="full" maxW="md">
          {user?.games.map((game) => (
            <Box
              key={game._id}
              p={4}
              borderWidth={1}
              borderRadius="lg"
              overflow="hidden"
              // bg={useColorModeValue("white", "gray.800")}
              boxShadow="md"
              cursor={"pointer"}
              _hover={{
                transform: "scale(1.05)",
                transition: "transform 0.3s",
              }}
            >
              <Flex justify={"space-between"} align={"center"}>
                <Stack gap={1}>
                  <Text fontWeight="bold" fontSize="lg">
                    {game.gameName}
                  </Text>
                  <Text fontSize="md">Rank: {game.rank}</Text>
                  <Text
                    fontSize="sm"
                    color={game.isPlaying ? "green" : "#A91D3A"}
                  >
                    Status : {game.isPlaying ? "Online" : "Offline"}
                  </Text>
                </Stack>
                <Flex align="center">
                  {game.isPlaying ? (
                    <>
                      <Switch
                        isChecked={game.isPlaying}
                        colorScheme="green"
                        onChange={() =>
                          handleStatusChange(game, game.isPlaying)
                        }
                        mr={2}
                      />
                      <Badge
                        p={3}
                        borderRadius={"lg"}
                        colorScheme={game.isPlaying ? "green" : "red"}
                      >
                        {game.isPlaying ? "Online" : "Offline"}
                      </Badge>
                    </>
                  ) : (
                    <Button
                      colorScheme="green"
                      // color={"#40A578"}
                      onClick={() => handleStatusChange(game, game.isPlaying)}
                    >
                      Play
                    </Button>
                  )}
                </Flex>
              </Flex>
            </Box>
          ))}
        </Stack>
      </Flex>
    </>
  );
};

export default UpdateGamePage;
