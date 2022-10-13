import { Button } from "@chakra-ui/react";

interface Props {
    refreshUsdcBalance: () => void;
  }

const GetUsdcButton = ({ refreshUsdcBalance }: Props) => {
  return (
    <Button marginTop='30px' padding='15px' onClick={refreshUsdcBalance}>
        Get USDC Balance
    </Button>
  );
};

export default GetUsdcButton;
