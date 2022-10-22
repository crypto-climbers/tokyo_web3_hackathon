export interface NodeType {
  x: number;
  y: number;
  vx: number;
  vy: number;
  val: number;
  title: string;
  token0Address: string;
  token0: string;
  token1Address?: string;
  token1?: string;
  color: string;
  protocol: Protocol;
  img?: string[];
}

export enum ChainName {
  MATIC = "matic",
  OPTIMISM = "optimism",
}

export enum Protocol {
  UNISWAP = "uniswap",
  AAVE = "aave",
  COWSWAP = "cowswap",
}

export interface TokenBalance {
  symbol: string;
  tokenBalance: number;
  usdBalance: number;
}

export enum ViewType {
  TVL = "TVL",
  APL = "APL",
  TXs = "TXs",
  TA = "TA",
}
