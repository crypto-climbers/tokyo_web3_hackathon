import {
  Box,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import { TokenBalance } from "@/types";
import Image from "next/image";
import { chainIcon } from "@/data/chainIcon";

interface Props {
  tokenBalance: { [p: string]: TokenBalance[] };
}

const TokenBalanceDisplay = ({ tokenBalance }: Props) => {
  return (
    <Box
      w='400px'
      h='calc(100vh)'
      bg='white'
      color='black'
      display='flex'
      flexDirection='column'
      alignItems='center'
      fontFamily='body'
    >
      <Box mt='30px' width='75%'>
        {Object.keys(tokenBalance).map((chain: string, i: number) => {
          return (
            <>
              <Accordion defaultIndex={[0]} allowMultiple key={i}>
                <AccordionItem marginBottom='30px'>
                  <h2>
                    <AccordionButton
                      display='flex'
                      justifyContent='space-between'
                    >
                      <Text
                        fontWeight='700'
                        textAlign='center'
                        key={i}
                        fontFamily='title'
                      >
                        <Image
                          src={chainIcon[chain]}
                          alt='icon'
                          width='15px'
                          height='15px'
                        />
                        {chain}
                      </Text>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <UnorderedList>
                      <Box
                        display='flex'
                        justifyContent='space-between'
                        marginBottom='8px'
                      >
                        <ListItem
                          listStyleType='none'
                          fontWeight='600'
                          fontFamily='title'
                        >
                          Token
                        </ListItem>
                        <ListItem
                          listStyleType='none'
                          fontWeight='600'
                          fontFamily='title'
                        >
                          USDC
                        </ListItem>
                      </Box>
                      {tokenBalance[chain].map((token, i) => (
                        <Box
                          key={i}
                          display='flex'
                          justifyContent='space-between'
                        >
                          <ListItem>
                            {token.tokenBalance.toFixed(6)} {token.symbol}
                          </ListItem>
                          <ListItem listStyleType='none' textColor='gray'>
                            $ {token.usdBalance.toFixed(2)}
                          </ListItem>
                        </Box>
                      ))}
                    </UnorderedList>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </>
          );
        })}
      </Box>
    </Box>
  );
};

export default TokenBalanceDisplay;
