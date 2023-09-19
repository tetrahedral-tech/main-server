import { Token, ChainId } from '@uniswap/sdk';

export const routerAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564';
export const factoryAddress = '0x1F98431c8aD98523631AE4a59f267346ea31F984';

export const tokens = {
	weth: new Token(
		ChainId.GÖRLI,
		'0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
		18,
		'WETH',
		'Wrapped Ether'
	),
	usdc: new Token(
		ChainId.GÖRLI,
		'0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
		18,
		'USDC',
		'USDC Token'
	)
	// weth: new Token(
	// 	ChainId.MAINNET,
	// 	'0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
	// 	18,
	// 	'WETH',
	// 	'Wrapped Ether'
	// ),
	// usdc: new Token(
	// 	ChainId.MAINNET,
	// 	'0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
	// 	18,
	// 	'USDC',
	// 	'USDC Token'
	// )
};
