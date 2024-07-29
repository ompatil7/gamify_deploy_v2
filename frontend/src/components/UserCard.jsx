import React from "react";
import { Text, Flex, Box, Avatar, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
// import useFollowUnfollow from "../hooks/useFollowUnfollow";

const UserCard = ({ user }) => {
  //   const { handleFollowUnfollow, updating, following } = useFollowUnfollow(user);
  const following = false;
  return (
    <>
      <Flex
        pt={2}
        gap={4}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        {/* left side */}
        <Flex gap={2} as={Link} to={``}>
          <Avatar src="" />
          <Box>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              Om Patil
            </Text>
            <Text color={"gray.light"} fontSize={"sm"}>
              ompatil
            </Text>
          </Box>
        </Flex>
        {/* right side */}
        <Flex gap={4}>
          <Text color={"yellow"}>Gold</Text>
          <Button
            size={"sm"}
            color={following ? "black" : "white"}
            bg={following ? "white" : "blue.400"}
            //   onClick={handleFollowUnfollow}
            //   isLoading={updating}
            _hover={{
              color: following ? "black" : "white",
              opacity: ".8",
            }}
          >
            {following ? "Unfollow" : "Follow"}
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default UserCard;
