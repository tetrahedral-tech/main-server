import {
	ALGORITHM_SERVER_BASE_URL,
	DB_URI,
	JWT_SECRET,
	PROVIDER_URL
} from '$env/static/private';
import { routerAddress, factoryAddress, tokens } from '$lib/blockchain.server';
import { Bot } from '$lib/models.server';
import { JsonRpcProvider, Wallet, Contract, ethers } from 'ethers';
import { sign } from 'jsonwebtoken';
import { connect } from 'mongoose';
import { createClient } from 'redis';
/* eslint-disable max-len */
import { abi as routerAbi } from '@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json';
import { abi as erc20Abi } from '@uniswap/v3-periphery/artifacts/contracts/interfaces/IERC20Metadata.sol/IERC20Metadata.json';
/* eslint-enable max-len */
import { abi as poolAbi } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { computePoolAddress } from '@uniswap/v3-sdk';
import { Percent, Fraction, CurrencyAmount } from '@uniswap/sdk';
import schedule from 'node-schedule';

// MongoDB, Redis, Web3
connect(DB_URI);
const redis = createClient();

// Trades
const getPrice = sqrtPriceX96 => Number(sqrtPriceX96 ** 2n / 2n ** 192n);

const trade = async botData => {
	const provider = new JsonRpcProvider(PROVIDER_URL);
	const routerContract = new Contract(routerAddress, routerAbi, provider);
	const wethContract = new Contract(tokens.weth.address, erc20Abi, provider);
	const poolContract = new Contract(
		computePoolAddress({
			factoryAddress,
			tokenA: tokens.weth,
			tokenB: tokens.usdc,
			fee: 500
		}),
		poolAbi,
		provider
	);

	const slot = await poolContract.slot0();

	const slippageTolerance = new Percent(20, 10000); // 0.2%
	const slippageAdjustedBase = new Fraction(1).add(slippageTolerance).invert();

	const executeTransaction = async (privateKey, usdAmount) => {
		const wallet = new Wallet(privateKey, provider);
		/* eslint-disable no-undef */
		const price = getPrice(BigInt(slot.sqrtPriceX96));
		const wethAmount = Math.floor(price / (10 ** 12) * usdAmount * (10 ** 18));
		/* eslint-enable no-undef */
		console.log(CurrencyAmount(tokens.usdc, usdAmount));
		const slippageAdjusted = slippageAdjustedBase
			.multiply(CurrencyAmount(tokens.usdc, usdAmount).quotient).quotient;

		await wethContract.connect(wallet).approve(
			routerAddress,
			wethAmount
		);

		console.log(`Approved ${usdAmount}`);

		// https://docs.uniswap.org/contracts/v3/guides/swaps/single-swaps#swap-input-parameters
		// eslint-disable-next-line no-unreachable
		return routerContract.connect(wallet).exactInputSingle({
			tokenIn: tokens.weth.address,
			tokenOut: tokens.usdc.address,
			fee: 500,
			recipient: await wallet.getAddress(),
			deadline: Math.floor(Date.now() / 1000) + (60 * 10),
			amountIn: wethAmount,
			amountOutMinimum: slippageAdjusted,
			sqrtPriceLimitX96: 0
		}, {
			gasLimit: 200000
		});
	};

	return Promise.allSettled(
		botData.map(
			({ strengthToUSD, strength, privateKey }) =>
				executeTransaction(privateKey, strengthToUSD * strength)
		)
	);
};

// Algorithm Check Job
const job = schedule.scheduleJob('*/5 * * * *', async () => {
	console.log('Running algorithm check');
	await redis.connect();

	try {
		const token = sign({ event: 'auth' }, JWT_SECRET, { algorithm: 'HS256' });
		await fetch(`${ALGORITHM_SERVER_BASE_URL}/internal_checker`, {
			headers: {
				Authorization: token
			}
		});

	} catch (err) {
		// return redis.disconnect();
	}

	const signals = await redis.hGetAll('signals');
	const strengths = await redis.hGetAll('strengths');
	const query = await Bot.find({}).populate('algorithm');

	const botData = query.map(bot => {
		const { privateKey, strengthToUSD } = bot;

		const field = bot.algorithm.owner ? bot.algorithm._id : bot.algorithm.name;
		const signal = signals[field];
		const strength = Number(strengths[field]);

		return { privateKey, strengthToUSD, strength, signal };
	});

	console.log(await trade(botData));
	await redis.disconnect();
});

job.invoke();

redis.on('error', err => console.log('Redis Client Error', err));
