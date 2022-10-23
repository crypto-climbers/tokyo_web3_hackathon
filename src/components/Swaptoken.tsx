import { ContractFactory, ethers } from "ethers";
import { useState } from "react";
import { quickSwapABI, uniSwapABI } from "@/data/ABI";
import { quickSwapRouter, uniSwapRouter } from "@/data/router";
import { polygonUsdcAddress, polygonUsdtAddress } from "@/data/token";

//tested on quickswap - not sure if it would work for other V2 protocols though
export const swapTokensV2 = async (
  router,
  ABI,
  inputToken,
  outputToken,
  amountIn
) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const myContract = new ethers.Contract(router, ABI, signer);
  //hardcoding minimum output as 95% of the input
  const amountOutMin = amountIn * 0.95;
  const path = [inputToken, outputToken];
  const to = await signer.getAddress();
  //console.log(to);
  const deadline = Math.floor(Date.now() / 1000) + 10 * 60; //deadline hardcoded for ten minutes
  const rawTx = await myContract.populateTransaction.swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    path,
    to,
    deadline
  );
  rawTx.gasLimit = await myContract.estimateGas.swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    path,
    to,
    deadline
  );
  const response = await signer.sendTransaction(rawTx);
  return response;
};

//V3 not working as of now....
export const swapTokensV3 = async (
  router,
  ABI,
  inputToken,
  outputToken,
  amountIn
) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const myContract = new ethers.Contract(router, ABI, signer);
  const amountOutMin = amountIn * 0.95;
  const path = [inputToken, outputToken];
  const to = await signer.getAddress();
  const deadline = Math.floor(Date.now() / 1000) + 10 * 60; //ten minutes
  const rawTx = await myContract.populateTransaction.swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    path,
    to
  );
  rawTx.gasLimit = 1000000; //await myContract.estimateGas.swapExactTokensForTokens(amountIn,amountOutMin,path,to)
  const response = await signer.sendTransaction(rawTx);
  return response;
};

const TxTest = () => {
  const [isVerified, setIsVerified] = useState(false);

  const onClick = async () => {
    const response = await swapTokensV2(
      quickSwapRouter,
      quickSwapABI,
      polygonUsdcAddress,
      polygonUsdtAddress,
      1000000
    );
    //const response = await swapTokensV3(uniSwapRouter, uniSwapABI, polygonUsdcAddress, polygonUsdtAddress, 1000000)
  };

  return (
    <>
      <button onClick={onClick}>swapToken</button>
      {isVerified && <p>Verified!</p>}
    </>
  );
};

export default TxTest;
