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
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

import { NodeType } from "@/types";
import { useCallback, useState } from "react";
import { swapTokensV2 } from "@/components/Swaptoken";
import { quickSwapABI, uniSwapABI } from "@/data/ABI";
import { quickSwapRouter, uniSwapRouter } from "@/data/router";
import { TOKEN_LIST } from "@/data/tokenlist";
import { AAVE } from "@/components/aave";
import { CowSwap } from "./cowSwap";
import LensPost from "./LensPost";

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
}

type SlideDirection = "top" | "left" | "bottom" | "right";

const QuickSwapSideBar = ({ isOpen, onClose, node }: Props) => {
  const toast = useToast();
  const statuses = ["success", "error", "warning", "info"];
  const [placement, setPlacement] = useState<SlideDirection>("right");

  const [inputToken, setInputToken] = useState("");
  const [outputToken, setOutputToken] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setEror] = useState("");

  const onClickSwap = useCallback(() => {
    // ここにスワップのロジック
  }, []);

  return (
    <Drawer placement={placement} onClose={onClose} isOpen={isOpen} size='lg'>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth='1px' bg='#042b64'>
          Quick Swap
        </DrawerHeader>
        <Tabs isFitted variant='enclosed' mt='20px'>
          <TabList mb='1em'>
            <Tab color='black' _selected={{ color: "white", bg: "#042b649b" }}>
              Swap
            </Tab>
            <Tab color='black' _selected={{ color: "white", bg: "#042b649b" }}>
              Social
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <DrawerBody color='black'>
                <Text color='red' h='30px'>
                  {error}
                </Text>

                <Text mb='8px'>Swap: </Text>

                <Box display='flex' mb='20px'>
                  <Input
                    placeholder='WETH'
                    size='md'
                    mx='10px'
                    value='WETH'
                    onChange={(e) => setInputToken(e.target.value)}
                  />
                  ←→
                  <Input
                    placeholder='USDC'
                    size='md'
                    mx='10px'
                    value='USDC'
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
                  <Button colorScheme='purple' mx='5px' onClick={onClickSwap}>
                    Swap
                  </Button>
                </Box>
              </DrawerBody>
            </TabPanel>
            <TabPanel overflowY='scroll' maxHeight='90vh'>
              <LensPost condition='quickswap' color='#042b64' />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </DrawerContent>
    </Drawer>
  );
};

export default QuickSwapSideBar;
