import { tokens, addresses, providerUrl } from '$lib/blockchain.server.js';

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

export const defaultBaseToken = tokens.usdc;

const getWorth = async (address, includedTokens = tokens, baseToken = defaultBaseToken) => {
	const contracts = Object.entries(includedTokens)
		// eslint-disable-next-line no-unused-vars
		.filter(([name, token]) => token.address !== baseToken.address)
		.map(([name, token]) =>
			defaultContracts[name]
				? defaultContracts[name]
				: new Contract(token.address, erc20Abi, provider)
		);

	const ethBalance = (await provider.getBalance(address)).toBigInt();

	const worths = await Promise.all(
		contracts.map(async contract => {
			const contractAddress = await contract.getAddress();
			const balance = await contract.balanceOf(address);
			const isWethContract = contractAddress === tokens.weth.address;

			if (balance === 0n && !(isWethContract && ethBalance > 0n)) return 0n;

			return quoterContract.quoteExactInputSingle.staticCall(
				contractAddress,
				baseToken.address,
				500,
				balance + (isWethContract ? ethBalance : 0n),
				0
			);
		})
	);

	return Number(worths.reduce((a, b) => a + b));
};

export default tradeData =>
	Promise.allSettled(
		tradeData.map(async ({ id, privateKey }) => ({
			value: await getWorth(await new Wallet(privateKey, provider).getAddress()),
			id
		}))
	);
