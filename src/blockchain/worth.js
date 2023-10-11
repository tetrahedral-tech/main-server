import { PROVIDER_URL } from '$env/static/private';
import { tokens, quoterAddress } from '$lib/blockchain.server.js';

import { Contract, Wallet } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
// eslint-disable-next-line max-len
import { abi as erc20Abi } from '@uniswap/v3-periphery/artifacts/contracts/interfaces/IERC20Metadata.sol/IERC20Metadata.json';
import { abi as quoterAbi } from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';

const mapObject = (object, fn) =>
	Object.fromEntries(Object.entries(object).map(kv => [kv[0], fn(...kv)]));

const provider = new JsonRpcProvider(PROVIDER_URL);
const defaultContracts = mapObject(
	tokens,
	(name, token) => new Contract(token.address, erc20Abi, provider)
);
const quoterContract = new Contract(quoterAddress, quoterAbi, provider);

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

	const ethWorth = (await provider.getBalance(address)).toBigInt();

	const worths = await Promise.all(
		contracts.map(async contract => {
			const contractAddress = await contract.getAddress();

			return quoterContract.quoteExactInputSingle.staticCall(
				contractAddress,
				baseToken.address,
				500,
				(await contract.balanceOf(address)) +
					(contractAddress === tokens.weth.address ? ethWorth : 0n),
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
