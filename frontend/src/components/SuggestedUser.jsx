import React from "react";
import { Text, Flex, Box, Avatar, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const SuggestedUser = ({ user }) => {
  const { handleFollowUnfollow, updating, following } = useFollowUnfollow(user);
  return (
    <>
      <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
        {/* left side */}
        <Flex gap={2} as={Link} to={`${user.username}`}>
          <Avatar src={user.profilePic ? user.profilePic : ""} />
          <Box>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user.name}
            </Text>
            <Text color={"gray.light"} fontSize={"sm"}>
              {user.username}
            </Text>
          </Box>
        </Flex>
        {/* right side */}
        <Button
          size={"sm"}
          color={following ? "black" : "white"}
          bg={following ? "white" : "blue.400"}
          onClick={handleFollowUnfollow}
          isLoading={updating}
          _hover={{
            color: following ? "black" : "white",
            opacity: ".8",
          }}
        >
          {following ? "Unfollow" : "Follow"}
        </Button>
      </Flex>
    </>
  );
};

export default SuggestedUser;
