export class Tvl {
    async getUniswapTvl() {
        const response = await fetch('https://api.llama.fi/protocol/uniswap');
        const data = await response.json();
        const tvlOnPolygon = data.currentChainTvls.Polygon;
        const tvlOnOptimism = data.currentChainTvls.Optimism;
        console.log("uni on polygon: ", tvlOnPolygon);
        console.log("uni on optimism: ", tvlOnOptimism);
        return tvlOnPolygon;
    }
    async getAaveTvl() {
        const response = await fetch('https://api.llama.fi/protocols');
        const data = await response.json();
        const aaveData = data.find(({ id }) => id == 1599);
        const aaveTvlOnPolygon = aaveData.chainTvls.Polygon;
        const aaveTvlOptimism = aaveData.chainTvls.Optimism;
        console.log("aaveV3 on polygon: ", aaveTvlOnPolygon);
        console.log("aaveV3 on optimism: ", aaveTvlOptimism);
        return aaveTvlOnPolygon;
    }
}