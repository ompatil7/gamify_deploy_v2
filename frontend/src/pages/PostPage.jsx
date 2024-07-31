/* eslint-disable react/no-unescaped-entities */
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import { useEffect } from "react";
import Comments from "../components/Comments";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import { baseUrl } from "../url";

function PostPage() {
  const { user, loading } = useGetUserProfile();
  // const [post, setPost] = useState(null);
  const showToast = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const navigate = useNavigate();
  const currentPost = posts[0];

  const handleDeletePost = async () => {
    try {
      // e.preventDefault();
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`${baseUrl}/api/posts/${currentPost._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post Deleted", "success");
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", error, "error");
    }
  };

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/posts/${pid}`);
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log("getpost", data);
        setPosts([data]);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    getPost();
  }, [pid, showToast, setPosts]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!currentPost) return null;

  return (
    <Flex justifyContent="center" alignItems="center" minHeight="100vh" p={4}>
      <Box
        bg="white"
        w="full"
        maxW="600px"
        p={4}
        borderRadius="md"
        boxShadow="md"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center" gap={3}>
            <Avatar src={user.profilePic} size="md" name={user.username} />
            <Flex flexDirection="column">
              <Text fontSize="sm" fontWeight="bold">
                {user.username}
              </Text>
              <Image src="/verified.png" w={4} h={4} />
            </Flex>
          </Flex>
          <Flex gap={4} alignItems="center">
            <Text fontSize="xs" color="gray.500">
              {formatDistanceToNow(new Date(currentPost.createdAt))} ago
            </Text>
            {currentUser?._id === user._id && (
              <DeleteIcon
                size={20}
                onClick={handleDeletePost}
                cursor="pointer"
              />
            )}
          </Flex>
        </Flex>
        <Text my={3}>{currentPost.text}</Text>
        {currentPost.img && (
          <Box
            position="relative"
            w="full"
            h="0"
            pb="56.25%" // 16:9 aspect ratio
            bg="black"
          >
            <Image
              src={currentPost.img}
              position="absolute"
              top="0"
              left="0"
              w="100%"
              h="100%"
              objectFit="contain"
            />
          </Box>
        )}
        <Flex gap={3} my={3}>
          <Actions post={currentPost} />
        </Flex>
        <Divider my={4} />
        {currentPost.replies.map((reply) => (
          <Comments
            key={reply._id}
            reply={reply}
            lastReply={
              reply._id ===
              currentPost.replies[currentPost.replies.length - 1]._id
            }
          />
        ))}
      </Box>
    </Flex>
  );
}

export default PostPage;
