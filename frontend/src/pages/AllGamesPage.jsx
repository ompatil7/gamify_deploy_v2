// import React, { useEffect, useState } from "react";
// import {
//   Divider,
//   Heading,
//   SimpleGrid,
//   Stack,
//   useColorModeValue,
// } from "@chakra-ui/react";
// import Game from "../components/Game";
// import useShowToast from "../hooks/useShowToast";
// // import { useRecoilState } from "recoil";
// // import gamesAtom from "../atoms/gamesAtom";

// const games = [
//   { id: 1, name: "Valorant", image: "./valorant.jpeg" },
//   { id: 2, name: "CS:GO", image: "./cyberpunk.jpg" },
//   { id: 3, name: "League of Legends", image: "" },
//   // Add more games as needed
// ];

// const AllGamesPage = () => {
//   const [games, setGames] = useState([]);
//   // const [games, setGames] = useRecoilState(gamesAtom);
//   const showToast = useShowToast();

//   useEffect(() => {
//     const fetchGames = async () => {
//       try {
//         const res = await fetch(`/api/games/all`);
//         const data = await res.json();
//         if (data.error) {
//           showToast("Error", data.error, "error");
//         } else {
//           setGames(data);
//           // console.log("games", data);
//         }
//       } catch (error) {
//         showToast("Error", error.message, "error");
//       }
//     };
//     fetchGames();
//   }, [setGames, showToast]);

//   return (
//     <>
//       <Heading
//         textAlign={"center"}
//         color={useColorModeValue("black", "#E08D79")}
//       >
//         Look for players
//       </Heading>
//       <Divider />
//       {/* <Stack spacing={3} mt={6} direction={{ md: "row", sm: "column" }}>
//         {games?.map((game) => (
//           <Game key={game.id} game={game} />
//         ))}
//       </Stack> */}
//       <Stack spacing={3} mt={6}>
//         <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={4}>
//           {games?.map((game) => (
//             <Game key={game._id} game={game} />
//           ))}
//         </SimpleGrid>
//       </Stack>
//     </>
//   );
// };

// export default AllGamesPage;
import React, { useEffect, useState } from "react";
import {
  Divider,
  Heading,
  SimpleGrid,
  Stack,
  useColorModeValue,
  Skeleton,
} from "@chakra-ui/react";
import Game from "../components/Game";
import useShowToast from "../hooks/useShowToast";

const AllGamesPage = () => {
  const [games, setGames] = useState([]);
  const showToast = useShowToast();
  const isLoading = games.length === 0;

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch(`/api/games/all`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
        } else {
          setGames(data);
        }
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    fetchGames();
  }, [setGames, showToast]);

  return (
    <>
      <Heading
        textAlign={"center"}
        color={useColorModeValue("black", "#FFD0D0")}
      >
        Look for players
      </Heading>
      {/* <Divider /> */}
      <Stack spacing={3} mt={6}>
        {/* Show skeletons while loading */}
        {isLoading ? (
          <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={4}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} height="200px" borderRadius="lg" />
            ))}
          </SimpleGrid>
        ) : (
          <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={4}>
            {games.map((game) => (
              <Game key={game._id} game={game} />
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </>
  );
};

export default AllGamesPage;
