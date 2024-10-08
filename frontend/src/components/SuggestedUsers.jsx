import { Text, Flex, Box, SkeletonCircle, Skeleton } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import SuggestedUser from "./SuggestedUser";
import useShowToast from "../hooks/useShowToast";
import { baseUrl } from "../url";
const SuggestedUsers = () => {
  const [loading, setLoading] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const showToast = useShowToast();

  useEffect(() => {
    const getSuggestedUsers = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/users/suggested`, {
          method: "GET",
          credentials: "include", // Include credentials such as cookies
        });
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.message, "error");
          return;
        }

        console.log(data);
        setSuggestedUsers(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getSuggestedUsers();
  }, [showToast]);
  return (
    <>
      <Text mb={4} fontWeight={"bold"}>
        Suggested Users
      </Text>
      <Flex direction={"column"} gap={4}>
        {!loading &&
          suggestedUsers.map((user) => (
            <SuggestedUser key={user._id} user={user} />
          ))}
        {loading &&
          [0, 1, 2, 3, 4].map((_, idx) => (
            <Flex
              key={idx}
              gap={2}
              alignItems={"center"}
              p={1}
              borderRadius={"md"}
            >
              {/* avatar skeleton */}
              <Box>
                <SkeletonCircle size={10} />
              </Box>
              {/* username and fullname skeletoin */}
              <Flex flexDirection={"column"} w={"full"} gap={2}>
                <Skeleton h={"8px"} w={"80px"} />
                <Skeleton h={"8px"} w={"90px"} />
              </Flex>

              <Flex>
                <Skeleton h={"20px"} w={"20px"} />
              </Flex>
            </Flex>

            // follow unfollow
          ))}
      </Flex>
    </>
  );
};

export default SuggestedUsers;
