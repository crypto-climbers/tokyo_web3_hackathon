import { Text, Box } from "@chakra-ui/react";
import Draggable from "react-draggable";
import { Tvl } from "./tvl";

interface Prop {
  children: JSX.Element;
  size: number;
  name: string;
  bubbleColor: string;
  imagePath: string;
  textColor: string;
}

const BigBubble = ({
  children,
  size,
  name,
  bubbleColor,
  imagePath,
  textColor,
}: Prop) => {
  return (
    <Draggable defaultPosition={{ x: 10, y: 20 }}>
      <Box
        w={`${size}px`}
        h={`${size + 100}px`}
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
      >
        <Box
          bg={bubbleColor}
          bgImage={imagePath}
          bgSize='20%'
          bgRepeat='no-repeat'
          bgPosition='center'
          w={`${size}px`}
          h={`${size}px`}
          borderRadius='50%'
          overflow='hidden'
          display='flex'
          justifyContent='center'
          alignItems='center'
        >
          {children}
        </Box>
        <Text as='b' color={textColor}>
          {name}
        </Text>
      </Box>
    </Draggable>
  );
};

export default BigBubble;
