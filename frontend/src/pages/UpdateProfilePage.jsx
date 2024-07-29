import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import userAtom from "../atoms/userAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";

export default function UpdateProfilePage() {
  const [user, setUser] = useRecoilState(userAtom);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  const showToast = useShowToast();
  const [inputs, setInputs] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
  });

  const fileRef = useRef(null);
  const { imgUrl, handleImageChange, setImgUrl } = usePreviewImg();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updating) return;
    setUpdating(true);

    const formData = new FormData();
    formData.append("name", inputs.name);
    formData.append("username", inputs.username);
    formData.append("email", inputs.email);
    formData.append("bio", inputs.bio);

    if (fileRef.current.files[0]) {
      formData.append("profilePic", fileRef.current.files[0]);
    }

    try {
      const res = await fetch(`/api/users/update/${user._id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      showToast("Success", data.message, "success");
      setUser(data.user);
      localStorage.setItem("user-threads", JSON.stringify(data.user));
      setImgUrl(null); // Reset the image URL after successful update
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    navigate(`/${user.username}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex align={"center"} justify={"center"} my={6}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile Edit
          </Heading>
          <FormControl>
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar
                  size="xl"
                  boxShadow={"md"}
                  src={imgUrl || user.profilePic}
                />
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileRef.current.click()}>
                  Change Avatar
                </Button>
                <Input
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleImageChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>Full name</FormLabel>
            <Input
              placeholder="John Doe"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={inputs.name}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>User name</FormLabel>
            <Input
              placeholder="UserName"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={inputs.username}
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="youremail@example.com"
              _placeholder={{ color: "gray.500" }}
              type="email"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="your bio"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={inputs.bio}
              onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
            />
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              bg={"green.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "green.500",
              }}
              type="submit"
              isLoading={updating}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}

// import {
//   Button,
//   Flex,
//   FormControl,
//   FormLabel,
//   Heading,
//   Input,
//   Stack,
//   useColorModeValue,
//   Avatar,
//   Center,
//   useToast,
// } from "@chakra-ui/react";
// import { useRef, useState } from "react";
// import { useRecoilState } from "recoil";
// import userAtom from "../atoms/userAtom";
// import usePreviewImg from "../hooks/usePreviewImg";

// // import usePreviewImg from "../hooks/usePreviewImg";
// import useShowToast from "../hooks/useShowToast";
// export default function UpdateProfilePage() {
//   const [user, setUser] = useRecoilState(userAtom);
//   const [updating, setUpdating] = useState(false);
//   const showToast = useShowToast();
//   const [inputs, setInputs] = useState({
//     name: user.name,
//     username: user.username,
//     email: user.email,
//     bio: user.bio,
//     // profilePic: user.profilePic,
//     // password: "",
//   });

//   const fileRef = useRef(null);
//   const { imgUrl, handleImageChange, setImgUrl } = usePreviewImg();

//   // const { handleImageChange, imgUrl } = usePreviewImg();
//   // console.log("user is here", user);
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (updating) return;
//     setUpdating(true);
//     const formData = new FormData();
//     formData.append("name", inputs.name);
//     formData.append("username", inputs.username);
//     formData.append("email", inputs.email);
//     formData.append("bio", inputs.bio);
//     // formData.append("password", inputs.password);
//     formData.append("profilePic", fileRef.current.files[0]);
//     console.log("profile pic ", fileRef.current.files[0]);
//     try {
//       const res = await fetch(`/api/users/update/${user._id}`, {
//         method: "PUT",
//         body: formData,
//         // headers: {
//         //   "Content-Type": "application/json",
//         // },
//         // body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
//       });
//       const data = await res.json(); // updated user object
//       if (data.error) {
//         showToast("Error", data.error, "error");
//         // alert(data.error);
//         return;
//       }

//       // alert(data.message);

//       showToast("Success", data.message, "success");
//       setUser(data.user); //need to check
//       localStorage.setItem("user-threads", JSON.stringify(data.user)); //check again
//       console.log(data);
//     } catch (error) {
//       showToast("Error", error, "error");
//       alert(error);
//     } finally {
//       setUpdating(false);
//     }
//   };
//   return (
//     <form onSubmit={handleSubmit}>
//       <Flex align={"center"} justify={"center"} my={6}>
//         <Stack
//           spacing={4}
//           w={"full"}
//           maxW={"md"}
//           bg={useColorModeValue("white", "gray.dark")}
//           rounded={"xl"}
//           boxShadow={"lg"}
//           p={6}
//         >
//           <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
//             User Profile Edit
//           </Heading>
//           <FormControl>
//             <Stack direction={["column", "row"]} spacing={6}>
//               <Center>
//                 <Avatar size="xl" boxShadow={"md"} src={user.profilePic} />
//               </Center>
//               <Center w="full">
//                 <Button w="full" onClick={() => fileRef.current.click()}>
//                   Change Avatar
//                 </Button>
//                 <Input
//                   type="file"
//                   hidden
//                   ref={fileRef}
//                   onChange={handleImageChange}
//                 />
//               </Center>
//             </Stack>
//           </FormControl>
//           <FormControl>
//             <FormLabel>Full name</FormLabel>
//             <Input
//               placeholder="John Doe"
//               _placeholder={{ color: "gray.500" }}
//               type="text"
//               value={inputs.name}
//               onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
//             />
//           </FormControl>
//           <FormControl>
//             <FormLabel>User name</FormLabel>
//             <Input
//               placeholder="UserName"
//               _placeholder={{ color: "gray.500" }}
//               type="text"
//               value={inputs.username}
//               onChange={(e) =>
//                 setInputs({ ...inputs, username: e.target.value })
//               }
//             />
//           </FormControl>
//           <FormControl>
//             <FormLabel>Email address</FormLabel>
//             <Input
//               placeholder="youremail@example.com"
//               _placeholder={{ color: "gray.500" }}
//               type="email"
//               value={inputs.email}
//               onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
//             />
//           </FormControl>
//           <FormControl>
//             <FormLabel>Bio</FormLabel>
//             <Input
//               placeholder="your bio"
//               _placeholder={{ color: "gray.500" }}
//               type="text"
//               value={inputs.bio}
//               onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
//             />
//           </FormControl>
//           {/* <FormControl>
//             <FormLabel>Password</FormLabel>
//             <Input
//               placeholder="password"
//               _placeholder={{ color: "gray.500" }}
//               type="password"
//             />
//           </FormControl> */}
//           <Stack spacing={6} direction={["column", "row"]}>
//             <Button
//               bg={"red.400"}
//               color={"white"}
//               w="full"
//               _hover={{
//                 bg: "red.500",
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               bg={"green.400"}
//               color={"white"}
//               w="full"
//               _hover={{
//                 bg: "green.500",
//               }}
//               type="submit"
//               isLoading={updating}
//             >
//               Submit
//             </Button>
//           </Stack>
//         </Stack>
//       </Flex>
//     </form>
//   );
// }
