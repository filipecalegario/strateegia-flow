import { Flex, Stack, Spinner } from "@chakra-ui/react";

export default function Loading({ active }) {
  return active ? (
    <Flex minH={"100vh"} align={"center"} justify={"center"} mt={6}>
      <Stack>
        <Spinner
          thickness="5px"
          speed="0.65s"
          emptyColor="gray.200"
          color="#25C6A8"
          size="xl"
        />
      </Stack>
    </Flex>
  ) : null;
}
