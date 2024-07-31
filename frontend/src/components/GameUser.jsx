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
      cursor="pointer"
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        justify={"space-between"}
        align={"center"}
        gap={4}
      >
        <Flex align="center" flex={1} gap={4}>
          <Avatar
            as={Link}
            to={`/${user.username}`}
            src={user.profilePic}
            size="lg"
          />
          <Stack spacing={1}>
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
            <Text>Rank: {user.games[0].rank}</Text>
          </Stack>
        </Flex>
        <Button
          w={{ base: "full", sm: "auto" }}
          colorScheme={following ? "gray" : "blue"}
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
