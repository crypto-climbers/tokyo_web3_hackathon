import type { NextPage } from "next";
import { UNISWAP_COLOR, AAVE_COLOR, COWSWAP_COLOR } from "@/styles/colors";
import BigBubble from "@/components/BigBubble";
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";
import { Box } from "@chakra-ui/react";
import { cowswapNode, uniswapNode } from "@/data/protocols";
import { aaveNode } from "@/data/protocols";
import { GetWalletData } from "@/components/getWalletBalance";
import { AAVE } from "@/components/aave";
import { NodeType, Protocol, TokenBalance } from "@/types";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useSigner } from "wagmi";
import { CowSwap } from "@/components/cowSwap";
import { createClient } from 'urql';
import { Tvl } from "@/components/tvl";
import CowSwapSideBar from "@/components/CowSwapSideBar";
import { useDisclosure } from "@chakra-ui/react";

const Graph = dynamic(() => import("@/components/CollisionDetectionFG"), {
  ssr: false,
});

// query to get te top 5 liquidity pools on uniswap v3
const query1 = `
  query {
    pools(
      orderBy: totalValueLockedUSD
      first: 5
      orderDirection: desc
      where: {txCount_gte: "10000"}
    ) {
      token0 {
        id
        symbol
      }
      token1 {
        id
        symbol
      }
      totalValueLockedUSD
    }
  }
`

// query to get all the opened positions of a user
const query2 = `
  query {
    positions (where: { owner: "0x11e4857bb9993a50c685a79afad4e6f65d518dda"}) {
      token0 {
        id
        symbol
      }
      token1 {
        id
        symbol
      }
      pool {
        totalValueLockedUSD
      }
    }
  }
`

const query3 = `
  query {
    reserves(orderBy: totalLiquidity, orderDirection: desc, first: 5) {
      name
      symbol
      totalLiquidity
      sToken {
        id
      }
    }
  }
`

const query4 = `
  query {
    userReserves(where: {user: "0x0d216efacfa97b9e4e5d801c4bcc372cb77003c1"}) {
      reserve {
        name
        symbol
        totalLiquidity
        sToken {
          id
        }
      }
    }
  }
`

const UNISWAP_APIURL = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";

const uniswapClient = createClient({
  url: UNISWAP_APIURL
})

const AAVE_APIURL = "https://api.thegraph.com/subgraphs/name/aave/protocol-v3-polygon";

const aaveClient = createClient({
  url: AAVE_APIURL
})


const Home: NextPage = () => {
  const [tokenBalance, setTokenBalance] = useState<{
    [p: string]: TokenBalance[];
  }>({});

  const { data: signer, isError, isLoading } = useSigner();

  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [uniswapData, setUniswapData] = useState<NodeType[]>([]);
  const [aaveData, setAaveData] = useState<NodeType[]>([]);
  const { isConnected } = useAccount();
  const [uniTvl, setUniTvl] = useState<number>();
  const [aaveTvl, setAaveTvl] = useState<number>();
  const walletdata = new GetWalletData();

  const aave = new AAVE();
  const cowSwap = new CowSwap();
  const tvl = new Tvl();

  async function fetchTvl() {
    setUniTvl(await tvl.getUniswapTvl());
    setAaveTvl(await tvl.getAaveTvl());
  }

  async function fetchUniswapData() {
    const response1 = await uniswapClient.query(query1, {}).toPromise();
    const response2 = await uniswapClient.query(query2, {}).toPromise();

    const tmp: NodeType[] = [];
    let pools = response1.data.pools;
    const positions = response2.data.positions;

    // concatenate top 5 pools with user lp positions
    pools = pools.concat(positions);

    // remove duplicate pools
    pools = pools.filter((tag: any, index: any, array: any) => array.findIndex(t => t.token0.id === tag.token0.id && t.token1.id === tag.token1.id) === index);

    // sort pools by totalValueLockedUSD
    pools.sort((a: any, b: any) => {
      if (a.pool === undefined && b.pool === undefined) {
        return a.totalValueLockedUSD - b.totalValueLockedUSD;
      } else if (a.pool === undefined) {
        return a.totalValueLockedUSD - b.pool.totalValueLockedUSD;
      } else if (b.pool === undefined) {
        return a.pool.totalValueLockedUSD - b.totalValueLockedUSD;
      } else {
        return a.pool.totalValueLockedUSD - b.pool.totalValueLockedUSD;
      }
    });

    // create uniswap lp data
    pools.forEach((position: any, i: any) => {
      tmp.push({
        x: 1,
        y: 1,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
        val: pools.length < 10 ? i + 5 : i + 1 > 15 ? 15 : i + 1,
        color: UNISWAP_COLOR.smallBubbles,
        title: `${position.token0.symbol} - ${position.token1.symbol}`,
        token0Address: position.token0.id,
        token0: position.token0.symbol,
        token1Address: position.token1.id,
        token1: position.token1.symbol,
        protocol: Protocol.UNISWAP,
      });
    });

    setUniswapData(tmp);
  }

  async function fetchAaveData() {
    const response1 = await aaveClient.query(query3, {}).toPromise();
    const response2 = await aaveClient.query(query4, {}).toPromise();

    const tmp: NodeType[] = [];

    const array: any[] = [];
    response2.data.userReserves.forEach((reserve: any) => {
      array.push(reserve.reserve);
    });

    let reserves = response1.data.reserves.concat(array);

    console.log(reserves);

    reserves = reserves.filter((tag: any, index: any, array: any) => array.findIndex(t => t.symbol === tag.symbol) === index);

    reserves.sort((a: any, b: any) => {
      return a.totalLiquidity - b.totalLiquidity;
    });

    console.log(reserves);

    reserves.forEach((reserve: any, i: any) => {
      tmp.push({
        x: 1,
        y: 1,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
        val: i + 1 > 15 ? 15 : i + 1,
        color: AAVE_COLOR.smallBubbles,
        title: reserve.name,
        token0Address: reserve.sToken.id,
        token0: reserve.symbol,
        protocol: Protocol.AAVE,
      });
    });

    setAaveData(tmp);
  }

  useEffect(() => {
    const fetchTokenBalance = async () => {
      const tokenBalance = await walletdata.getBalanceForEachToken();
      setTokenBalance(tokenBalance);
      setHasFetched(true);
    };
    fetchTokenBalance();
    fetchUniswapData();
    fetchTvl();
    fetchAaveData();
  }, []);

  const refreshUsdcBalance = () => {
    walletdata.getBalanceForEachToken()
  }

  console.log(uniTvl);
  console.log(aaveTvl);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [model, setModel] = useState(false);

  // if (!uniTvl) {
  //   throw new Error('Unndefined signsture')
  // }
  // if (!aaveTvl) {
  //   throw new Error('Unndefined signsture')
  // }

  return (
    <Box display='flex' fontFamily='body'>
      <Navbar
        tokenBalance={tokenBalance}
        hasFetched={hasFetched}
        isConnected={isConnected}
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
        size={500 * aaveTvl / uniTvl}
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
      <button onClick={() => setModel(true)}>
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
          <CowSwapSideBar
            isOpen={model}
            onClose={() => {setModel(false)}}
            node={{}}
          />
      </button>
    </Box>
  );
};

export default Home;

// export const getServerSideProps = async () => {
//   // Write the function for server side
// };