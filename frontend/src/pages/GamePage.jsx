import React, { useEffect, useState } from "react";
import {
  Box,
  Image,
  Text,
  Heading,
  Flex,
  useColorModeValue,
  SimpleGrid,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
} from "@chakra-ui/react";
import GameUser from "../components/GameUser";
import useShowToast from "../hooks/useShowToast";
import { useParams } from "react-router-dom";

const GamePage = () => {
  const [loading, setLoading] = useState(true);
  const [game1, setGame1] = useState(null);
  const [randomGif, setRandomGif] = useState("");
  const showToast = useShowToast();
  const { game } = useParams();

  useEffect(() => {
    const getSingleGame = async () => {
      setLoading(true); // Ensure loading state is set when the request starts
      try {
        const res = await fetch(`/api/games/${game}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setGame1(data);
        // Select a random GIF
        const gifs = data.gifs;
        setRandomGif(gifs[Math.floor(Math.random() * gifs.length)]);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getSingleGame();
  }, [game, showToast]);

  return (
    <>
      <Box
        mb={4}
        p={4}
        bg={useColorModeValue("gray.200", "gray.dark")}
        borderRadius="md"
      >
        {loading ? (
          <Skeleton height={{ md: "330px", sm: "250px" }} borderRadius="md" />
        ) : (
          <Image
            src={randomGif || game1?.image}
            alt="Banner Image"
            borderRadius="md"
            height={{ md: "400px", sm: "250px" }}
            width="100%"
            objectFit="cover"
          />
        )}

        <Flex align="center" justify="space-between" mt={4} gap={4}>
          <Box>
            {loading ? (
              <Skeleton height="40px" width="200px" />
            ) : (
              <Heading as="h1" size="xl" color={"#A91D3A"}>
                {game1?.name || "VALORANT"}
              </Heading>
            )}
            {loading ? (
              <Skeleton height="20px" width="150px" mt={2} />
            ) : (
              <Wrap mt={2}>
                {game1?.tags?.map((tag, index) => (
                  <WrapItem key={index}>
                    <Tag size="md" variant="solid" colorScheme="teal">
                      <TagLabel>{tag}</TagLabel>
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            )}
          </Box>

          {loading ? (
            <SkeletonCircle size="100px" />
          ) : (
            <Image
              src={game1?.logo || "/logo.svg"}
              alt="Game Logo"
              boxSize="100px"
            />
          )}
        </Flex>

        {loading ? (
          <SkeletonText mt={4} noOfLines={4} spacing="4" />
        ) : (
          <Text mt={4}>
            {game1?.description ||
              `Game Description \nLorem ipsum dolor sit amet consectetur adipisicing
              elit. Error laboriosam sequi sit harum voluptatum adipisci
              perspiciatis, officia, voluptatibus beatae vel quae debitis eaque, at
              iste doloribus quas obcaecati nihil illum!`}
          </Text>
        )}
      </Box>

      <Heading as="h2" size="lg" mt={8} mb={4} color={"#40A578"}>
        {loading ? (
          <Skeleton height="30px" width="300px" />
        ) : (
          `Users who play ${game1?.name}`
        )}
      </Heading>

      <SimpleGrid mb={5} columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {loading
          ? [...Array(6)].map((_, i) => (
              <Box key={i} p={5} shadow="md" borderWidth="1px">
                <SkeletonCircle size="50px" />
                <SkeletonText mt="4" noOfLines={4} spacing="4" />
              </Box>
            ))
          : game1?.players.map((user) => (
              <GameUser key={user.id} user={user} />
            ))}
      </SimpleGrid>
    </>
  );
};

export default GamePage;
