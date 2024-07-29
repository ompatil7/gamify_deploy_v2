import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";

function ForgotPasswordCard() {
  const [email, setEmail] = useState("");
  const [sendMailLoading, setSendMailLoading] = useState(false);
  const toast = useToast();

  const handleResetPassword = async () => {
    if (!email) return;
    setSendMailLoading(true);
    try {
      // Send a request to your backend to initiate the password reset process
      // You may need to add a new API route for this purpose
      const res = await fetch("/api/users/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Email sent",
          description: data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      // Display a success message to the user
    } catch (error) {
      // Display an error message if something goes wrong
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSendMailLoading(false);
      setEmail("");
    }
  };

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Forgot Password
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={8}
          w={{
            sm: "400px",
            base: "full",
          }}
        >
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                size="lg"
                bg={useColorModeValue("gray.600", "gray.700")}
                color={"white"}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.800"),
                }}
                onClick={handleResetPassword}
                isLoading={sendMailLoading}
              >
                Reset Password
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Remember your password? {/* <Link > */}
                <RouterLink to={"/auth"} style={{ color: "#4299e1" }}>
                  Login
                </RouterLink>
                {/* </Link> */}
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

export default ForgotPasswordCard;
