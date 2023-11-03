import {
	providerUrl,
	selectedChain,
	tokens,
	fromReadableAmount,
	addresses,
	repopulateAndSend,
	defaultBaseToken
} from '$lib/blockchain.server';

import { Wallet } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { CurrencyAmount, Percent, TradeType } from '@uniswap/sdk-core';
import { AlphaRouter, SwapType } from '@uniswap/smart-order-router';

const provider = new JsonRpcProvider(providerUrl);

const router = new AlphaRouter({
	chainId: selectedChain,
	provider
});

const routeTransaction = async (wallet, route) => {
	const transaction = {
		data: route.methodParameters.calldata,
		value: route.methodParameters.value,
		to: addresses.router,
		from: await wallet.getAddress(),
		gasLimit: 200000
	};

	return repopulateAndSend(wallet, transaction);
};

const executeTransaction = async (
	privateKey,
	{ baseAmount, baseToken = defaultBaseToken, modToken, action }
) => {
	const wallet = new Wallet(privateKey, provider);
	console.log(`Running trades for ${await wallet.getAddress()}`);

	const amount = CurrencyAmount.fromRawAmount(
		baseToken,
		String(fromReadableAmount(baseAmount, baseToken.decimals))
	);

	const route = await router.route(
		amount,
		modToken,
		action === 'sell' ? TradeType.EXACT_OUTPUT : TradeType.EXACT_INPUT,
		{
			recipient: await wallet.getAddress(),
			slippageTolerance: new Percent(20, 10000), // 0.2%
			deadline: Math.floor(Date.now() / 1000) + 60 * 10,
			type: SwapType.SWAP_ROUTER_02
		}
	);

	return routeTransaction(wallet, route);
};

export default tradeData =>
	Promise.allSettled(
		tradeData
			.map(({ signal: action, amount: baseAmount, privateKey }) =>
				action !== 'no_action'
					? executeTransaction(privateKey, {
							modToken: tokens.weth,
							baseAmount,
							action
					  })
					: console.log('No Action')
			)
			.filter(p => p)
	);
