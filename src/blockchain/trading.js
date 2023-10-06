import { PROVIDER_URL } from '$env/static/private';
import { chainId, routerAddress, tokens, fromReadableAmount } from '$lib/blockchain.server';

import Web3, { TransactionRevertInstructionError } from 'web3';
import { Contract, Wallet } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { CurrencyAmount, Percent, TradeType } from '@uniswap/sdk-core';
import { AlphaRouter, SwapType } from '@uniswap/smart-order-router';

// eslint-disable-next-line max-len
import { abi as erc20Abi } from '@uniswap/v3-periphery/artifacts/contracts/interfaces/IERC20Metadata.sol/IERC20Metadata.json';

const deBigNumberify = object => {
	// eslint-disable-next-line no-restricted-syntax
	for (const [key, value] of Object.entries(object))
		// eslint-disable-next-line no-param-reassign, no-undef
		if (value?._isBigNumber) object[key] = BigInt(value._hex) || 0;
	return object;
};

const web3 = new Web3(PROVIDER_URL);
const provider = new JsonRpcProvider(PROVIDER_URL);

const router = new AlphaRouter({
	chainId,
	provider
});

const repopulateAndSend = async (wallet, transaction) => {
	/* eslint-disable no-param-reassign */
	transaction = await wallet.populateTransaction(transaction);
	transaction = deBigNumberify(transaction);
	/* eslint-enable no-param-reassign */

	const tx = await wallet.signTransaction(transaction);
	return web3.eth.sendSignedTransaction(tx);
};

const approveTransaction = async (wallet, token, amount) => {
	const approvalContract = new Contract(token.address, erc20Abi, provider);

	const transaction = await approvalContract.approve.populateTransaction(
		routerAddress,
		amount
	);

	return repopulateAndSend(wallet, transaction);
};

const routeTransaction = async (wallet, route) => {
	const transaction = {
		data: route.methodParameters.calldata,
		value: route.methodParameters.value,
		to: routerAddress,
		from: await wallet.getAddress(),
		// @TODO fix the gas price
		gasLimit: 200000
	};

	return repopulateAndSend(wallet, transaction);
};

const executeTransaction = async (privateKey, { baseAmount, baseToken = tokens.usdc, modToken, action }) => {
	const wallet = new Wallet(privateKey, provider);
	console.log(`Running trades for ${await wallet.getAddress()}`);

	const amount = CurrencyAmount.fromRawAmount(
		baseToken,
		fromReadableAmount(baseAmount, baseToken.decimals)
	);

	const route = await router.route(
		amount,
		modToken,
		action === 'sell' ? TradeType.EXACT_OUTPUT : TradeType.EXACT_INPUT,
		{
			recipient: await wallet.getAddress(),
			slippageTolerance: new Percent(20, 10000), // 0.2%
			deadline: Math.floor(Date.now() / 1000) + (60 * 10),
			type: SwapType.SWAP_ROUTER_02
		}
	);

	const { inputAmount: tradeInput } = route.trade;
	await approveTransaction(wallet, tradeInput.currency, BigInt(fromReadableAmount(
		tradeInput.toExact(),
		tradeInput.currency.decimals
	)));

	try {
		return routeTransaction(wallet, route);
	} catch (err) {
		if (err instanceof TransactionRevertInstructionError)
			await approveTransaction(wallet, tradeInput.currency, 0n);
		else throw err;
	}
};

export default tradeData => Promise.allSettled(
	tradeData.map(
		({ signal: action, amount: baseAmount, privateKey }) =>
			action !== 'no_action' ? executeTransaction(privateKey, {
				modToken: tokens.weth,
				baseAmount,
				action
			}) : null
	).filter(p => p)
);