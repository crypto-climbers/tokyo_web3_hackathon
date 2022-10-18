import React from "react";
import {
  Box,
  Flex,
  AspectRatio,
  Img,
  Text,
  Link,
  Button,
  Stack,
} from "@chakra-ui/react";

interface Props {
  date: string;
  summary: string;
  longLine: string;
  picture?: string;
  color: string;
}

function Card({ date, summary, longLine, picture, color }: Props) {
  return (
    <Box p={4} display={{ md: "flex" }} borderWidth={1} margin={2} mb={10}>
      <Img
        w='100px'
        h='100px'
        src={picture || "/placeholder_profile.png"}
        alt='User profile'
        rounded='full'
        onError={(e) => (e.target.src = "/placeholder_profile.png")}
      />
      <Stack
        align={{ base: "center", md: "stretch" }}
        textAlign={{ base: "center", md: "left" }}
        mt={{ base: 4, md: 0 }}
        ml={{ md: 6 }}
      >
        <Text
          fontWeight='bold'
          textTransform='uppercase'
          fontSize='lg'
          letterSpacing='wide'
          color='teal.300'
        >
          {date}
        </Text>
        <Link
          mx={1}
          display='block'
          fontSize='md'
          lineHeight='normal'
          fontWeight='semibold'
          href='#'
          color='gray.500'
        >
          {summary}
        </Link>
        <Text mx={2} color='gray.500'>
          {longLine}
        </Text>
        <Button maxWidth='100px' my={1} bg={color}>
          View Post
        </Button>
      </Stack>
    </Box>
  );
}

export default Card;
