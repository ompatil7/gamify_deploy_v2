import { Box, Container, CloseButton, Flex, Text } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
// import LogoutButton from "./components/LogoutButton";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";
import ForgotPasswordCard from "./pages/ForgotPasswordCard";
import ResetPassword from "./pages/ResetPassword";
import AllGamesPage from "./pages/AllGamesPage";
import GamePage from "./pages/GamePage";
import UpdateGamePage from "./pages/UpdateGamePage";
import GameOperationsPage from "./pages/GameOperationsPage";
import { NotFound } from "./pages/NotFound";
import ErrorBoundary from "./utils/ErrorBoundary";
import SearchPage from "./components/SearchPage";
import { useState } from "react";

function App() {
  const user = useRecoilValue(userAtom);
  //const [isNoticeVisible, setIsNoticeVisible] = useState(true);

  // const { pathname } = useLocation();
  return (
    <ErrorBoundary>
      {/*<Box position={"relative"} w="full">
        {isNoticeVisible && (
          <Box
            bg="yellow.300"
            p={4}
            color="black"
            textAlign="center"
            position="relative"
          >
            <Flex alignItems="center" justifyContent="center">
              <Text>
                If the page is not loading, please wait 50 seconds. The first
                request is delayed by 50 seconds. If anything is not updating,
                please refresh the page.
              </Text>
              <CloseButton
                position="absolute"
                right="8px"
                top="8px"
                onClick={() => setIsNoticeVisible(false)}
              />
            </Flex>
          </Box>
        )}
      </Box>*/}
      <Box position={"relative"} w="full">
        <Container maxW={{ base: "620px", md: "1200px" }}>
          <Header />
          <Routes>
            <Route
              path="/"
              element={user ? <HomePage /> : <Navigate to="/auth" />}
            />
            <Route
              path="/auth"
              element={!user ? <AuthPage /> : <Navigate to="/" />}
            />

            <Route
              path="/update"
              element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
            />
            <Route
              path="/gaming"
              element={
                user?.username === "ompatil" ? (
                  <GameOperationsPage />
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />

            <Route
              path="/:username/updategame"
              element={user ? <UpdateGamePage /> : <Navigate to="/auth" />}
            />
            <Route path="/forgot-password" element={<ForgotPasswordCard />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route
              path="/:username"
              element={
                user ? (
                  <>
                    <UserPage />
                    <CreatePost />
                  </>
                ) : (
                  <UserPage />
                )
              }
            />
            <Route path="/search" Component={SearchPage} />
            <Route path="/:username/post/:pid" element={<PostPage />} />
            <Route
              path="/chat"
              element={user ? <ChatPage /> : <Navigate to={"/auth"} />}
            />

            <Route
              path="/games"
              element={user ? <AllGamesPage /> : <Navigate to={"/auth"} />}
            />
            <Route
              path="/games/:game"
              element={user ? <GamePage /> : <Navigate to={"/auth"} />}
            />
            <Route path="*" element={user ? <NotFound /> : <AuthPage />} />
          </Routes>
          {/* {user && <LogoutButton />} */}
          {/* {user && <CreatePost />} */}
        </Container>
      </Box>
    </ErrorBoundary>
  );
}

export default App;
