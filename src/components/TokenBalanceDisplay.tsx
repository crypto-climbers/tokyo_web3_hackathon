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
import { Spinner } from "@chakra-ui/react";
import { TokenBalance } from "@/types";
import Image from "next/image";
import { chainIcon } from "@/data/chainIcon";

interface Props {
  tokenBalance: { [p: string]: TokenBalance[] };
  hasFetched: boolean;
}

const TokenBalanceDisplay = ({ hasFetched, tokenBalance }: Props) => {
  return (
    <Box
      w='400px'
      h='calc(100vh)'
      bg='white'
      color='black'
      display='flex'
      flexDirection='column'
      alignItems='center'
    >
      {hasFetched ? (
        <Box mt='30px' width='75%'>
          {Object.keys(tokenBalance).map((chain: string, i: number) => {
            return (
              <>
                <Accordion defaultIndex={[0]} allowMultiple>
                  <AccordionItem marginBottom='30px'>
                    <h2>
                      <AccordionButton display='flex' justifyContent='space-between'>
                        <Text fontWeight='700' textAlign='center' key={i}>
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
                        <Box display='flex' justifyContent='space-between' marginBottom='8px'>
                          <ListItem listStyleType='none' fontWeight='600'>
                            Token
                          </ListItem>
                          <ListItem listStyleType='none' fontWeight='600'>
                            USDC
                          </ListItem>
                        </Box>
                        {tokenBalance[chain].map((token, i) => (
                          <Box key={i} display='flex' justifyContent='space-between'>
                            <ListItem>
                              {token.tokenBalance.toFixed(6)} {token.symbol}
                            </ListItem>
                            <ListItem>
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
      ) : (
        <Spinner
          thickness='4px'
          speed='0.65s'
          emptyColor='gray.200'
          color='blue.500'
          size='xl'
          mt='40px'
        />
      )}
    </Box>
  );
};

export default TokenBalanceDisplay;
