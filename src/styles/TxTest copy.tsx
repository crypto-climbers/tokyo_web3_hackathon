import { ContractFactory, ethers } from "ethers";
import { useState } from "react";
import { quickSwapABI, uniSwapABI } from "@/data/ABI";
import { quickSwapRouter, uniSwapRouter } from "@/data/router";
import { polygonUsdcAddress, polygonUsdtAddress } from "@/data/token";

const swapTokens = async (router, ABI, tokenA, tokenB, amountIn) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();

  const myContract = new ethers.Contract(router, ABI, signer);
  const amountOutMin = 900000;
  const path = [tokenA, tokenB];
  const to = "0xEE860E9d8eCBFfEa3D27Eb76E5B923C2E9488ACf";
  const deadline = Math.floor(Date.now() / 1000) + 10 * 60; //ten minutes
  //const nonce = w3.eth.get_transaction_count(myAddress)

  const rawTx = await myContract.populateTransaction.swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    path,
    to,
    deadline
  );
  console.log(rawTx);
  rawTx.gasLimit = await myContract.estimateGas.swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    path,
    to,
    deadline
  );
  console.log(rawTx);
  const response = await signer.sendTransaction(rawTx);
  return response;
};

const TxTest_copy = () => {
  const [isVerified, setIsVerified] = useState(false);

  const onClick = async () => {
    const response = await swapTokens(
      quickSwapRouter,
      quickSwapABI,
      polygonUsdcAddress,
      polygonUsdtAddress,
      100000
    );
  };

  return (
    <>
      <button onClick={onClick}>TxTest</button>
      {isVerified && <p>Verified!</p>}
    </>
  );
};

export default TxTest_copy;
