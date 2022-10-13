import { BigNumber, ethers } from "ethers";
import { AAVE_POOL_ABI } from "@/data/aave/pool.abi";
import { useSigner } from "wagmi";

// const polygon_provider = new ethers.providers.AlchemyProvider(
//   "matic",
//   process.env.PROVIDER_POLYGON
// );
// const optimism_provider = new ethers.providers.AlchemyProvider(
//   "optimism",
//   process.env.PROVIDER_OPTIMISM
// );
import { getAccount } from "@wagmi/core";
import { polygonUsdtAddress } from "@/data/token";

const polygon_poolAddress = "0x794a61358D6845594F94dc1DB02A252b5b4814aD";
const polygon_usdc = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
//const { data: signer, isError, isLoading } = useSigner();

//const polygon_poolContract = new ethers.Contract(polygon_poolAddress, AAVE_POOL_ABI, polygon_provider);

export class AAVE {
  async supply(tokenAddress: string, amount: string) {
    try {
      const ethereum = (window as any).ethereum;
      const walletAddress = getAccount().address;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const polygon_poolContract = new ethers.Contract(
        polygon_poolAddress,
        AAVE_POOL_ABI,
        signer
      );
      const rawTx = await polygon_poolContract.populateTransaction.supply(
        polygonUsdtAddress,
        amount,
        walletAddress,
        0
      );
      rawTx.gasLimit = BigNumber.from(400000);
      console.log(rawTx);
      const response = signer.sendTransaction(rawTx);
      return response;
    } catch (e) {
      console.error("Rejected", e);
      return;
    }
  }
  async withdraw(tokenAddress: string, amount: string) {
    try {
      const ethereum = (window as any).ethereum;
      const walletAddress = getAccount().address;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const polygon_poolContract = new ethers.Contract(
        polygon_poolAddress,
        AAVE_POOL_ABI,
        signer
      );
      const rawTx = await polygon_poolContract.populateTransaction.withdraw(
        tokenAddress,
        amount,
        walletAddress
      );
      // idk why, but I can't use estimateGas for this function
      //const gasLimit = await polygon_poolContract.estimateGas.supply(walletAddress, amount, walletAddress, 0);
      rawTx.gasLimit = BigNumber.from(400000);
      console.log(rawTx);
      const response = await signer.sendTransaction(rawTx);
      return response;
    } catch (e) {
      console.error("Rejected", e);
      return;
    }
  }
  async borrow(tokenAddress: string, amount: string, interestMode?: number, referralCode?: number, onBehalfOf?: string, signer) {
    try {
      const walletAddress = getAccount().address;
      const polygon_poolContract = new ethers.Contract(
        polygon_poolAddress,
        AAVE_POOL_ABI,
        signer
      );
      const rawTx = await polygon_poolContract.populateTransaction.borrow(
        tokenAddress,
        amount,
        interestMode,
        referralCode,
        onBehalfOf
      );
      rawTx.gasLimit = BigNumber.from(400000);
      console.log(rawTx);
      const response = signer.sendTransaction(rawTx);
      return response;
    } catch (e) {
      console.error("Rejected", e);
      return;
    }
  }
}
