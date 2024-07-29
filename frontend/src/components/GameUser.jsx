import React from "react";
import {
  Box,
  Flex,
  Text,
  Stack,
  useColorModeValue,
  Button,
  Avatar,
} from "@chakra-ui/react";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import { Link } from "react-router-dom";

const GameUser = ({ user }) => {
  const { handleFollowUnfollow, updating, following } = useFollowUnfollow(user);
  return (
    <Box
      p={4}
      borderWidth={1}
      borderRadius={"lg"}
      overflow="hidden"
      bg={useColorModeValue("white", "gray.dark")}
      boxShadow="md"
      _hover={{ transform: "scale(1.05)", transition: "transform 0.3s" }}
      height="auto" // Adjust height as needed
      cursor="pointer"
    >
      <Flex
        direction={{ base: "column", md: "column", sm: "row" }}
        justify={"space-between"}
        align={"center"}
        gap={{ md: 4, sm: 0 }}
      >
        <Flex
          // align="center"
          direction={{ base: "row", md: "row" }} // Change direction based on screen size
          h="full"
          justifyContent="space-between"
        >
          <Flex
            align="center"
            direction={{ base: "row", md: "row" }}
            flex={1}
            gap={3}
          >
            <Avatar
              as={Link}
              to={`/${user.username}`}
              src={user.profilePic}
              size={{ md: "xl", sm: "lg" }}
            />
            {/* <Image
              borderRadius="full"
              boxSize="60px"
              src={user.profilePic}
              alt={user.name}
              // mr={{ base: 4, md: 0 }}
              // mb={{ base: 0, md: 4 }}
            /> */}
            <Stack
              spacing={2}
              textAlign={{ base: "left", md: "left" }}
              flex={1}
            >
              <Text
                fontWeight="bold"
                fontSize="lg"
                as={Link}
                to={`/${user.username}`}
              >
                {user.name}
              </Text>
              <Text
                color="gray.500"
                fontSize="sm"
                as={Link}
                to={`/${user.username}`}
              >
                {user.username}
              </Text>
              <Text>Rank : {user.games[0].rank}</Text>
            </Stack>
          </Flex>
        </Flex>
        <Button
          w={{ md: "full", sm: "" }}
          // size={"sm"}
          color={"white"}
          // bg={following ? "gray." : "blue.900"}
          onClick={handleFollowUnfollow}
          isLoading={updating}
        >
          {following ? "Unfollow" : "Follow"}
        </Button>
      </Flex>
    </Box>
  );
};

export default GameUser;
