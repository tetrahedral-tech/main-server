import { Token, ChainId } from '@uniswap/sdk-core';
import { INFURA_SECRET } from '$env/static/private';
import { parseUnits, formatUnits } from 'ethers';

export const supportedChains = [ChainId.MAINNET, ChainId.GOERLI];
export let selectedChain = import.meta.env.PROD ? supportedChains[0] : supportedChains[1];
export const changeChain = newChain => {
	if (!supportedChains.includes(newChain)) throw new Error(`Unsupported Chain ${newChain}`);
	selectedChain = newChain;
};

export const chainNames = {
	[ChainId.GOERLI]: 'goerli',
	[ChainId.MAINNET]: 'mainnet'
};

export const addresses = {
	router: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
	quoter: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
	[ChainId.GOERLI]: {
		weth: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
		usdc: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F'
	},
	[ChainId.MAINNET]: {
		weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
		usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
	}
};

export const providerUrl = `https://${chainNames[selectedChain]}.infura.io/v3/${INFURA_SECRET}`;

export const tokens = {
	weth: new Token(selectedChain, addresses[selectedChain].weth, 18, 'WETH', 'Wrapped Ether'),
	usdc: new Token(selectedChain, addresses[selectedChain].usdc, 6, 'USDC', 'USD//C')
};

export const fromReadableAmount = (amount, decimals) => parseUnits(amount.toString(), decimals);

export const toReadableAmount = (rawAmount, decimals) => formatUnits(rawAmount, decimals);
