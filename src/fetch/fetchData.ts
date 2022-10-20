import { query1, query2, query3, query4, lensSearchQuery } from "@/data/query";
import { initUrql } from "@/libs/gql-requests";
import { NodeType, Protocol } from "@/types";
import { UNISWAP_COLOR, AAVE_COLOR } from "@/styles/colors";

const UNISWAP_APIURL =
  "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";

const AAVE_APIURL =
  "https://api.thegraph.com/subgraphs/name/aave/protocol-v3-polygon";

const LENS_APIURL = "https://api.lens.dev";

async function fetchUniswapData() {
  try {
    const client = await initUrql(UNISWAP_APIURL);

    const response1 = await client.query(query1, {}).toPromise();
    const response2 = await client.query(query2, {}).toPromise();

    const poolAndPositions: NodeType[] = [];
    let pools = response1 ? response1.data.pools : [];
    const positions = response2 ? response2.data.positions : [];

    // concatenate top 5 pools with user lp positions
    pools = pools.concat(positions);

    // remove duplicate pools
    pools = pools.filter(
      (tag: any, index: any, array: any) =>
        array.findIndex(
          (t) => t.token0.id === tag.token0.id && t.token1.id === tag.token1.id
        ) === index
    );

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
      poolAndPositions.push({
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
        img: [
          `/symbols/${position.token0.symbol}.png`,
          `/symbols/${position.token1.symbol}.png`,
        ],
      });
    });

    return poolAndPositions;
  } catch (error) {
    console.error(error);
  }
}

async function fetchAaveData() {
  try {
    const aaveClient = await initUrql(AAVE_APIURL);

    const response1 = await aaveClient.query(query3, {}).toPromise();
    const response2 = await aaveClient.query(query4, {}).toPromise();

    const reservesData: NodeType[] = [];

    const array: any[] = [];
    if (response2) {
      response2.data.userReserves.forEach((reserve: any) => {
        array.push(reserve.reserve);
      });
    }

    let reserves = response1 ? response1.data.reserves.concat(array) : [];

    console.log(reserves);

    reserves = reserves.filter(
      (tag: any, index: any, array: any) =>
        array.findIndex((t) => t.symbol === tag.symbol) === index
    );

    reserves.sort((a: any, b: any) => {
      return a.totalLiquidity - b.totalLiquidity;
    });

    console.log(reserves);

    reserves.forEach((reserve: any, i: any) => {
      reservesData.push({
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
        img: [`/symbols/${reserve.token0.symbol}.png`],
      });
    });

    return reservesData;
  } catch (error) {
    console.error(error);
  }
}

async function fetchPublications(condition: string) {
  try {
    const lensClient = await initUrql(LENS_APIURL);
    const response = await lensClient
      .query(lensSearchQuery(condition), {})
      .toPromise();
    console.log(response, ">>>");
    return response;
  } catch (error) {
    console.log(error);
  }
}

export { fetchUniswapData, fetchAaveData, fetchPublications };
