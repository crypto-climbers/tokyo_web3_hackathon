import { ethers } from "ethers";
import { ERC20_ABI } from "@/data/token/erc20.abi";
import { AGGREGATOR_V3_INTERFACE_ABI } from "@/data/chainlink/aggregatorV3Interface.abi";
import { ChainName, TokenBalance } from "@/types";
import { getAccount } from "@wagmi/core";
import { POLYGON_TOKEN_ADDRESS_LIST } from "@/data/token/polygonTokenList";
import { OPTIMISM_TOKEN_ADDRESS_LIST } from "@/data/token/optimismTokenList";
import { UNISWAP_V3_NFT_ABI } from "@/data/uniswap/uniswapV3Nft.abi";
import { UNISWAP_NONFUNGIBLE_POSITION_MANAGER_ABI } from "@/data/uniswap/nonfungiblePositionManager.abi";
import { AAVE_POOL_ABI } from "@/data/aave/pool.abi";

const address = getAccount().address;
const polygon_provider = new ethers.providers.AlchemyProvider(
  ChainName.MATIC,
  process.env.PROVIDER_POLYGON
);
const optimism_provider = new ethers.providers.AlchemyProvider(
  ChainName.OPTIMISM,
  process.env.PROVIDER_OPTIMISM
);

export class GetWalletData {
  async getBalanceForEachToken() {
    // const ethereum = (window as any).ethereum;
    // const accounts = await ethereum.request({
    //   method: "eth_requestAccounts",
    // });
    const walletAddress = getAccount().address;

    // TODO: Whose address?
    const walletAddress2 = "0xEE860E9d8eCBFfEa3D27Eb76E5B923C2E9488ACf";

    const tokenBalanceMap: { [p: string]: TokenBalance[] } = {};

    let userBalanceInPolygon = [];
    let userBalanceInOptimism = [];

    for (let i = 0; i < POLYGON_TOKEN_ADDRESS_LIST.length; i++) {
      const symbol = POLYGON_TOKEN_ADDRESS_LIST[i].symbol;
      let balance;
      let usdPrice;
      if (POLYGON_TOKEN_ADDRESS_LIST[i].address !== "0x0") {
        const contract = new ethers.Contract(
          POLYGON_TOKEN_ADDRESS_LIST[i].address,
          ERC20_ABI,
          polygon_provider
        );
        const decimals = await contract.decimals();
        balance =
          parseInt(await contract.balanceOf(walletAddress2)) *
          Math.pow(10, -decimals);
        const priceFeed = new ethers.Contract(
          POLYGON_TOKEN_ADDRESS_LIST[i].priceFeed,
          AGGREGATOR_V3_INTERFACE_ABI,
          polygon_provider
        );
        usdPrice =
          parseInt((await priceFeed.latestRoundData()).answer) *
          Math.pow(10, -8);
      } else {
        balance = parseFloat(
          ethers.utils.formatEther(
            await polygon_provider.getBalance(walletAddress2)
          )
        );
        const priceFeed = new ethers.Contract(
          POLYGON_TOKEN_ADDRESS_LIST[i].priceFeed,
          AGGREGATOR_V3_INTERFACE_ABI,
          polygon_provider
        );
        usdPrice =
          parseInt((await priceFeed.latestRoundData()).answer) *
          Math.pow(10, -8);
      }
      userBalanceInPolygon.push({
        symbol: symbol,
        tokenBalance: balance,
        usdBalance: balance * usdPrice,
      });
    }

    tokenBalanceMap["POLYGON"] = userBalanceInPolygon;

    for (let i = 0; i < OPTIMISM_TOKEN_ADDRESS_LIST.length; i++) {
      const symbol = OPTIMISM_TOKEN_ADDRESS_LIST[i].symbol;
      let balance;
      let usdPrice;
      if (OPTIMISM_TOKEN_ADDRESS_LIST[i].address !== "0x0") {
        const contract = new ethers.Contract(
          OPTIMISM_TOKEN_ADDRESS_LIST[i].address,
          ERC20_ABI,
          optimism_provider
        );
        const decimals = await contract.decimals();
        balance =
          parseInt(await contract.balanceOf(walletAddress2)) *
          Math.pow(10, -decimals);
        const priceFeed = new ethers.Contract(
          OPTIMISM_TOKEN_ADDRESS_LIST[i].priceFeed,
          AGGREGATOR_V3_INTERFACE_ABI,
          optimism_provider
        );
        usdPrice =
          parseInt((await priceFeed.latestRoundData()).answer) *
          Math.pow(10, -8);
      } else {
        balance = parseFloat(
          ethers.utils.formatEther(
            await optimism_provider.getBalance(walletAddress2)
          )
        );
        const priceFeed = new ethers.Contract(
          OPTIMISM_TOKEN_ADDRESS_LIST[i].priceFeed,
          AGGREGATOR_V3_INTERFACE_ABI,
          optimism_provider
        );
        usdPrice =
          parseInt((await priceFeed.latestRoundData()).answer) *
          Math.pow(10, -8);
      }
      userBalanceInOptimism.push({
        symbol: symbol,
        tokenBalance: balance,
        usdBalance: balance * usdPrice,
      });
    }
    tokenBalanceMap["OPTIMISM"] = userBalanceInOptimism;

    return tokenBalanceMap;
  }

  async getDepositedBalanceInUniswap() {
    const nftContractAddress_polygon =
      "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
    const nftContractAddress_optimism =
      "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
    const nonfungiblePositionManagerAddress =
      "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

    const nftContract = new ethers.Contract(
      nftContractAddress_polygon,
      UNISWAP_V3_NFT_ABI,
      polygon_provider
    );
    const nftManagerContract = new ethers.Contract(
      nonfungiblePositionManagerAddress,
      UNISWAP_NONFUNGIBLE_POSITION_MANAGER_ABI,
      polygon_provider
    );
    const balanceOf = await nftContract.balanceOf(address);
    let tokenIdList = [];
    for (let i = 0; i < balanceOf; i++) {
      const tokenId = parseInt(
        await nftContract.tokenOfOwnerByIndex(address, i)
      );
      const data = await nftManagerContract.positions(tokenId);
      tokenIdList.push(data);
    }
    console.log(tokenIdList);
  }

  async getDepositedBalanceInAave() {
    const poolAddress = "0x794a61358D6845594F94dc1DB02A252b5b4814aD";
    const poolDataProviderAddress =
      "0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654";
    const poolContract = new ethers.Contract(
      poolAddress,
      AAVE_POOL_ABI,
      polygon_provider
    );
    const data = await poolContract.getUserAccountData(address);
    console.log("data: ", data);
  }

  async getDepositedBalanceInCowSwap() {}
}
