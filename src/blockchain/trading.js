import { Wallet } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { CurrencyAmount, Percent, TradeType } from '@uniswap/sdk-core';
import { AlphaRouter, SwapType } from '@uniswap/smart-order-router';

import { tokens, fromReadableAmount, addresses, defaultBaseToken } from '$lib/blockchain';
import { providerUrl, repopulateAndSend } from '$lib/blockchain.server';
import { log } from '$lib/logging.server';
import { PUBLIC_CHAINID } from '$env/static/public';

const provider = new JsonRpcProvider(providerUrl);

const router = new AlphaRouter({
	chainId: Number(PUBLIC_CHAINID),
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
	{ baseAmount, baseToken = defaultBaseToken, modToken, action, id }
) => {
	const wallet = new Wallet(privateKey, provider);
	log.debug({ address: await wallet.getAddress() }, 'running trades');

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

	if (!route) throw new Error('No Route');

	return routeTransaction(wallet, route)
		.then(transaction => log.debug({ transaction, id }, 'trading'))
		.catch(error => log.warn({ error, id }, 'trading error'));
};

export default tradeData =>
	Promise.allSettled(
		tradeData.map(({ id, signal: action, amount: baseAmount, privateKey }) =>
			executeTransaction(privateKey, {
				modToken: tokens.wrapped,
				baseAmount,
				action,
				id
			})
		)
	);
