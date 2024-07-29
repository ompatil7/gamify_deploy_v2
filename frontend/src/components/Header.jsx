import {
  Flex,
  Image,
  useColorMode,
  Box,
  Link,
  Button,
  Text,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogOut from "../hooks/useLogOut";
import authScreenAtom from "../atoms/authAtom";
import {
  BsFillChatQuoteFill,
  BsFillMoonFill,
  BsFillSunFill,
  BsSearch,
} from "react-icons/bs";
import { IoGameController } from "react-icons/io5";
import { useState } from "react";

function Header() {
  const logout = useLogOut();
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (searchTerm) {
      history.push(`/search?query=${searchTerm}`);
    }
  };

  return (
    <Flex justifyContent={"space-between"} mt={6} mb="12" alignItems="center">
      {user && (
        <Tooltip label="Home" aria-label="Home tooltip">
          <Link as={RouterLink} to="/">
            <AiFillHome size={24} />
          </Link>
        </Tooltip>
      )}

      {!user && (
        <Link
          as={RouterLink}
          to={"/auth"}
          onClick={() => setAuthScreen("login")}
        >
          Login
        </Link>
      )}
      <Link as={RouterLink} to="/">
        <Text
          fontSize="2xl"
          fontStyle="italic"
          fontWeight="bold"
          textAlign="center"
          flex={1}
          ml={{ base: 0, md: 140 }} // Adjust ml value as needed
          display={{ base: "none", md: "flex" }} // Hide on mobile, show on md and above
          cursor={"pointer"}
        >
          gamify
        </Text>
      </Link>

      <Flex alignItems="center" gap={6}>
        <Tooltip label="Search" aria-label="Search tooltip">
          <Link as={RouterLink} to="/search">
            <BsSearch size={24} title="Search" />
          </Link>
        </Tooltip>
        <Tooltip label="Toggle theme" aria-label="Toggle theme tooltip">
          <IconButton
            aria-label="Toggle theme"
            icon={
              colorMode === "dark" ? (
                <BsFillSunFill size={24} />
              ) : (
                <BsFillMoonFill size={24} />
              )
            }
            onClick={toggleColorMode}
            size="md"
            variant="ghost"
          />
        </Tooltip>

        {user && (
          <>
            <Tooltip label="Games" aria-label="Games tooltip">
              <Link as={RouterLink} to="/games">
                <IoGameController size={24} />
              </Link>
            </Tooltip>
            <Tooltip label="Profile" aria-label="Profile tooltip">
              <Link as={RouterLink} to={`/${user.username}`}>
                <RxAvatar size={24} />
              </Link>
            </Tooltip>
            <Tooltip label="Chat" aria-label="Chat tooltip">
              <Link as={RouterLink} to={`/chat`}>
                <BsFillChatQuoteFill size={24} />
              </Link>
            </Tooltip>
            <Tooltip label="Logout" aria-label="Logout tooltip">
              <Button size={"sm"} onClick={logout}>
                <FiLogOut size={20} />
              </Button>
            </Tooltip>
          </>
        )}

        {!user && (
          <Link
            as={RouterLink}
            to={"/auth"}
            onClick={() => setAuthScreen("signup")}
          >
            Signup
          </Link>
        )}
      </Flex>
    </Flex>
  );
}

export default Header;
