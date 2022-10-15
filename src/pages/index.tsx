import type { NextPage } from "next";
import { UNISWAP_COLOR, AAVE_COLOR, COWSWAP_COLOR } from "@/styles/colors";
import BigBubble from "@/components/BigBubble";
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";
import { Box } from "@chakra-ui/react";
import { aaveNode } from "@/data/protocols";
import { GetWalletData } from "@/components/getWalletBalance";
import { NodeType, Protocol, TokenBalance } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { useSigner } from "wagmi";
import { Tvl } from "@/components/tvl";
import CowSwapSideBar from "@/components/CowSwapSideBar";
import { fetchUniswapData, fetchAaveData } from "@/fetch/fetchProtocolData";

const Graph = dynamic(() => import("@/components/CollisionDetectionFG"), {
  ssr: false,
});

const DEFAULT_BUBBLE_SIZE = 100;

const Home: NextPage = () => {
  const [tokenBalance, setTokenBalance] = useState<{
    [p: string]: TokenBalance[];
  }>({});

  const { data: signer, isError, isLoading } = useSigner();

  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [uniswapData, setUniswapData] = useState<NodeType[]>([]);
  const [aaveData, setAaveData] = useState<NodeType[]>([]);
  const { isDisconnected } = useAccount();
  const [uniTvl, setUniTvl] = useState<number>();
  const [aaveTvl, setAaveTvl] = useState<number>();
  const walletdata = useMemo(() => {
    return new GetWalletData();
  }, []);

  useEffect(() => {
    // const aave = new AAVE();
    // const cowSwap = new CowSwap();
    const tvl = new Tvl();

    const fetchTokenBalance = async () => {
      const tokenBalance = await walletdata.getBalanceForEachToken();
      setTokenBalance(tokenBalance);
      setHasFetched(true);
    };

    const fetchProtocolData = async () => {
      setUniswapData((await fetchUniswapData()) || []);
      setAaveData((await fetchAaveData()) || []);
    };

    const fetchTvl = async () => {
      setUniTvl(await tvl.getUniswapTvl());
      setAaveTvl(await tvl.getAaveTvl());
    };

    fetchTokenBalance();
    fetchProtocolData();
    fetchTvl();
  }, [walletdata]);

  const refreshUsdcBalance = () => {
    walletdata.getBalanceForEachToken();
  };

  const aaveBubbleSize = useMemo(() => {
    return aaveTvl && uniTvl ? (500 * aaveTvl) / uniTvl : DEFAULT_BUBBLE_SIZE;
  }, [aaveTvl, uniTvl]);

  const [model, setModel] = useState(false);

  return (
    <Box display='flex' fontFamily='body'>
      <Navbar
        tokenBalance={tokenBalance}
        hasFetched={hasFetched}
        isDisconnected={isDisconnected}
        refreshUsdcBalance={refreshUsdcBalance}
      />
      <BigBubble
        size={500}
        name='Uniswap'
        bubbleColor={UNISWAP_COLOR.bigBubble}
        imagePath='/Uniswap.png'
        textColor={UNISWAP_COLOR.textColor}
      >
        <Graph
          size={20}
          data={uniswapData}
          highlightColor={UNISWAP_COLOR.highlightColor}
        />
      </BigBubble>
      <BigBubble
        size={aaveBubbleSize}
        name='AAVE'
        bubbleColor={AAVE_COLOR.bigBubble}
        imagePath='/AAVE.png'
        textColor={AAVE_COLOR.textColor}
      >
        <Graph
          size={20}
          data={aaveNode}
          highlightColor={AAVE_COLOR.highlightColor}
        />
      </BigBubble>
      <div onClick={() => setModel(true)}>
        <BigBubble
          size={300}
          name='Cow Swap'
          bubbleColor={COWSWAP_COLOR.bigBubble}
          imagePath='/CowSwap.png'
          textColor={COWSWAP_COLOR.textColor}
        >
          <Graph
            size={200 / 10}
            data={[]}
            highlightColor={COWSWAP_COLOR.highlightColor}
          />
        </BigBubble>
      </div>
      <CowSwapSideBar
        isOpen={model}
        onClose={() => {
          setModel(false);
        }}
        node={{}}
      />
    </Box>
  );
};

export default Home;

// export const getServerSideProps = async () => {
//   // Write the function for server side
// };
