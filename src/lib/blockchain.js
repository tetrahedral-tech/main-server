import { Token, ChainId } from '@uniswap/sdk-core';
import { parseUnits, formatUnits } from 'ethers';
import { PUBLIC_CHAINID } from '$env/static/public';

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
	},
	[ChainId.ARBITRUM_ONE]: {
		weth: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
		usdc: '0xaf88d065e77c8cc2239327c5edb3a432268e5831'
	}
};

const chainId = Number(PUBLIC_CHAINID);
export const tokens = {
	weth: new Token(chainId, addresses[chainId].weth, 18, 'WETH', 'Wrapped Ether'),
	usdc: new Token(chainId, addresses[chainId].usdc, 6, 'USDC', 'USD//C')
};

export const fromReadableAmount = (amount, decimals) => parseUnits(amount.toString(), decimals);
export const toReadableAmount = (rawAmount, decimals) => formatUnits(rawAmount, decimals);
