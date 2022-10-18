import ERC20 from "@openzeppelin/contracts/build/contracts/ERC20.json";
import { ethers, Wallet } from "ethers";
import { getAccount } from "@wagmi/core";
import { COWSWAP_WETH9_ABI } from "../data/cowSwap/weth9";
import { CowSdk, OrderKind } from "@cowprotocol/cow-sdk";

const address = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

const ethereum_provider = new ethers.providers.AlchemyProvider(
  "mainnet",
  process.env.PROVIDER_MAINNET
);

export class CowSwap {
  async ethToWeth() {
    try {
      const provider_wallet = new ethers.providers.Web3Provider(
        window.ethereum
      );
      const signer = provider_wallet.getSigner();
      const walletAddress = getAccount().address;

      const cowSwapWethGoerli = new ethers.Contract(
        "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
        COWSWAP_WETH9_ABI,
        signer
      );

      const rawTx = await cowSwapWethGoerli.populateTransaction.deposit();
      rawTx.value = ethers.BigNumber.from("100000000000000000");
      const response = await signer.sendTransaction(rawTx);
      console.log("response: ", response);

      return {
        status: "success",
        message: "Success",
      };
    } catch (error) {
      if (error.message.includes("insufficient")) {
        return {
          status: "error",
          message: "Insufficient balance",
        };
      } else {
        return {
          status: "error",
          message: "Something went wrong. Please try again",
        };
      }
    }
  }

  async giveApproval() {
    try {
      const provider_wallet = new ethers.providers.Web3Provider(
        window.ethereum
      );
      const signer = provider_wallet.getSigner();
      const walletAddress = getAccount().address;

      const cowSdk = new CowSdk(5, {
        // Leaving chainId empty will default to MAINNET
        signer: signer, // Provide a signer, so you can sign order
      });

      const erc20 = new ethers.Contract(
        "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
        ERC20.abi,
        signer
      );
      const tx = await erc20.approve(
        "0xC92E8bdf79f0507f65a392b0ab4667716BFE0110",
        ethers.constants.MaxUint256
      );
      // 0xC92E8bdf79f0507f65a392b0ab4667716BFE0110 <= GPv2 Vault Relayer contract in cow swap
      await tx.wait();
      return {
        status: "success",
        message: "Success",
      };
    } catch (error) {
      if (error.message.includes("reject")) {
        return {
          status: "error",
          message: "Rejected",
        };
      }
    }
  }

  async getQuote() {
    const provider_wallet = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider_wallet.getSigner();

    const cowSdk = new CowSdk(5, {
      // Leaving chainId empty will default to MAINNET
      signer: signer, // Provide a signer, so you can sign order
    });

    const quoteResponse = await cowSdk.cowApi.getQuote({
      kind: OrderKind.SELL, // Sell order (could also be BUY)
      sellToken: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6", // WETH
      buyToken: "0x07865c6e87b9f70255377e024ace6630c1eaa37f", // USDC
      amount: "100000000000000000", // 0.1 WETH
      userAddress: "0xb1fE4cCdB48c11a41cab60D698Cb71D5f6536A2e", // Trader
      validTo: Math.floor(Date.now() / 1000 + 60 * 30),
    });
    console.log(quoteResponse);
  }

  async swapWethToUsdc() {
    const provider_wallet = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider_wallet.getSigner();
    const walletAddress = getAccount().address;

    const cowSdk = new CowSdk(5, {
      // Leaving chainId empty will default to MAINNET
      signer: signer, // Provide a signer, so you can sign order
    });

    const quoteResponse = await cowSdk.cowApi.getQuote({
      kind: OrderKind.SELL, // Sell order (could also be BUY)
      sellToken: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6", // WETH
      buyToken: "0x07865c6e87b9f70255377e024ace6630c1eaa37f", // USDC
      amount: "100000000000000000", // 0.1 WETH
      userAddress: "0xb1fE4cCdB48c11a41cab60D698Cb71D5f6536A2e", // Trader
      validTo: Math.floor(Date.now() / 1000 + 60 * 30),
    });

    const {
      sellToken,
      buyToken,
      validTo: validToString,
      buyAmount,
      sellAmount,
      receiver,
      feeAmount,
    } = quoteResponse.quote;
    const validTo = parseInt(validToString);
    // Prepare the RAW order

    if (!walletAddress) {
      throw new Error("Unndefined signsture");
    }
    const order = {
      kind: OrderKind.SELL, // SELL or BUY
      receiver: walletAddress, // Your account or any other
      sellToken: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
      buyToken: "0x07865c6e87b9f70255377e024ace6630c1eaa37f",

      partiallyFillable: false, // "false" is for a "Fill or Kill" order, "true" for allowing "Partial execution" which is not supported yet
      // Deadline
      validTo: validTo,

      // Limit Price
      //    You can apply some slippage tolerance here to make sure the trade is executed.
      //    CoW protocol protects from MEV, so it can work with higher slippages
      sellAmount: sellAmount,
      buyAmount: buyAmount,

      // Use the fee you received from the API
      feeAmount: feeAmount,

      // The appData allows you to attach arbitrary information (meta-data) to the order. Its explained in their own section. For now, you can use this 0x0 value
      appData:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
    };

    // Sign the order
    const { signature, signingScheme } = await cowSdk.signOrder(order);

    if (!signature) {
      throw new Error("Unndefined signsture");
    }

    const orderId = await cowSdk.cowApi.sendOrder({
      order: { ...order, signature, signingScheme },
      owner: walletAddress,
    });
    console.log(`https://explorer.cow.fi/goerli/orders/${orderId}`);
  }
}
