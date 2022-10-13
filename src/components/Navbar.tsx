import { Box, Text } from "@chakra-ui/react";
import WalletConnectButton from "@/components/WalletConnectButton";
import { TokenBalance } from "@/types";
import TokenBalanceDisplay from "./TokenBalanceDisplay";
import GetUsdcButton from "./GetUsdcButton";

interface Props {
  tokenBalance: { [p: string]: TokenBalance[] };
  hasFetched: boolean;
  isConnected: boolean;
  refreshUsdcBalance: () => void;
}

const Navbar = ({ tokenBalance, hasFetched, isConnected, refreshUsdcBalance }: Props) => {
  return (
    <Box
      w='400px'
      h='calc(100vh)'
      bg='white'
      color='black'
      display='flex'
      flexDirection='column'
      alignItems='center'
      paddingTop='40px'
      overflowY='auto'
      overflowX='hidden'
    >
      <Box display='flex'>
        <Text
          fontSize='3xl'
          fontFamily='title'
          fontWeight='700'
          textAlign='center'
          marginRight='5px'
        >
          Defi
        </Text>
        <Text
          fontSize='3xl'
          fontFamily='title'
          fontWeight='700'
          textAlign='center'
          color='rgb(255,0,255)'
        >
          Vista
        </Text>
      </Box>

      <WalletConnectButton />

      {isConnected && (
        <>
          <GetUsdcButton
            refreshUsdcBalance={refreshUsdcBalance}
          />
          <TokenBalanceDisplay
            tokenBalance={tokenBalance}
            hasFetched={hasFetched}
          />
        </>
      )}
    </Box>
  );
};

export default Navbar;