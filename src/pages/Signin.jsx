import { LogoFlow } from "./../components/LogoFlow";
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
  Image,
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
      justify={"center"}
      background={DEFAULT_COLOR}
    >
      {/* <ColorModeSwitcher /> */}
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={"150px"} px={6}>
        <Flex
          flexDirection={"column"}
          rounded={"lg"}
          bg={DEFAULT_COLOR}
          p={8}
          align={"center"}
        >
          <LogoFlow />
          <form onSubmit={handleSubmit} id="login-form">
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel
                  m="0"
                  paddingBottom={"5px"}
                  textAlign={"center"}
                  color="white"
                >
                  seu login em strateegia
                </FormLabel>
                <Input
                  variant="outline"
                  type="email"
                  name="email"
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel
                  m="0"
                  paddingBottom={"5px"}
                  textAlign={"center"}
                  color="white"
                >
                  sua senha em strateegia
                </FormLabel>
                <Input
                  variant="outline"
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
                    bg: "#00B894",
                    color: "white",
                  }}
                  type="submit"
                >
                  entrar
                </Button>
              </Stack>
            </Stack>
          </form>
        </Flex>
      </Stack>
    </Flex>
  );
}
