/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Divider, Heading, Stack, useColorModeValue } from "@chakra-ui/react";
import AddGame from "../components/AddGame"; // Adjust the import path as needed
import useShowToast from "../hooks/useShowToast";
import GameAdminCard from "../components/GameAdminCard";

const GameOperationsPage = () => {
  const [games, setGames] = useState([]);
  const showToast = useShowToast();

  const fetchGames = async () => {
    try {
      const res = await fetch("/api/games/all");
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
      } else {
        setGames(data);
        console.log("games", data);
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  const handleGameAdded = () => {
    fetchGames();
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <>
      <Heading
        textAlign={"center"}
        color={useColorModeValue("black", "#E08D79")}
      >
        Game Admin Panel
      </Heading>
      <Divider />
      <AddGame onGameAdded={handleGameAdded} />

      <Stack spacing={3} mt={6}>
        {games?.map((game) => (
          <GameAdminCard
            game={game}
            key={game._id}
            games={games}
            setGames={setGames}
          />
        ))}
      </Stack>
    </>
  );
};

export default GameOperationsPage;
