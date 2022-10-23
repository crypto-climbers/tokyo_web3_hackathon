import { BigNumber, ethers } from "ethers";
import { UNISWAP_SWAP_ROUTER_02_ABI } from "@/data/uniswap/SwapRouter02.abi";

export class UNISWAP {
    async swap() {
        const Polygon_USDC_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
        const Polygon_DAI_ADDRESS = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
        const SWAP_ROUTER_02 = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
        let iface = new ethers.utils.Interface(UNISWAP_SWAP_ROUTER_02_ABI);
        console.log("iface", iface);
        const encodedData = iface.encodeFunctionData(
            "exactInputSingle",
            [{
                tokenIn: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
                tokenOut: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                fee: 100,
                recipient: "0x666BAc32F3258b5c4CCc31a262660457c6a470c1",
                amountIn: {
                    "type": "BigNumber",
                    "hex": "0x016345785d8a0000"
                },
                amountOutMinimum: {
                    "type": "BigNumber",
                    "hex": "0x018293"
                },
                sqrtPriceLimitX96: {
                    "type": "BigNumber",
                    "hex": "0x00"
                }
            }
            ]
        );
        const ethereum = (window as any).ethereum;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const eth_Swaprouter_Contract = new ethers.Contract(
            SWAP_ROUTER_02,
            UNISWAP_SWAP_ROUTER_02_ABI,
            signer
        );
        console.log("encodedData", encodedData);
        console.log("deadline", Date.now() + 36000);

        const rawTx = await eth_Swaprouter_Contract.populateTransaction.multicall(
            Date.now() + 36000,
            [encodedData]
        );
        console.log(rawTx);

        rawTx.gasLimit = BigNumber.from(400000);
        console.log(rawTx);
        const response = signer.sendTransaction(rawTx);
        return response;
    }
}