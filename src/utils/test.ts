// import { ethers } from "ethers";
// import { abi as UniswapV3Factory_ABI } from "@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json";

// import { abi as IUniswapV3PoolABI } from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";

// import { Token } from "@uniswap/sdk-core";
// import { Pool } from "@uniswap/v3-sdk";

// //必要なname,decimals,symbolのみ。
// const ERC20ABI = [
//   {
//     constant: true,
//     inputs: [],
//     name: "name",
//     outputs: [
//       {
//         name: "",
//         type: "string",
//       },
//     ],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "decimals",
//     outputs: [
//       {
//         name: "",
//         type: "uint8",
//       },
//     ],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "symbol",
//     outputs: [
//       {
//         name: "",
//         type: "string",
//       },
//     ],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
// ];

// export const uniswapPrice = async (
//   tokenAaddress: string,
//   tokenBaddress: string,
//   provider: ethers.providers.JsonRpcProvider
// ) => {
//   //ネットワーク取得
//   const network = await provider.getNetwork();

//   //Uniswapコントラクト実装
//   const uniswapContract = new ethers.Contract(
//     "0x1F98431c8aD98523631AE4a59f267346ea31F984", //全ネットワークで共通　https://docs.uniswap.org/protocol/reference/deployments
//     UniswapV3Factory_ABI,
//     provider
//   );

//   //トークンコントラクト実装
//   const tokenAContract = new ethers.Contract(tokenAaddress, ERC20ABI, provider);
//   const tokenBContract = new ethers.Contract(tokenBaddress, ERC20ABI, provider);

//   //トークン属性取得
//   const [
//     tokenAname,
//     tokenAsymbol,
//     tokenAdecimals,
//     tokenBname,
//     tokenBsymbol,
//     tokenBdecimals,
//   ] = await Promise.all([
//     tokenAContract.name(),
//     tokenAContract.symbol(),
//     tokenAContract.decimals(),
//     tokenBContract.name(),
//     tokenBContract.symbol(),
//     tokenBContract.decimals(),
//   ]);

//   //プールアドレス取得
//   const poolAddress = await uniswapContract.getPool(
//     tokenAaddress,
//     tokenBaddress,
//     3000
//   );

//   //プールが存在しない時は終了。
//   if (poolAddress == "0x0000000000000000000000000000000000000000") {
//     console.log("No Pool");
//     return;
//   }

//   //プールコントラクト実装
//   const poolContract = new ethers.Contract(
//     poolAddress,
//     IUniswapV3PoolABI,
//     provider
//   );

//   //プール属性取得
//   const [token0address, token1address, fee, liquidity, slot] =
//     await Promise.all([
//       poolContract.token0(),
//       poolContract.token1(),
//       poolContract.fee(),
//       poolContract.liquidity(),
//       poolContract.slot0(),
//     ]);

//   //トークン実装
//   const TokenA = new Token(
//     network.chainId,
//     tokenAaddress,
//     tokenAdecimals,
//     tokenAsymbol,
//     tokenAname
//   );
//   const TokenB = new Token(
//     network.chainId,
//     tokenBaddress,
//     tokenBdecimals,
//     tokenBsymbol,
//     tokenBname
//   );
//   //プール実装
//   const pool = new Pool(
//     TokenA,
//     TokenB,
//     fee,
//     slot[0].toString(),
//     liquidity.toString(),
//     slot[1]
//   );

//   //出力
//   var tokenAPrice;
//   var tokenBPrice;
//   if (tokenAaddress == token0address) {
//     tokenAPrice = pool.token0Price;
//     tokenBPrice = pool.token1Price;
//   } else {
//     tokenAPrice = pool.token1Price;
//     tokenBPrice = pool.token0Price;
//   }
// };