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
  x: number;
  y: number;
}

const BigBubble = ({
  children,
  size,
  name,
  bubbleColor,
  imagePath,
  textColor,
  x,
  y,
}: Prop) => {
  return (
    <Draggable defaultPosition={{ x: x, y: y }}>
      <Box
        w={`${size}px`}
        h={`${size + 100}px`}
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        transition='ease-in-out 1s'
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
          transition='ease-in-out 1s'
        >
          {children}
        </Box>

        {size > 0 &&    <Text as='b' color={textColor} fontFamily='title'>
          {name}
        </Text>}
     
      </Box>
    </Draggable>
  );
};

export default BigBubble;
