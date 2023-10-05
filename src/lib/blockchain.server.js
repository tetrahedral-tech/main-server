import { Token, ChainId } from '@uniswap/sdk-core';

export const routerAddress = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';
export const quoterAddress = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6';
export const chainId = import.meta.env.DEV ? ChainId.MAINNET : ChainId.GOERLI;

const addresses = {
	[ChainId.GOERLI]: {
		weth: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
		usdc: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F'
	},
	[ChainId.MAINNET]: {
		weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
		usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
	}
};
export const tokens = {
	weth: new Token(
		chainId,
		addresses[chainId].weth,
		18,
		'WETH',
		'Wrapped Ether'
	),
	usdc: new Token(
		chainId,
		addresses[chainId].usdc,
		6,
		'USDC',
		'USD//C'
	)
};

const countDecimals = x => Math.floor(x) === x ? 0 : x.toString().split('.')[1].length || 0;

export const fromReadableAmount = (amount, decimals) => {
	/* eslint-disable no-param-reassign */
	amount = BigInt(amount);
	decimals = BigInt(decimals);
	/* eslint-enable no-param-reassign */

	const extraDigits = 10n ** countDecimals(amount);
	const adjustedAmount = amount * extraDigits;
	return (adjustedAmount * (10n ** decimals)) / extraDigits;
};

export const toReadableAmount = (rawAmount, decimals) => Number(rawAmount) / (10 ** decimals);
