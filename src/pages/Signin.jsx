import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { auth } from "strateegia-api";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DEFAULT_COLOR = "#25C6A8";

export default function Signin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const accessToken = await auth(email, password);
      if (accessToken) {
        console.log(accessToken);
        localStorage.setItem("accessToken", accessToken);
        navigate("/main");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error(error);
    }
  };

  function handleChange(event) {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      localStorage.removeItem("accessToken");
    }
  }, []);

  return (
    <Flex
      minH={"100vh"}
      align={"top"}
      justify={"start"}
      background={DEFAULT_COLOR}
    >
      {/* <ColorModeSwitcher /> */}
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        {/* <Stack align={'center'}>
          <Heading fontSize={'2xl'}>strateegia caixa morfológica</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            entre com seu login de strateegia
          </Text>
        </Stack> */}
        <Box
          rounded={"lg"}
          // bg={useColorModeValue("white", "gray.700")}
          bg={DEFAULT_COLOR}
          // boxShadow={'lg'}
          p={8}
        >
          <form onSubmit={handleSubmit} id="login-form">
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel color="white">seu login em strateegia</FormLabel>
                <Input type="email" name="email" onChange={handleChange} />
              </FormControl>
              <FormControl id="password">
                <FormLabel color="white">sua senha em strateegia</FormLabel>
                <Input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  
                />
              </FormControl>
              <Stack spacing={10}>
                <Button
                  bg={"white"}
                  color={"#25C6A8"}
                  _hover={{
                    bg: "blue.400",
                  }}
                  type="submit"
                >
                  entrar
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}
