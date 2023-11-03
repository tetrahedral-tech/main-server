import { tokens, addresses, providerUrl, defaultBaseToken } from '$lib/blockchain.server.js';

import { Contract, Wallet } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
// eslint-disable-next-line max-len
import { abi as erc20Abi } from '@uniswap/v3-periphery/artifacts/contracts/interfaces/IERC20Metadata.sol/IERC20Metadata.json';
import { abi as quoterAbi } from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';

const mapObject = (object, fn) =>
	Object.fromEntries(Object.entries(object).map(kv => [kv[0], fn(...kv)]));

const provider = new JsonRpcProvider(providerUrl);
const defaultContracts = mapObject(
	tokens,
	(name, token) => new Contract(token.address, erc20Abi, provider)
);
const quoterContract = new Contract(addresses.quoter, quoterAbi, provider);

export const getWorth = async (
	address,
	includedTokens = tokens,
	baseToken = defaultBaseToken,
	fixedBalance = null,
	full = false
) => {
	const contracts = Object.entries(includedTokens)
		// eslint-disable-next-line no-unused-vars
		.filter(([name, token]) => token.address !== baseToken.address)
		.map(([name, token]) =>
			defaultContracts[name]
				? defaultContracts[name]
				: new Contract(token.address, erc20Abi, provider)
		);

	const ethBalance = fixedBalance ? 0 : (await provider.getBalance(address)).toBigInt();

	const worths = await Promise.all(
		contracts.map(async contract => {
			const contractAddress = await contract.getAddress();
			const balance = fixedBalance ? 0 : await contract.balanceOf(address);
			const isWrappedContract = contractAddress === tokens.wrapped.address;

			if (!fixedBalance && balance === 0n && !(isWrappedContract && ethBalance > 0n)) return 0n;

			return {
				value: quoterContract.quoteExactInputSingle.staticCall(
					contractAddress,
					baseToken.address,
					500,
					fixedBalance ?? balance + (isWrappedContract ? ethBalance : 0n),
					0
				),
				contract
			};
		})
	);

	return full ? worths : worths.map(({ value }) => value).reduce((a, b) => a + b);
};

export default tradeData =>
	Promise.allSettled(
		tradeData.map(async ({ id, privateKey }) => ({
			value: (await getWorth(await new Wallet(privateKey, provider).getAddress())).toString(),
			id
		}))
	);
