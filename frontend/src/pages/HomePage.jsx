import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import Post from "../components/Post";
import SuggestedUsers from "../components/SuggestedUsers";
import useShowToast from "../hooks/useShowToast";
import { clearAuthData } from "../utils/clearAuthData";
function HomePage() {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // setPosts([]);

  const showToast = useShowToast();

  const getFeedPosts = useCallback(
    async (page) => {
      setLoading(true);
      try {
        const res = await fetch(`/api/posts/feed?page=${page}`);
        if (res.status === 401) {
          clearAuthData();
          // Redirect to login page
          window.location.href = "/auth";
          return;
        }
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        console.log("feed", data);
        // Ensure no duplicate posts
        const uniquePosts = data.posts.filter(
          (newPost) => !posts.some((post) => post._id === newPost._id)
        );
        setPosts((prevPosts) => [...prevPosts, ...uniquePosts]);

        setHasMore(data.hasMore);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setLoading(false);
      }
    },
    [showToast, setPosts]
  );

  useEffect(() => {
    getFeedPosts(page);
  }, [getFeedPosts, page]);

  // useEffect(() => {
  //   const getFeedPosts = async () => {
  //     setPosts([]);

  //     try {
  //       const res = await fetch("/api/posts/feed");
  //       const data = await res.json();

  //       if (data.error) {
  //         showToast("Error", data.error, "error");
  //         return;
  //       }

  //       console.log("feed", data);
  //       setPosts(data);
  //     } catch (error) {
  //       showToast("Error", error, "error");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   getFeedPosts();
  // }, [showToast, setPosts]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      loading ||
      !hasMore
    )
      return;
    setPage((prevPage) => prevPage + 1);
  }, [loading]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      <Flex gap={10} alignItems={"flex-start"}>
        <Box flex={70}>
          {!loading && posts.length === 0 && (
            <h1>Follow some users to see the feed</h1>
          )}
          {/* {loading && (
            <Flex justify="center">
              <Spinner size="xl" />
            </Flex>
          )} */}

          {Array.isArray(posts) &&
            posts.map((post) => (
              <Post key={post._id} post={post} postedBy={post.postedBy} />
            ))}
          {loading && (
            <Flex justify="center">
              <Spinner size="xl" />
            </Flex>
          )}
          {!hasMore && (
            <Flex justify="center" mt={5} mb={5}>
              <Text fontSize="xl">You have seen all posts</Text>
            </Flex>
          )}
        </Box>
        <Box
          flex={30}
          display={{
            base: "none",
            md: "block",
          }}
        >
          <SuggestedUsers />
        </Box>
      </Flex>
    </>
  );
}

export default HomePage;
