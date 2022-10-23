import type { NextPage } from "next";
import {
  UNISWAP_COLOR,
  AAVE_COLOR,
  COWSWAP_COLOR,
  CURVE_COLOR,
  LIDO_COLOR,
} from "@/styles/colors";
import BigBubble from "@/components/BigBubble";
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";
import { Box, Button, Select } from "@chakra-ui/react";
import { aaveNode, lidoNode, curveNode } from "@/data/protocols";
import { GetWalletData } from "@/components/getWalletBalance";
import { NodeType, TokenBalance, ViewType } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { Tvl } from "@/components/tvl";
import CowSwapSideBar from "@/components/CowSwapSideBar";
import { fetchUniswapData, fetchAaveData } from "@/fetch/fetchData";
import { UNISWAP } from "@/components/uniswap";
import { AAVE } from "@/components/aave";
const Graph = dynamic(() => import("@/components/CollisionDetectionFG"), {
  ssr: false,
});

const DEFAULT_BUBBLE_SIZE = 100;

const Home: NextPage = () => {
  const [tokenBalance, setTokenBalance] = useState<{
    [p: string]: TokenBalance[];
  }>({});
  const { isDisconnected } = useAccount();
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [uniswapData, setUniswapData] = useState<NodeType[]>([]);
  const [uniswapBubble, setUniswapBubble] = useState<number>(400);
  const [cowswapBubble, setCowswapBubble] = useState<number>(300);
  const [aaveData, setAaveData] = useState<NodeType[]>([]);
  const [uniTvl, setUniTvl] = useState<number>();
  const [aaveTvl, setAaveTvl] = useState<number>();
  const walletdata = useMemo(() => {
    return new GetWalletData();
  }, []);

  const [view, setView] = useState<ViewType>(ViewType.TVL);

  const aave = new AAVE();

  const aaveBubbleSize = useMemo(() => {
    return aaveTvl && uniTvl
      ? (uniswapBubble * aaveTvl) / uniTvl
      : DEFAULT_BUBBLE_SIZE;
  }, [aaveTvl, uniTvl, uniswapBubble]);
  const uniSwap = new UNISWAP();

  useEffect(() => {
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

  const [model, setModel] = useState(false);

  const handleView = useCallback((view: string) => {
    switch (view) {
      case "TXs":
        setView(ViewType.TXs);
        setUniswapBubble(410);
        setCowswapBubble(200);
        break;

      case "APR":
        setView(ViewType.APL);
        setUniswapBubble(350);
        setCowswapBubble(100);
        break;

      case "TA":
        setView(ViewType.TA);
        setUniswapBubble(300);
        setCowswapBubble(280);
        break;

      default:
        setView(ViewType.TVL);
        setUniswapBubble(400);
        setCowswapBubble(300);
    }
  }, []);


  return (
    <Box display='flex' fontFamily='body'>
      <Button onClick={() => uniSwap.swap()}>
        Swap matic to usdc
      </Button>
      <Button onClick={() => aave.supply(
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        "1",
      )}>
        aave
      </Button>
      <Navbar
        tokenBalance={tokenBalance}
        hasFetched={hasFetched}
        isDisconnected={isDisconnected}
        refreshUsdcBalance={refreshUsdcBalance}
      />
      <Box w='full' display='flex' flexDirection='column'>
        <Select
          w={500}
          ml={10}
          mt={5}
          defaultValue={view}
          onChange={(e) => {
            handleView(e.target.value);
          }}
        >
          <option value='TVL'>TVL</option>
          <option value='TXs'>TXs</option>
          <option value='APR'>APR</option>
          <option value='TA'>Traded amount</option>
        </Select>
        <Box display='flex' maxH='900px'>
          <BigBubble
            size={uniswapBubble}
            name='Uniswap'
            bubbleColor={UNISWAP_COLOR.bigBubble}
            imagePath='/Uniswap.png'
            textColor={UNISWAP_COLOR.textColor}
            x={10}
            y={10}
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
            x={20}
            y={30}
          >
            <Graph
              size={20}
              data={aaveNode}
              highlightColor={AAVE_COLOR.highlightColor}
            />
          </BigBubble>
          <div onClick={() => setModel(true)}>
            <BigBubble
              size={cowswapBubble}
              name='Cow Swap'
              bubbleColor={COWSWAP_COLOR.bigBubble}
              imagePath='/CowSwap.png'
              textColor={COWSWAP_COLOR.textColor}
              x={30}
              y={60}
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

          <BigBubble
            size={cowswapBubble}
            name='Curve'
            bubbleColor={"#3465a32b"}
            imagePath='/curve.png'
            textColor={CURVE_COLOR.textColor}
            x={40}
            y={60}
          >
            <Graph
              size={20}
              data={curveNode}
              highlightColor={CURVE_COLOR.highlightColor}
            />
          </BigBubble>
        </Box>
        <BigBubble
          size={aaveBubbleSize}
          name='Lido'
          bubbleColor={LIDO_COLOR.bigBubble}
          imagePath='/LDO.png'
          textColor={LIDO_COLOR.textColor}
          x={20}
          y={60}
        >
          <Graph
            size={20}
            data={lidoNode}
            highlightColor={LIDO_COLOR.highlightColor}
          />
        </BigBubble>
      </Box>
    </Box>
  );
};

export default Home;

// export const getServerSideProps = async () => {
//   // Write the function for server side
// };
