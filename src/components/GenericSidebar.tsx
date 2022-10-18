import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  Box,
  Text,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import LensPost from "./LensPost";

import { NodeType } from "@/types";
import { useState } from "react";
import { swapTokensV2 } from "@/components/Swaptoken";
import { quickSwapABI, uniSwapABI } from "@/data/ABI";
import { quickSwapRouter, uniSwapRouter } from "@/data/router";
import { TOKEN_LIST } from "@/data/tokenlist";
import { AAVE } from "@/components/aave";

//gets token address from the TOKEN_LIST.json file
const getTokenAddress = (chainId: number, symbol: string) => {
  const res = TOKEN_LIST.tokens.find(
    (v) => v.symbol == symbol && v.chainId == chainId
  );
  return res ? res.address : "";
};
const chainId = 137; //Setting as static number as for now...

interface Props {
  isOpen: boolean;
  onClose: () => void;
  node: NodeType;
  token?: string;
  title: string;
  color: string;
}

type SlideDirection = "top" | "left" | "bottom" | "right";

const Modal = ({ isOpen, onClose, node, token, title, color }: Props) => {
  const [placement, setPlacement] = useState<SlideDirection>("right");

  const [inputToken, setInputToken] = useState("");
  const [outputToken, setOutputToken] = useState("");
  const [amount, setAmount] = useState("");

  const onClickSwap = async () => {
    const response = await swapTokensV2(
      quickSwapRouter,
      quickSwapABI,
      inputToken,
      outputToken,
      amount
    );
  };

  const aave = new AAVE();

  return (
    <Drawer placement={placement} onClose={onClose} isOpen={isOpen} size='lg'>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth='1px' bg={color}>
          {title}
        </DrawerHeader>
        <Tabs isFitted variant='enclosed' mt='20px'>
          <TabList mb='1em'>
            <Tab color='black' _selected={{ color: "white", bg: color + "9b" }}>
              Liquidity
            </Tab>
            <Tab color='black' _selected={{ color: "white", bg: color + "9b" }}>
              Lenster
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <DrawerBody color='black'>
                {/* <Text mb='8px'>Swap: </Text>

          <Box display='flex' mb='20px'>
            <Input
              placeholder='Swap from'
              size='md'
              mx='10px'
              onChange={(e) => setInputToken(e.target.value)}
            />
            ←→
            <Input
              placeholder='Swap to'
              size='md'
              mx='10px'
              onChange={(e) => setOutputToken(e.target.value)}
            />
          </Box>
          <Box display='flex' mb='20px'>
            <Text>
              {getTokenAddress(chainId, inputToken)}←→
              {getTokenAddress(chainId, outputToken)}
            </Text>
          </Box>
          <Box display='flex' mb='20px'>
            <Input
              placeholder='Amount'
              size='md'
              mx='10px'
              onChange={(e) => setAmount(e.target.value)}
            />
            ←→
            <Input placeholder='Estimated amount' size='md' mx='10px' />
          </Box>
          <Box display='flex' mb='50px'>
            <Button
              colorScheme='purple'
              mx='5px'
              onClick={async () =>
                swapTokensV2(
                  quickSwapRouter,
                  quickSwapABI,
                  getTokenAddress(chainId, inputToken),
                  getTokenAddress(chainId, outputToken),
                  amount
                )
              }
            >
              Swap
            </Button>
          </Box> */}
                <Text mb='8px'>Provide Liquidity: </Text>
                <Box display='flex' marginBottom='30px'>
                  <Input
                    placeholder='Usdc supply'
                    size='md'
                    mx='10px'
                    maxWidth='300px'
                  />
                  <Button
                    colorScheme='purple'
                    mx='5px'
                    onClick={() =>
                      aave.supply(
                        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                        String(parseInt(amount) * Math.pow(10, 6))
                      )
                    }
                  >
                    Supply
                  </Button>
                </Box>
                <Text mb='8px'>Withdraw Liquidity: </Text>
                <Box display='flex'>
                  <Input
                    placeholder='Usdc withdraw'
                    size='md'
                    mx='10px'
                    maxWidth='300px'
                  />
                  <Button
                    colorScheme='purple'
                    mx='5px'
                    onClick={() =>
                      aave.withdraw(
                        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                        String(parseInt(amount) * Math.pow(10, 6))
                      )
                    }
                  >
                    Withdraw
                  </Button>
                </Box>
              </DrawerBody>
            </TabPanel>
            <TabPanel overflowY='scroll' maxHeight='90vh'>
              <LensPost condition='aave' color='#ff007b9b' />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </DrawerContent>
    </Drawer>
  );
};

export default Modal;
