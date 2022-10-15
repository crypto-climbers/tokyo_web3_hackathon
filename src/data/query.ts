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
`;

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
`;

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
`;

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
`;

export { query1, query2, query3, query4 };
