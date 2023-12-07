import webpush from 'web-push';
import { Wallet } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';

import { base } from '$app/paths';
import {
	addresses,
	defaultBaseToken,
	tokens,
	fromReadableAmount,
	toReadableAmount
} from '$lib/blockchain';
import { providerUrl, repopulateAndSend } from '$lib/blockchain.server';
import { User } from '$lib/models.server';
import { setVapidDetails } from '$lib/push.server';
import { getWorth } from './worth';

const provider = new JsonRpcProvider(providerUrl);

setVapidDetails();

const executeOOMNotification = async (id, address) => {
	const user = await User.findOne({});
	if (!user.pushSubscription) return;

	const { pushSubscription } = user;
	return webpush.sendNotification(
		{
			endpoint: pushSubscription.endpoint,
			keys: {
				auth: pushSubscription.auth,
				p256dh: pushSubscription.p256dh
			}
		},
		JSON.stringify({
			title: `Account 0x${address.slice(0, 6)} is out of money!`,
			// eslint-disable-next-line max-len
			body: `Account 0x${address} has went below 0.005 of the Native Currency, Please deposit more to continue trading.`,
			link: `${base}/dashboard/deposit#${address}`
		})
	);
};

export const executeApproval = async (
	privateKey,
	{ id, strengthToUSD, baseToken = defaultBaseToken }
) => {
	const multiplier = 10;
	const wallet = new Wallet(privateKey, provider);
	const address = await wallet.getAddress();

	const approvalAmount = fromReadableAmount(strengthToUSD * multiplier, tokens.usdc.decimals);
	const minimumEth = fromReadableAmount(0.005, tokens.wrapped.decimals);

	const values = await getWorth(null, baseToken, approvalAmount, true);
	const ethBalance = (await provider.getBalance(address)).toBigInt();

	if (ethBalance < minimumEth) {
		await executeOOMNotification(id, address).catch(console.log);
		return [];
	}

	const renew = await Promise.all(
		values.map(async data => ({
			...data,
			renew:
				(await data.contract.allowance(address, addresses.router)) < data.value / BigInt(multiplier)
		}))
	);

	const transactions = await Promise.all(
		renew
			.map(data =>
				data.renew ? data.contract.approve.populateTransaction(addresses.router, data.value) : null
			)
			.filter(p => p)
	);

	renew.forEach(
		async data =>
			data.renew &&
			console.log(
				`Renewing ${await data.contract.getAddress()} for ${toReadableAmount(
					data.value,
					await data.contract.decimals()
				)}`
			)
	);

	return transactions.map(transaction => repopulateAndSend(wallet, transaction));
};
