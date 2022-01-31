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
import { gOHMFdtAmphoraSLPYfPool } from '../../../modules/rewards/providers/pools-provider';

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
  gOHM = 'gOHM',
  OHM = 'OHM',
  ETH_FDT_SLP = 'ETH_FDT_SLP',
  wsOHM_FDT_SLP = 'wsOHM_FDT_SLP',
  gOHM_FDT_SLP = 'gOHM_FDT_SLP',
  OHM_FDT_SLP = 'OHM_FDT_SLP',
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
  // coinGeckoId: 'fiat-dao-token',
  icon: 'png/fiat-dao' as any,
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

export const OHMToken: TokenMeta = {
  address: config.tokens.OHM,
  symbol: KnownTokens.OHM,
  name: 'OHM',
  decimals: 18,
  icon: 'png/wsOHM',
  coinGeckoId: 'olympus',
  contract: new Erc20Contract([], config.tokens.OHM),
};

export const gOHMToken: TokenMeta = {
  address: config.tokens.gOHM,
  symbol: KnownTokens.gOHM,
  name: 'gOHM',
  decimals: 18,
  icon: 'png/wsOHM',
  coinGeckoId: 'governance-ohm',
  contract: new Erc20Contract([], config.tokens.gOHM),
};

export const EthFdtSLPToken: TokenMeta = {
  address: config.tokens.ethFDTSLP,
  symbol: KnownTokens.ETH_FDT_SLP,
  name: 'ETH FDT SUSHI LP',
  decimals: 18,
  icon: 'png/ETH_FDT_SLP',
  contract: new Erc20Contract([], config.tokens.ethFDTSLP),
};

export const wsOHMFdtSLPToken: TokenMeta = {
  address: config.tokens.wsOHMFDTSLP,
  symbol: KnownTokens.wsOHM_FDT_SLP,
  name: 'sOHM FDT SUSHI LP',
  decimals: 18,
  icon: 'png/wsOHM_FDT_SUSHI_LP',
  contract: new Erc20Contract([], config.tokens.wsOHMFDTSLP),
};

export const gOHMFdtSLPToken: TokenMeta = {
  address: config.tokens.gOHMFDTSLP,
  symbol: KnownTokens.gOHM_FDT_SLP,
  name: 'gOHM FDT SUSHI LP',
  decimals: 18,
  icon: 'png/wsOHM_FDT_SUSHI_LP',
  contract: new Erc20Contract([], config.tokens.gOHMFDTSLP),
};

export const OHMFdtSLPToken: TokenMeta = {
  address: config.tokens.OHMFDTSLP,
  symbol: KnownTokens.OHM_FDT_SLP,
  name: 'OHM FDT UNISWAP LP',
  decimals: 18,
  icon: 'png/wsOHM_FDT_SUSHI_LP',
  contract: new Erc20Contract([], config.tokens.OHMFDTSLP),
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
  gOHMToken,
  OHMToken,
  EthFdtSLPToken,
  wsOHMFdtSLPToken,
  gOHMFdtSLPToken,
  OHMFdtSLPToken,
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

// ToDo: Check the FDT price calculation
async function getFdtPrice(): Promise<BigNumber> {
  const priceFeedContract = new Erc20Contract(LP_PRICE_FEED_ABI, OHMFdtSLPToken.address);

  const [token0, { 0: reserve0, 1: reserve1 }] = await priceFeedContract.batch([
    { method: 'token0' },
    { method: 'getReserves' },
  ]);

  let fdtReserve;
  let OHMReserve;

  if (String(token0).toLowerCase() === FDTToken.address) {
    fdtReserve = new BigNumber(reserve0).unscaleBy(FDTToken.decimals);
    OHMReserve = new BigNumber(reserve1).unscaleBy(OHMToken.decimals);
  } else {
    fdtReserve = new BigNumber(reserve1).unscaleBy(FDTToken.decimals);
    OHMReserve = new BigNumber(reserve0).unscaleBy(OHMToken.decimals);
  }

  if (!OHMReserve || !fdtReserve || fdtReserve.eq(BigNumber.ZERO)) {
    return BigNumber.ZERO;
  }

  OHMReserve = (OHMReserve as BigNumber).times(OHMToken?.price as BigNumber)

  return OHMReserve.dividedBy(fdtReserve);
}

// ToDo: Check the SLP price calculation
async function getWSOHMFdtSLPPrice(): Promise<BigNumber> {
  const priceFeedContract = new Erc20Contract(LP_PRICE_FEED_ABI, wsOHMFdtSLPToken.address);

  const [decimals, totalSupply, token0, { 0: reserve0, 1: reserve1 }] = await priceFeedContract.batch([
    { method: 'decimals', transform: Number },
    { method: 'totalSupply', transform: value => new BigNumber(value) },
    { method: 'token0' },
    { method: 'getReserves' },
  ]);

  let wsOHMReserve;

  if (String(token0).toLowerCase() === FDTToken.address) {
    wsOHMReserve = new BigNumber(reserve1).unscaleBy(wsOHMToken.decimals);
  } else {
    wsOHMReserve = new BigNumber(reserve0).unscaleBy(wsOHMToken.decimals);
  }

  wsOHMReserve = (wsOHMReserve as BigNumber).times(wsOHMToken?.price as BigNumber)

  const supply = totalSupply.unscaleBy(decimals);

  if (!wsOHMReserve || !supply || supply.eq(BigNumber.ZERO)) {
    return BigNumber.ZERO;
  }

  return wsOHMReserve.div(supply).times(2);
}

async function getGOHMFdtSLPTokenPrice(): Promise<BigNumber> {
  const priceFeedContract = new Erc20Contract(LP_PRICE_FEED_ABI, gOHMFdtSLPToken.address);

  const [decimals, totalSupply, token0, { 0: reserve0, 1: reserve1 }] = await priceFeedContract.batch([
    { method: 'decimals', transform: Number },
    { method: 'totalSupply', transform: value => new BigNumber(value) },
    { method: 'token0' },
    { method: 'getReserves' },
  ]);

  let gOHMAmphoraReserve;

  if (String(token0).toLowerCase() === FDTToken.address) {
    gOHMAmphoraReserve = new BigNumber(reserve1).unscaleBy(gOHMToken.decimals);
  } else {
    gOHMAmphoraReserve = new BigNumber(reserve0).unscaleBy(gOHMToken.decimals);
  }

  gOHMAmphoraReserve = (gOHMAmphoraReserve as BigNumber).times(gOHMToken?.price as BigNumber)

  const supply = totalSupply.unscaleBy(decimals);

  if (!gOHMAmphoraReserve || !supply || supply.eq(BigNumber.ZERO)) {
    return BigNumber.ZERO;
  }

  return gOHMAmphoraReserve.div(supply).times(2);
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
        });

        FDTToken.price = await getFdtPrice().catch(() => undefined);
        // EthFdtSLPToken.price = await getEthFdtSLPPrice().catch(() => undefined);
        wsOHMFdtSLPToken.price = await getWSOHMFdtSLPPrice().catch(() => undefined);
        gOHMFdtSLPToken.price = await getGOHMFdtSLPTokenPrice().catch(() => undefined);


        KNOWN_TOKENS.forEach(token => {
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

    // load fdt balance for connected wallet
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
