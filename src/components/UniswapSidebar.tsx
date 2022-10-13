import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  Box,
  Text,
  Textarea,
  Button,
  AspectRatio,
} from "@chakra-ui/react";
import { SwapWidget } from "@uniswap/widgets";

import { NodeType } from "@/types";
import { useState } from "react";
import { swapTokensV2 } from "@/components/Swaptoken";
import { quickSwapABI, uniSwapABI } from "@/data/ABI";
import { quickSwapRouter, uniSwapRouter } from "@/data/router";
import { polygonUsdcAddress, polygonUsdtAddress } from "@/data/token";
import tokenlist from "@/data/tokenlist";

//gets token address from the tokenlist.json file
const getTokenAddress = (chainId: number, symbol: string) => {
  const res = tokenlist.tokens.find(
    (v) => v.symbol == symbol && v.chainId == chainId
  );
  return res ? res.address : "";
};
const chainId = 137; //Setting as static number as for now...

interface Props {
  isOpen: boolean;
  onClose: () => void;
  node: NodeType;
  inputToken: string;
  outputToken: string;
}

type SlideDirection = "top" | "left" | "bottom" | "right";

const UniswapSidebar = ({ isOpen, onClose, node, inputToken, outputToken }: Props) => {
  const [placement, setPlacement] = useState<SlideDirection>("right");
  return (
    <Drawer placement={placement} onClose={onClose} isOpen={isOpen} size='lg'>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth='1px' bg='#ff007b' color='white'>
          Uniswap
        </DrawerHeader>
        <DrawerBody color='black'>
          <SwapWidget defaultInputTokenAddress={inputToken} defaultOutputTokenAddress={outputToken} />

          <AspectRatio maxH='660px' maxW='100%' marginTop={10} ratio={4 / 3}>
          <iframe
            src={`https://app.uniswap.org/#/add/${inputToken == 'NATIVE' ? "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" : inputToken}/${outputToken == 'NATIVE' ? "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" : outputToken}/100?maxPrice=2&minPrice=0.9&lng=en-US`}
            height="660px"
            width="100%"
            style={{border: 0, margin: '0 auto', marginBottom: '.5rem', display: 'block', borderRadius: '10px', maxWidth: '960px', minWidth: '300px'}}
          />
          </AspectRatio>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default UniswapSidebar;