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
  } from "@chakra-ui/react";

  import { NodeType } from "@/types";
  import { useState } from "react";
  import { swapTokensV2 } from "@/components/Swaptoken";
  import { quickSwapABI, uniSwapABI } from "@/data/ABI";
  import { quickSwapRouter, uniSwapRouter } from "@/data/router";
  import { TOKEN_LIST } from "@/data/tokenlist";
  import { AAVE } from "@/components/aave";
import { CowSwap } from "./cowSwap";

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

  const CowSwapSideBar = ({ isOpen, onClose, node }: Props) => {
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

    const cowSwap = new CowSwap();

    return (
      <Drawer placement={placement} onClose={onClose} isOpen={isOpen} size='lg'>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px' bg='gray'>
            CawSwap
          </DrawerHeader>
          <DrawerBody color='black'>
          <Text mb='8px'>Wrap: </Text>
            <Box display='flex' mb='45px'>
              <Input
                placeholder='Amount to wrap'
                size='md'
                mx='10px'
                maxWidth='270px'
                onChange={(e) => setAmount(e.target.value)}
              />
              <Button
              colorScheme='purple'
              mx='5px'
              onClick={cowSwap.ethToWeth}
              >
                Wrap
              </Button>
            </Box>

            <Button
              colorScheme='purple'
              marginBottom='50px'
              onClick={cowSwap.giveApproval}
            >
                Approve
            </Button>

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
              <Button
                colorScheme='purple'
                mx='5px'
                onClick={cowSwap.swapWethToUsdc}
              >
                Swap
              </Button>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  };

  export default CowSwapSideBar;
