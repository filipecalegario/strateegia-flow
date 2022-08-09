import {
  Box,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  Icon,
  IconButton,
  Link,
  Text,
  useColorModeValue,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import React from "react";
import { FiMenu } from "react-icons/fi";
import { IoMdArrowDropright } from "react-icons/io";
import strateegiaLogo from "../assets/strateegia_logo.png";
import { useNavigate } from "react-router-dom";

export default function SimpleSidebar({ sideBarItems, children, handleClick }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg="white">
      <SidebarContent
        onClose={() => onClose}
        sideBarItems={sideBarItems}
        handleClick={handleClick}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent
            onClose={onClose}
            sideBarItems={sideBarItems}
            handleClick={handleClick}
          />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 500 }}>{children}</Box>
    </Box>
  );
}

const SidebarContent = ({ onClose, sideBarItems, handleClick, ...rest }) => {
  const navigate = useNavigate();
  return (
    <Box
      bg="#25C6A8"
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 500 }}
      // w="25vw"
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex
        w="100%"
        h="20"
        alignItems="center"
        mx="0"
        onClick={() => navigate("/")}
        cursor="pointer"
      >
        <Image src={strateegiaLogo} h="60px" mx="10px" />
        <Text color="white" fontSize="2xl" as="span" fontWeight={"600"}>
          flow
        </Text>
        <Text color="white" fontSize="2xl">
          .strateegia
        </Text>
        <CloseButton
          color="white"
          display={{ base: "flex", md: "none" }}
          onClick={onClose}
        />
      </Flex>
      <Box padding="none" as="hr" borderBottom="sm" borderColor="white" />
      {sideBarItems?.map((link) => (
        <NavItem
          key={link.id}
          id={link.id}
          icon={link.icon}
          onClick={(e) => {
            handleClick(e);
            onClose(e);
          }}
        >
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }) => {
  return (
    <Link
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
      color="white"
      fontSize="lg"
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "#00B894",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="30"
            _groupHover={{
              color: "white",
            }}
            as={IoMdArrowDropright}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <Flex ml="20px">
        <Text color="black" fontSize="2xl" as="span" fontWeight={"600"}>
          flow
        </Text>
        <Text color="black" fontSize="2xl">
          .strateegia
        </Text>
      </Flex>
    </Flex>
  );
};
