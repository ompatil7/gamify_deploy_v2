import {
  Avatar,
  Box,
  Flex,
  Text,
  VStack,
  Link,
  Menu,
  Portal,
  MenuList,
  MenuButton,
  Button,
  MenuItem,
  useToast,
} from "@chakra-ui/react"; //might be from layout sometinmes if anytrhging crashes
// import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";
import { Link as RouterLink } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

function UserHeader({ user }) {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom); //loggedin user
  const { handleFollowUnfollow, updating, following } = useFollowUnfollow(user);

  const copyURL = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      console.log("copied url to clipboard");
      toast({
        title: "Copied URL.",
        description: "Profile link copied to clipboard.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    });
  };

  return (
    <>
      <VStack gap={4} alignItems={"start"}>
        <Flex justifyContent={"space-between"} w={"full"}>
          <Box>
            <Text fontSize={"2xl"} fontWeight={"bold"}>
              {user.name}
            </Text>
            <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"sm"}>{user.username} </Text>
              <Text
                fontSize={"sm"}
                bg={"gray.light"}
                color={"gray.dark"}
                p={1}
                borderRadius={"full"}
              >
                gamify.net
              </Text>
            </Flex>
          </Box>
          {user.profilePic && (
            <Avatar name={user.name} src={user.profilePic} size={"xl"} />
          )}
          {!user.profilePic && (
            <Avatar
              name={user.name}
              src="https://bit.ly/broken-link"
              size={"xl"}
              // { base: "md", md: "xl" }
            />
          )}
        </Flex>

        <Text>{user.bio}</Text>

        {currentUser?._id === user._id && (
          <>
            <Flex flexDir={"row"} gap={2}>
              <Link as={RouterLink} to="/update">
                <Button size={"sm"}>Update Profile</Button>
              </Link>

              <Link as={RouterLink} to={`updategame`}>
                <Button size={"sm"} color={"teal"}>
                  Update Games
                </Button>
              </Link>
              {/* Admin role */}
              {currentUser?.username === "ompatil" && (
                <Link as={RouterLink} to="/gaming">
                  <Button size={"sm"} color={"#E08D79"}>
                    Admin
                  </Button>
                </Link>
              )}
            </Flex>
          </>
        )}
        {currentUser?._id !== user._id && (
          <Button
            size={"sm"}
            onClick={handleFollowUnfollow}
            isLoading={updating}
          >
            {following ? "Unfollow" : "Follow"}
          </Button>
        )}
        <Flex w={"full"} justifyContent={"space-between"}>
          <Flex gap={2} alignItems={"center"}>
            <Text color={"gray.light"}>
              {user.followers.length} followers |{" "}
            </Text>
            <Text color={"gray.light"}>{user.following.length} following</Text>
            <Box w="1" height="1" bg={"gray.light"} borderRadius={"full"} />
            <Link color={"gray.light"}>gamify.com</Link>
          </Flex>
          <Flex>
            {/* <Box className="icon-container">
              <BsInstagram size={24} cursor={"pointer"} />
            </Box> */}
            <Box className="icon-container">
              <Menu>
                <MenuButton>
                  <CgMoreO size={24} cursor={"pointer"} />
                </MenuButton>
                <Portal>
                  <MenuList bg={"gray.dark"}>
                    <MenuItem bg={"gray.dark"} onClick={copyURL}>
                      Copy Link
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            </Box>
          </Flex>
        </Flex>

        <Flex w={"full"}>
          <Flex
            flex={1}
            borderBottom={"1.5px solid white"}
            justifyContent={"center"}
            pb="3"
            cursor={"pointer"}
          >
            <Text fontWeight={"bold"}>Posts</Text>
          </Flex>
          {/* <Flex
            flex={1}
            borderBottom={"1px solid gray"}
            justifyContent={"center"}
            pb="3"
            color={"gray.light"}
            cursor={"pointer"}
          >
            <Text fontWeight={"bold"}>Replies</Text>
          </Flex> */}
        </Flex>
      </VStack>
    </>
  );
}

export default UserHeader;
