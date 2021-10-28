import React, { FC, createContext, useContext, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { AbiItem } from 'web3-utils';
import Erc20Contract from 'web3/erc20Contract';
import { formatUSD } from 'web3/utils';
import Web3Contract, { createAbiItem } from 'web3/web3Contract';

import { TokenIconNames } from 'components/custom/icon';
import config from 'config';
import { useReload } from 'hooks/useReload';
import { useWallet } from 'wallets/wallet';

export enum KnownTokens {
  FDT = 'FDT',
  ETH = 'ETH',
  USDC = 'USDC',
  BOND = 'BOND',
  UMA = 'UMA',
  MKR = 'MKR',
  YFI = 'YFI',
  RGT = 'RGT',
  wsOHM = 'wsOHM',
  ETH_FDT_SLP = 'ETH_FDT_SLP',
  sOHM_FDT_SLP = 'sOHM_FDT_SLP',
}

export type TokenMeta = {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  icon?: TokenIconNames;
  coinGeckoId?: string;
  contract?: Web3Contract;
  price?: BigNumber;
};

export const FDTToken: TokenMeta = {
  address: config.tokens.fdt,
  symbol: KnownTokens.FDT,
  name: 'FDT Token',
  decimals: 18,
  icon: 'static/fiat-dao' as any,
  contract: new Erc20Contract([], config.tokens.fdt),
};

export const EthToken: TokenMeta = {
  symbol: KnownTokens.ETH,
  name: 'Ether',
  address: '0x',
  decimals: 18,
  icon: 'token-eth',
  coinGeckoId: 'ethereum',
};

export const UsdcToken: TokenMeta = {
  address: config.tokens.usdc,
  symbol: KnownTokens.USDC,
  name: 'USD Coin',
  decimals: 6,
  icon: 'token-usdc',
  coinGeckoId: 'usd-coin',
  contract: new Erc20Contract([], config.tokens.usdc),
};

export const BondToken: TokenMeta = {
  address: config.tokens.bond,
  symbol: KnownTokens.BOND,
  name: 'BarnBridge',
  decimals: 18,
  icon: 'static/token-bond',
  coinGeckoId: 'barnbridge',
  contract: new Erc20Contract([], config.tokens.bond),
};

export const UMAToken: TokenMeta = {
  address: config.tokens.uma,
  symbol: KnownTokens.UMA,
  name: 'UMA',
  decimals: 18,
  icon: 'png/uma',
  coinGeckoId: 'uma',
  contract: new Erc20Contract([], config.tokens.uma),
};

export const MKRToken: TokenMeta = {
  address: config.tokens.mkr,
  symbol: KnownTokens.MKR,
  name: 'MKR',
  decimals: 18,
  icon: 'png/mkr',
  coinGeckoId: 'maker',
  contract: new Erc20Contract([], config.tokens.mkr),
};


export const YFIToken: TokenMeta = {
  address: config.tokens.yfi,
  symbol: KnownTokens.YFI,
  name: 'YFI',
  decimals: 18,
  icon: 'png/YFI',
  coinGeckoId: 'yearn-finance',
  contract: new Erc20Contract([], config.tokens.yfi),
};

export const RGTToken: TokenMeta = {
  address: config.tokens.rgt,
  symbol: KnownTokens.RGT,
  name: 'RGT',
  decimals: 18,
  icon: 'png/rgt',
  coinGeckoId: 'rari-governance-token',
  contract: new Erc20Contract([], config.tokens.rgt),
};

export const wsOHMToken: TokenMeta = {
  address: config.tokens.wsOHM,
  symbol: KnownTokens.wsOHM,
  name: 'wsOHM',
  decimals: 18,
  icon: 'png/wsOHM',
  coinGeckoId: 'wrapped-staked-olympus',
  contract: new Erc20Contract([], config.tokens.wsOHM),
};

export const EthFdtSLPToken: TokenMeta = {
  address: config.tokens.ethFDTSLP,
  symbol: KnownTokens.ETH_FDT_SLP,
  name: 'ETH FDT SUSHI LP',
  decimals: 18,
  icon: 'png/eslp',
  contract: new Erc20Contract([], config.tokens.ethFDTSLP),
};

export const sOHMFdtSLPToken: TokenMeta = {
  address: config.tokens.sOHMFDTSLP,
  symbol: KnownTokens.sOHM_FDT_SLP,
  name: 'sOHM FDT SUSHI LP',
  decimals: 18,
  icon: 'png/eslp',
  contract: new Erc20Contract([], config.tokens.sOHMFDTSLP),
};

const KNOWN_TOKENS: TokenMeta[] = [
  FDTToken,
  EthToken,
  UsdcToken,
  BondToken,
  UMAToken,
  MKRToken,
  YFIToken,
  RGTToken,
  wsOHMToken,
  EthFdtSLPToken,
  sOHMFdtSLPToken,
];

(window as any).KNOWN_TOKENS = KNOWN_TOKENS;

export function getKnownTokens(): TokenMeta[] {
  return [...KNOWN_TOKENS];
}

type ContextType = {
  tokens: TokenMeta[];
  version: number;
  getTokenBySymbol(symbol: string): TokenMeta | undefined;
  getTokenByAddress(address: string): TokenMeta | undefined;
  getTokenPriceIn(source: string, target: string): BigNumber | undefined;
  convertTokenIn(amount: BigNumber | undefined, source: string, target: string): BigNumber | undefined;
  convertTokenInUSD(amount: BigNumber | undefined, source: string): BigNumber | undefined;
};

const Context = createContext<ContextType>({
  tokens: [...KNOWN_TOKENS],
  version: 0,
  getTokenBySymbol: () => undefined,
  getTokenByAddress: () => undefined,
  getTokenPriceIn: () => undefined,
  convertTokenIn: () => undefined,
  convertTokenInUSD: () => undefined,
});

export function useKnownTokens(): ContextType {
  return useContext<ContextType>(Context);
}

export function getTokenBySymbol(symbol: string): TokenMeta | undefined {
  return KNOWN_TOKENS.find(token => token.symbol === symbol);
}

export function getTokenByAddress(address: string): TokenMeta | undefined {
  return KNOWN_TOKENS.find(token => token.address.toLowerCase() === address.toLowerCase());
}

const LP_PRICE_FEED_ABI: AbiItem[] = [
  createAbiItem('decimals', [], ['int8']),
  createAbiItem('totalSupply', [], ['uint256']),
  createAbiItem('getReserves', [], ['uint112', 'uint112']),
  createAbiItem('token0', [], ['address']),
];

// ToDo: Check the ENTR price calculation
async function getFdtPrice(): Promise<BigNumber> {
  const priceFeedContract = new Erc20Contract(LP_PRICE_FEED_ABI, EthFdtSLPToken.address);

  const [token0, { 0: reserve0, 1: reserve1 }] = await priceFeedContract.batch([
    { method: 'token0' },
    { method: 'getReserves' },
  ]);

  let entrReserve;
  let usdcReserve;

  if (String(token0).toLowerCase() === FDTToken.address) {
    entrReserve = new BigNumber(reserve0).unscaleBy(FDTToken.decimals);
    usdcReserve = new BigNumber(reserve1).unscaleBy(UsdcToken.decimals);
  } else {
    entrReserve = new BigNumber(reserve1).unscaleBy(FDTToken.decimals);
    usdcReserve = new BigNumber(reserve0).unscaleBy(UsdcToken.decimals);
  }

  if (!usdcReserve || !entrReserve || entrReserve.eq(BigNumber.ZERO)) {
    return BigNumber.ZERO;
  }

  return usdcReserve.dividedBy(entrReserve);
}

// ToDo: Check the SLP price calculation
async function getEthFdtSLPPrice(): Promise<BigNumber> {
  const priceFeedContract = new Erc20Contract(LP_PRICE_FEED_ABI, EthFdtSLPToken.address);

  const [decimals, totalSupply, token0, { 0: reserve0, 1: reserve1 }] = await priceFeedContract.batch([
    { method: 'decimals', transform: Number },
    { method: 'totalSupply', transform: value => new BigNumber(value) },
    { method: 'token0' },
    { method: 'getReserves' },
  ]);

  let usdcReserve;

  if (String(token0).toLowerCase() === FDTToken.address) {
    usdcReserve = new BigNumber(reserve1).unscaleBy(UsdcToken.decimals);
  } else {
    usdcReserve = new BigNumber(reserve0).unscaleBy(UsdcToken.decimals);
  }

  const supply = totalSupply.unscaleBy(decimals);

  if (!usdcReserve || !supply || supply.eq(BigNumber.ZERO)) {
    return BigNumber.ZERO;
  }

  return usdcReserve.dividedBy(supply).multipliedBy(2);
}

// ToDo: Check the SLP price calculation
async function getSOHMFdtSLPPrice(): Promise<BigNumber> {
  const priceFeedContract = new Erc20Contract(LP_PRICE_FEED_ABI, sOHMFdtSLPToken.address);

  const [decimals, totalSupply, token0, { 0: reserve0, 1: reserve1 }] = await priceFeedContract.batch([
    { method: 'decimals', transform: Number },
    { method: 'totalSupply', transform: value => new BigNumber(value) },
    { method: 'token0' },
    { method: 'getReserves' },
  ]);

  let usdcReserve;

  if (String(token0).toLowerCase() === FDTToken.address) {
    usdcReserve = new BigNumber(reserve1).unscaleBy(UsdcToken.decimals);
  } else {
    usdcReserve = new BigNumber(reserve0).unscaleBy(UsdcToken.decimals);
  }

  const supply = totalSupply.unscaleBy(decimals);

  if (!usdcReserve || !supply || supply.eq(BigNumber.ZERO)) {
    return BigNumber.ZERO;
  }

  return usdcReserve.dividedBy(supply).multipliedBy(2);
}

export function getTokenPrice(symbol: string): BigNumber | undefined {
  return getTokenBySymbol(symbol)?.price;
}

export function getTokenPriceIn(source: string, target: string): BigNumber | undefined {
  const sourcePrice = getTokenPrice(source);
  const targetPrice = getTokenPrice(target);

  if (!sourcePrice || !targetPrice) {
    return undefined;
  }

  return sourcePrice.dividedBy(targetPrice);
}

export function convertTokenIn(
  amount: BigNumber | number | undefined,
  source: string,
  target: string,
): BigNumber | undefined {
  if (amount === undefined || amount === null) {
    return undefined;
  }

  if (amount === 0 || BigNumber.ZERO.eq(amount)) {
    return BigNumber.ZERO;
  }

  const bnAmount = new BigNumber(amount);

  if (bnAmount.isNaN()) {
    return undefined;
  }

  if (source === target) {
    return bnAmount;
  }

  const price = getTokenPriceIn(source, target);

  if (!price) {
    return undefined;
  }

  return bnAmount.multipliedBy(price);
}

export function convertTokenInUSD(amount: BigNumber | number | undefined, source: string): BigNumber | undefined {
  return convertTokenIn(amount, source, KnownTokens.USDC);
}

const KnownTokensProvider: FC = props => {
  const { children } = props;

  const wallet = useWallet();
  const [reload, version] = useReload();

  useEffect(() => {
    (FDTToken.contract as Erc20Contract).loadCommon().catch(Error);

    (async () => {
      FDTToken.price = await getFdtPrice().catch(() => undefined);
      EthFdtSLPToken.price = await getEthFdtSLPPrice().catch(() => undefined);
      sOHMFdtSLPToken.price = await getSOHMFdtSLPPrice().catch(() => undefined);

      const ids = KNOWN_TOKENS.map(tk => tk.coinGeckoId)
        .filter(Boolean)
        .join(',');

      try {
        const prices = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
        ).then(res => res.json());

        KNOWN_TOKENS.forEach(token => {
          if (token.coinGeckoId) {
            const price = prices[token.coinGeckoId]?.usd;

            if (price) {
              token.price = new BigNumber(price);
            }
          }

          console.log(`[Token Price] ${token.symbol} = ${formatUSD(token.price)}`);
        });
      } catch {}

      reload();
    })();
  }, []);

  useEffect(() => {
    KNOWN_TOKENS.forEach(token => {
      token.contract?.setProvider(wallet.provider);
    });
  }, [wallet.provider]);

  useEffect(() => {
    KNOWN_TOKENS.forEach(token => {
      token.contract?.setAccount(wallet.account);
    });

    // load entr balance for connected wallet
    if (wallet.account) {
      (FDTToken.contract as Erc20Contract).loadBalance().then(reload).catch(Error);
    }
  }, [wallet.account]);

  const value = {
    tokens: [...KNOWN_TOKENS],
    version,
    getTokenBySymbol,
    getTokenByAddress,
    getTokenPriceIn,
    convertTokenIn,
    convertTokenInUSD,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default KnownTokensProvider;
