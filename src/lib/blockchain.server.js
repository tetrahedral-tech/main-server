import { INFURA_SECRET } from '$env/static/private';
import Web3 from 'web3';
import { chainNames, selectedChain } from '$lib/blockchain';

export const providerUrl = `https://${chainNames[selectedChain]}.infura.io/v3/${INFURA_SECRET}`;
const deBigNumberify = object => {
	const newObject = Object.assign(object, {});

	// eslint-disable-next-line no-restricted-syntax
	for (const [key, value] of Object.entries(object))
		if (value?._isBigNumber) newObject[key] = BigInt(value._hex) || 0;
	return newObject;
};

const web3 = new Web3(providerUrl);

export const repopulateAndSend = async (wallet, transaction) => {
	/* eslint-disable no-param-reassign */
	transaction = await wallet.populateTransaction(transaction);
	transaction = deBigNumberify(transaction);
	/* eslint-enable no-param-reassign */

	const tx = await wallet.signTransaction(transaction);
	return web3.eth.sendSignedTransaction(tx);
};
