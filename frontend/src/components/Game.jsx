import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Text,
  Flex,
  Stack,
  Heading,
  Tag,
  useColorModeValue,
} from "@chakra-ui/react";

const Game = ({ game }) => {
  // const truncateDescription = (description) => {
  //   if (description.length > 170) {
  //     return `${description.substring(0, 167)}...`;
  //   }
  //   return description;
  // };

  return (
    <Link to={`/games/${game.name}`}>
      <Box
        key={game._id}
        p={4}
        borderWidth={1}
        borderRadius={"lg"}
        mb={4}
        overflow="hidden"
        position="relative"
        _hover={{ transform: "scale(1.05)", transition: "transform 0.3s" }}
        w="full"
        h="210px" // Adjust height as needed
        _before={{
          content: `""`,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${game.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1,
          opacity: 0.4, // Adjust opacity as needed (0 to 1)
        }}
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          alignItems={{ base: "flex-start", md: "center" }}
          justifyContent={"space-between"}
          p={4}
          borderRadius={"lg"}
          // bg="rgba(0, 0, 0, 0.5)"
          h="full"
          w="full"
          zIndex={1}
        >
          <Stack spacing={4} w={"full"}>
            <Heading
              textAlign={"center"}
              fontSize="3xl"
              fontWeight="bold"
              color={useColorModeValue("black", "white")}
            >
              {game.name}
            </Heading>
            {/* <Text fontSize="sm">{truncateDescription(game.description)}</Text> */}
            {/* <Text color={"#A91D3A"}>Players: {game.players.length}</Text> */}
          </Stack>
        </Flex>
        <Flex position="absolute" bottom={4} left={4} flexWrap="wrap" gap={2}>
          {game.tags.map((tag, index) => (
            <Tag key={index} size={"sm"} variant="solid" colorScheme="blue">
              {tag}
            </Tag>
          ))}
        </Flex>
        <Tag
          size={"2xl"}
          variant="solid"
          colorScheme="green"
          p={2}
          position="absolute"
          bottom={4}
          right={4}
        >
          Players : {game.players.length}
        </Tag>
      </Box>
    </Link>
  );
};

export default Game;
