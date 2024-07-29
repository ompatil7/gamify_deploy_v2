import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
  IconButton,
  Divider,
  Avatar,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { GiConversation } from "react-icons/gi";
import { FaArrowLeft } from "react-icons/fa";
import Conversation from "../components/Conversation";
import MessageContainer from "../components/MessageContainer";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";

const ChatPage = () => {
  // states
  const [loadingConversation, setLoadingConversations] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchingUser, setSearchingUser] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // New state to track if a chat is open

  // hooks
  const showToast = useShowToast();

  // context hook
  const { socket, onlineUsers } = useSocket();

  // recoils
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const currentUser = useRecoilValue(userAtom);
  const [conversations, setConversations] = useRecoilState(conversationsAtom);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch("/api/messages/conversations");

        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setConversations(data);
        console.log(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoadingConversations(false);
      }
    };
    getConversations();
  }, [showToast, setConversations]);

  // Listen for new messages and update conversations
  // useEffect(() => {
  //   socket?.on("newMessage", (newMessage) => {
  //     setConversations((prevConversations) => {
  //       const updatedConversations = prevConversations.map((conversation) =>
  //         conversation._id === newMessage.conversationId
  //           ? {
  //               ...conversation,
  //               lastMessage: newMessage,
  //               hasNewMessage: true, // New property to indicate new message
  //             }
  //           : conversation
  //       );

  //       // Move the conversation with the new message to the top
  //       const conversationWithNewMessage = updatedConversations.find(
  //         (conversation) => conversation._id === newMessage.conversationId
  //       );
  //       const otherConversations = updatedConversations.filter(
  //         (conversation) => conversation._id !== newMessage.conversationId
  //       );

  //       return [conversationWithNewMessage, ...otherConversations];
  //     });
  //   });
  // }, [socket, setConversations]);

  //gpt 1 working badge
  // useEffect(() => {
  //   socket?.on("newMessage", (newMessage) => {
  //     setConversations((prevConversations) => {
  //       // Check if the conversation already exists
  //       const existingConversationIndex = prevConversations.findIndex(
  //         (conversation) => conversation._id === newMessage.conversationId
  //       );

  //       let updatedConversations = [...prevConversations];

  //       if (existingConversationIndex > -1) {
  //         // Update the existing conversation with the new message
  //         updatedConversations[existingConversationIndex] = {
  //           ...updatedConversations[existingConversationIndex],
  //           lastMessage: newMessage,
  //           hasNewMessage: true,
  //         };
  //       } else {
  //         // Add new conversation if it doesn't exist
  //         updatedConversations = [
  //           ...prevConversations,
  //           {
  //             _id: newMessage.conversationId,
  //             lastMessage: newMessage,
  //             hasNewMessage: false,
  //             participants: [
  //               {
  //                 _id: newMessage.sender._id,
  //                 username: newMessage.sender.username,
  //                 profilePic: newMessage.sender.profilePic,
  //               },
  //             ],
  //           },
  //         ];
  //       }

  //       // Sort conversations with new messages at the top
  //       return updatedConversations.sort(
  //         (a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt
  //       );
  //     });
  //   });
  // }, [socket, setConversations]);

  //gpt 2
  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setConversations((prevConversations) => {
        // Update existing conversation or add new conversation
        let updatedConversations = prevConversations.map((conversation) => {
          if (conversation._id === newMessage.conversationId) {
            return {
              ...conversation,
              lastMessage: newMessage,
              hasNewMessage: true, // Mark as having a new message
            };
          }
          return conversation;
        });

        // Add a new conversation if it doesn't exist
        if (
          !updatedConversations.some(
            (convo) => convo._id === newMessage.conversationId
          )
        ) {
          updatedConversations = [
            ...updatedConversations,
            {
              _id: newMessage.conversationId,
              lastMessage: newMessage,
              hasNewMessage: true,
              participants: [
                {
                  _id: newMessage.sender._id,
                  username: newMessage.sender.username,
                  profilePic: newMessage.sender.profilePic,
                },
              ],
            },
          ];
        }

        // Sort conversations: New messages should be on top
        return updatedConversations.sort((a, b) => {
          if (a.hasNewMessage && !b.hasNewMessage) return -1;
          if (!a.hasNewMessage && b.hasNewMessage) return 1;
          return b.lastMessage.createdAt - a.lastMessage.createdAt;
        });
      });
    });
  }, [socket, setConversations]);

  useEffect(() => {
    socket?.on("messagesSeen", ({ conversationId }) => {
      setConversations((prev) =>
        prev.map((conversation) =>
          conversation._id === conversationId
            ? {
                ...conversation,
                lastMessage: {
                  ...conversation.lastMessage,
                  seen: true,
                },
                hasNewMessage: false, // Reset new message indicator
              }
            : conversation
        )
      );
    });
  }, [socket, setConversations]);

  // useEffect(() => {
  //   socket?.on("messagesSeen", ({ conversationId }) => {
  //     setConversations((prev) => {
  //       const updatedConversations = prev.map((conversation) => {
  //         if (conversation._id === conversationId) {
  //           return {
  //             ...conversation,
  //             lastMessage: {
  //               ...conversation.lastMessage,
  //               seen: true,
  //             },
  //             hasNewMessage: false,
  //           };
  //         }
  //         return conversation;
  //       });
  //       return updatedConversations;
  //     });
  //   });
  // }, [socket, setConversations]);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);
    if (!searchText) {
      setSearchingUser(false);
      return;
    }
    try {
      const res = await fetch(`/api/users/profile/${searchText}`);
      const searchedUser = await res.json();

      if (searchedUser.error) {
        showToast("Error", searchedUser.error, "error");
        return;
      }

      // if user is trying to msg themselves
      const messagingYourself = searchedUser._id === currentUser._id;
      if (messagingYourself) {
        showToast("Error", "You cannot message yourself", "error");
        return;
      }

      // already have a conversation with the user so directly open the chat
      const conversationAlreadyExists = conversations.find(
        (conversation) => conversation.participants[0]._id === searchedUser._id
      );
      if (conversationAlreadyExists) {
        setSelectedConversation({
          _id: conversationAlreadyExists._id,
          userId: searchedUser._id,
          userProfilePic: searchedUser.profilePic,
          username: searchedUser.username,
        });
        setIsChatOpen(true); // Open chat in mobile view
        return;
      }

      // searching for a user we don't have a chat with
      // creating a new chat
      // we will create a mock(fake) conversation first because if the user just sees
      // and doesn't send a message, the conversation should not be created
      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
          },
        ],
      };

      setConversations((prevConversation) => [
        ...prevConversation,
        mockConversation,
      ]);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setSearchingUser(false);
    }
  };

  return (
    <Box
      position={"absolute"}
      left={"50%"}
      w={{
        sm: "100%",
        md: "80%",
        lg: "1000px",
      }}
      p={4}
      transform={"translateX(-50%)"}
    >
      {isChatOpen ? (
        <Box>
          <Flex w="full" h={12} alignItems={"center"} gap={2}>
            <IconButton
              icon={<FaArrowLeft />}
              onClick={() => setIsChatOpen(false)}
              variant="ghost"
              aria-label="Go back"
            />
            <Avatar src={selectedConversation.userProfilePic} size="sm" />
            <Text>{selectedConversation.username}</Text>
          </Flex>
          <Divider />
          <MessageContainer />
        </Box>
      ) : (
        <Flex
          gap={4}
          flexDirection={{
            base: "column",
            md: "row",
          }}
          maxW={{
            sm: "400px",
            md: "full",
          }}
          mx={"auto"}
        >
          <Flex
            flex={30}
            gap={2}
            flexDirection={"column"}
            maxW={{
              sm: "250px",
              md: "full",
            }}
            mx={"auto"}
          >
            <Text
              fontWeight={700}
              color={useColorModeValue("gray.600", "gray.400")}
            >
              Your Conversations
            </Text>
            <form onSubmit={handleConversationSearch}>
              <Flex alignItems={"center"} gap={2}>
                <Input
                  placeholder="Search for a user"
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <Button
                  size={"sm"}
                  onClick={handleConversationSearch}
                  isLoading={searchingUser}
                >
                  <SearchIcon />
                </Button>
              </Flex>
            </form>

            {loadingConversation &&
              [0, 1, 2, 3, 4].map((_, i) => (
                <Flex
                  gap={4}
                  key={i}
                  alignItems={"center"}
                  p={"1"}
                  borderRadius={"md"}
                >
                  <Box>
                    <SkeletonCircle size={"10"} />
                  </Box>

                  <Flex w={"full"} flexDirection={"column"} gap={3}>
                    <Skeleton h={"10px"} w={"80px"} />
                    <Skeleton h={"8px"} w={"90%"} />
                  </Flex>
                </Flex>
              ))}

            {!loadingConversation &&
              conversations.map((conversation) => (
                <Conversation
                  key={conversation._id}
                  isOnline={onlineUsers.includes(
                    conversation.participants[0]._id
                  )}
                  conversation={conversation}
                  onClick={() => setIsChatOpen(true)} // Open chat in mobile view
                />
              ))}
          </Flex>
          {!selectedConversation._id && (
            <Flex
              flex={70}
              borderRadius={"md"}
              p={2}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              height={"400px"}
            >
              <GiConversation size={100} />
              <Text fontSize={20}>
                Select a conversation to start messaging
              </Text>
            </Flex>
          )}

          {selectedConversation._id && <MessageContainer />}
        </Flex>
      )}
    </Box>
  );
};

export default ChatPage;

// import { SearchIcon } from "@chakra-ui/icons";
// import {
//   Box,
//   Button,
//   Flex,
//   Input,
//   Skeleton,
//   SkeletonCircle,
//   Text,
//   useColorModeValue,
// } from "@chakra-ui/react";
// import React, { useEffect, useState } from "react";
// import { GiConversation } from "react-icons/gi";
// import Conversation from "../components/Conversation";
// import MessageContainer from "../components/MessageContainer";
// import useShowToast from "../hooks/useShowToast";
// import { useRecoilState, useRecoilValue } from "recoil";
// import {
//   conversationsAtom,
//   selectedConversationAtom,
// } from "../atoms/messagesAtom";
// import userAtom from "../atoms/userAtom";
// import { useSocket } from "../context/SocketContext";
// const ChatPage = () => {
//   //states
//   const [loadingConversation, setLoadingConversations] = useState(true);
//   const [searchText, setSearchText] = useState("");
//   const [searchingUser, setSearchingUser] = useState(false);

//   //hooks
//   const showToast = useShowToast();

//   //context hook
//   const { socket, onlineUsers } = useSocket();

//   //recoils
//   const [selectedConversation, setSelectedConversation] = useRecoilState(
//     selectedConversationAtom
//   );
//   const currentUser = useRecoilValue(userAtom);
//   const [conversations, setConversations] = useRecoilState(conversationsAtom);

//   useEffect(() => {
//     const getConversations = async () => {
//       try {
//         const res = await fetch("/api/messages/conversations");

//         const data = await res.json();
//         if (data.error) {
//           showToast("Error", data.error, "error");
//           return;
//         }
//         setConversations(data);
//         console.log(data);
//       } catch (error) {
//         showToast("Error", error.message, "error");
//       } finally {
//         setLoadingConversations(false);
//       }
//     };
//     getConversations();
//   }, [showToast, setConversations]);

//   useEffect(() => {
//     socket?.on("messagesSeen", ({ conversationId }) => {
//       setConversations((prev) => {
//         const updatedConversations = prev.map((conversation) => {
//           if (conversation._id === conversationId) {
//             return {
//               ...conversation,
//               lastMessage: {
//                 ...conversation.lastMessage,
//                 seen: true,
//               },
//             };
//           }
//           return conversation;
//         });
//         return updatedConversations;
//       });
//     });
//   }, [socket, setConversations]);

//   const handleConversationSearch = async (e) => {
//     e.preventDefault();
//     setSearchingUser(true);
//     if (!searchText) {
//       setSearchingUser(false);
//       return;
//     }
//     try {
//       const res = await fetch(`/api/users/profile/${searchText}`);
//       const searchedUser = await res.json();

//       if (searchedUser.error) {
//         showToast("Error", searchedUser.error, "error");
//         return;
//       }

//       //if user is trying to msg themselves
//       const messagingYourSelf = searchedUser._id === currentUser._id;
//       if (messagingYourSelf) {
//         showToast("Error", "You cannot message yourself", "error");
//         return;
//       }

//       //already have a conversation with the user so directly open the chat
//       const conversationAlreadyExists = conversations.find(
//         (conversation) => conversation.participants[0]._id === searchedUser._id
//       );
//       if (conversationAlreadyExists) {
//         setSelectedConversation({
//           _id: conversationAlreadyExists._id,
//           userId: searchedUser._id,
//           userProfilePic: searchedUser.profilePic,
//           username: searchedUser.username,
//         });
//         return;
//       }

//       //searching for a user we dont have a chat with
//       //creating a new chat
//       //we will create a mock(fake) conversation first bcoz if the user just sees
//       //and doesnt send a messasge so the conversation should not be created
//       const mockConversation = {
//         mock: true,
//         lastMessage: {
//           text: "",
//           sender: "",
//         },
//         _id: Date.now(),
//         participants: [
//           {
//             _id: searchedUser._id,
//             username: searchedUser.username,
//             profilePic: searchedUser.profilePic,
//           },
//         ],
//       };

//       setConversations((prevConversation) => [
//         ...prevConversation,
//         mockConversation,
//       ]);
//     } catch (error) {
//       showToast("Error", error.message, "error");
//     } finally {
//       setSearchingUser(false);
//     }
//   };
//   return (
//     <Box
//       position={"absolute"}
//       left={"50%"}
//       w={{
//         sm: "100%",
//         md: "80%",
//         lg: "1000px",
//       }}
//       p={4}
//       transform={"translateX(-50%)"}
//     >
//       <Flex
//         gap={4}
//         flexDirection={{
//           base: "column",
//           md: "row",
//         }}
//         maxW={{
//           sm: "400px",
//           md: "full",
//         }}
//         mx={"auto"}
//       >
//         <Flex
//           flex={30}
//           gap={2}
//           flexDirection={"column"}
//           maxW={{
//             sm: "250px",
//             md: "full",
//           }}
//           mx={"auto"}
//         >
//           <Text
//             fontWeight={700}
//             color={useColorModeValue("gray.600", "gray.400")}
//           >
//             Your Conversations
//           </Text>
//           <form onSubmit={handleConversationSearch}>
//             <Flex alignItems={"center"} gap={2}>
//               <Input
//                 placeholder="Search for a user"
//                 onChange={(e) => setSearchText(e.target.value)}
//               />
//               <Button
//                 size={"sm"}
//                 onClick={handleConversationSearch}
//                 isLoading={searchingUser}
//               >
//                 <SearchIcon />
//               </Button>
//             </Flex>
//           </form>

//           {loadingConversation &&
//             [0, 1, 2, 3, 4].map((_, i) => (
//               <Flex
//                 gap={4}
//                 key={i}
//                 alignItems={"center"}
//                 p={"1"}
//                 borderRadius={"md"}
//               >
//                 <Box>
//                   <SkeletonCircle size={"10"} />
//                 </Box>

//                 <Flex w={"full"} flexDirection={"column"} gap={3}>
//                   <Skeleton h={"10px"} w={"80px"} />
//                   <Skeleton h={"8px"} w={"90%"} />
//                 </Flex>
//               </Flex>
//             ))}

//           {!loadingConversation &&
//             conversations.map((conversation) => (
//               <Conversation
//                 key={conversation._id}
//                 //checking if user we cahtting with is in onlinusers array
//                 isOnline={onlineUsers.includes(
//                   conversation.participants[0]._id
//                 )}
//                 conversation={conversation}
//               />
//             ))}
//         </Flex>
//         {!selectedConversation._id && (
//           <Flex
//             flex={70}
//             borderRadius={"md"}
//             p={2}
//             flexDirection={"column"}
//             alignItems={"center"}
//             justifyContent={"center"}
//             height={"400px"}
//           >
//             <GiConversation size={100} />
//             <Text fontSize={20}>Select a conversation to start messaging</Text>
//           </Flex>
//         )}

//         {selectedConversation._id && <MessageContainer />}
//       </Flex>
//     </Box>
//   );
// };

// export default ChatPage;
