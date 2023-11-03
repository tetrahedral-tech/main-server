import { Wallet } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';

import { addresses, defaultBaseToken } from '$lib/blockchain';
import { providerUrl, repopulateAndSend } from '$lib/blockchain.server';
import { getWorth } from './worth';

const provider = new JsonRpcProvider(providerUrl);

const executeApproval = async (privateKey, { baseAmount, baseToken = defaultBaseToken }) => {
	const wallet = new Wallet(privateKey, provider);
	const address = await wallet.getAddress();
	console.log(`Running approvals for ${address}`);

	const values = await getWorth(address, undefined, baseToken, baseAmount * 5, true);

	const renew = await Promise.all(
		values.map(data => ({
			...data,
			// 1.1 to leave a bit of extra room for error
			renew: data.contract.allowance.staticCall(address, addresses.router) > baseAmount * 1.1
		}))
	);

	const transactions = await Promise.all(
		renew
			.map(data =>
				data.renew ? data.contract.approve.populateTransaction(addresses.router, data.value) : null
			)
			.filter(p => p)
	);

	renew.forEach(async data =>
		data.renew
			? console.log(`Renewing ${await data.contract.getAddress()} for ${baseAmount * 5}`)
			: null
	);

	return Promise.allSettled(
		transactions.map(transaction => repopulateAndSend(wallet, transaction))
	);
};

export default tradeData =>
	Promise.allSettled(
		tradeData.map(({ amount: baseAmount, privateKey }) =>
			executeApproval(privateKey, { baseAmount })
		)
	);
