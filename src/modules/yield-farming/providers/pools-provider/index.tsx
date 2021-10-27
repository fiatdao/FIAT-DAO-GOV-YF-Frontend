import React, { FC, createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import ContractListener from 'web3/components/contract-listener';
import MerkleDistributor from 'web3/merkleDistributor';
import Web3Contract from 'web3/web3Contract';

import {
  BondToken,
  UMAToken,
  MKRToken,
  YFIToken,
  RGTToken,
  wsOHMToken,
  EthFtdSLPToken,
  sOHMFtdSLPToken,

  XyzToken,
  ManaToken,
  SandToken,
  IlvToken,
  AxsToken,
  SushiToken,
  TokenMeta,
  UsdcEntrSLPToken,
  useKnownTokens,
} from 'components/providers/known-tokens-provider';
import config from 'config';
import { useReload } from 'hooks/useReload';
import { YfPoolContract } from 'modules/yield-farming/contracts/yfPool';
import { YfStakingContract } from 'modules/yield-farming/contracts/yfStaking';
import { useWallet } from 'wallets/wallet';

export enum YFPoolID {
  BOND = 'bond',
  UMA = 'uma',
  MKR = 'mkr',
  YFI = 'yfi',
  RGT = 'rgt',
  wsOHM = 'wsOHM',
  ETH_FTD_SLP = 'eth-ftd-slp',
  sOHM_FTD_SLP = 'sOHM-ftd-slp',

  MANA = 'mana',
  XYZ = 'xyz',
  SAND = 'sand',
  SUSHI = 'sushi',
  AXS = 'axs',
  ILV = 'ilv',
  USDC_ENTR_SLP = 'usdc-entr-slp',
}

export type YFPoolMeta = {
  name: YFPoolID;
  label: string;
  icons: string[];
  colors: string[];
  tokens: TokenMeta[];
  contract: YfPoolContract;
};

export const BondYfPool: YFPoolMeta = {
  name: YFPoolID.BOND,
  label: 'BOND',
  icons: ['static/token-bond'],
  colors: ['var(--theme-red-color)'],
  tokens: [BondToken],
  contract: new YfPoolContract(config.contracts.yf.bond),
};

export const UMAYfPool: YFPoolMeta = {
  name: YFPoolID.UMA,
  label: 'UMA',
  icons: ['png/uma'],
  colors: ['var(--theme-red-color)'],
  tokens: [UMAToken],
  contract: new YfPoolContract(config.contracts.yf.uma),
};

export const MKRYfPool: YFPoolMeta = {
  name: YFPoolID.MKR,
  label: 'MKR',
  icons: ['png/mkr'],
  colors: ['var(--theme-red-color)'],
  tokens: [MKRToken],
  contract: new YfPoolContract(config.contracts.yf.mkr),
};

export const YFIYfPool: YFPoolMeta = {
  name: YFPoolID.YFI,
  label: 'YFI',
  icons: ['png/YFI'],
  colors: ['var(--theme-red-color)'],
  tokens: [YFIToken],
  contract: new YfPoolContract(config.contracts.yf.yfi),
};

export const RGTYfPool: YFPoolMeta = {
  name: YFPoolID.RGT,
  label: 'RGT',
  icons: ['png/rgt'],
  colors: ['var(--theme-red-color)'],
  tokens: [RGTToken],
  contract: new YfPoolContract(config.contracts.yf.rgt),
};

export const wsOHMYfPool: YFPoolMeta = {
  name: YFPoolID.wsOHM,
  label: 'wsOHM',
  icons: ['png/wsOHM'],
  colors: ['var(--theme-red-color)'],
  tokens: [wsOHMToken],
  contract: new YfPoolContract(config.contracts.yf.wsOHM),
};

export const EthFtdSLPYfPool: YFPoolMeta = {
  name: YFPoolID.ETH_FTD_SLP,
  label: 'ETH_FTD_SUSHI_LP',
  icons: ['png/eslp'],
  colors: ['var(--theme-red-color)'],
  tokens: [EthFtdSLPToken],
  contract: new YfPoolContract(config.contracts.yf.ethFTDSLP),
};

export const sOHMFtdSLPYfPool: YFPoolMeta = {
  name: YFPoolID.sOHM_FTD_SLP,
  label: 'sOHM_FTD_SUSHI_LP',
  icons: ['png/eslp'],
  colors: ['var(--theme-red-color)'],
  tokens: [sOHMFtdSLPToken],
  contract: new YfPoolContract(config.contracts.yf.sOHMFTDSLP),
};

export const XyzYfPool: YFPoolMeta = {
  name: YFPoolID.XYZ,
  label: 'XYZ',
  icons: ['png/universe'],
  colors: ['var(--theme-red-color)'],
  tokens: [XyzToken],
  contract: new YfPoolContract(config.contracts.yf.xyz),
};

export const ManaYfPool: YFPoolMeta = {
  name: YFPoolID.MANA,
  label: 'MANA',
  icons: ['png/mana'],
  colors: ['var(--theme-red-color)'],
  tokens: [ManaToken],
  contract: new YfPoolContract(config.contracts.yf.mana),
};

export const SandYfPool: YFPoolMeta = {
  name: YFPoolID.SAND,
  label: 'SAND',
  icons: ['png/sandbox'],
  colors: ['var(--theme-red-color)'],
  tokens: [SandToken],
  contract: new YfPoolContract(config.contracts.yf.sand),
};

export const SushiYfPool: YFPoolMeta = {
  name: YFPoolID.SUSHI,
  label: 'SUSHI',
  icons: ['png/sushi'],
  colors: ['var(--theme-red-color)'],
  tokens: [SushiToken],
  contract: new YfPoolContract(config.contracts.yf.sushi),
};

export const AxsYfPool: YFPoolMeta = {
  name: YFPoolID.AXS,
  label: 'AXS',
  icons: ['png/axie'],
  colors: ['var(--theme-red-color)'],
  tokens: [AxsToken],
  contract: new YfPoolContract(config.contracts.yf.axs),
};

export const IlvYfPool: YFPoolMeta = {
  name: YFPoolID.ILV,
  label: 'ILV',
  icons: ['png/ilv'],
  colors: ['var(--theme-red-color)'],
  tokens: [IlvToken],
  contract: new YfPoolContract(config.contracts.yf.ilv),
};

export const UsdcEntrSLPYfPool: YFPoolMeta = {
  name: YFPoolID.USDC_ENTR_SLP,
  label: 'USDC_ENTR_SUSHI_LP',
  icons: ['png/eslp'],
  colors: ['var(--theme-red-color)'],
  tokens: [UsdcEntrSLPToken],
  contract: new YfPoolContract(config.contracts.yf.usdcEntrSLP),
};

const KNOWN_POOLS: YFPoolMeta[] = [
  BondYfPool,
  UMAYfPool,
  MKRYfPool,
  YFIYfPool,
  RGTYfPool,
  wsOHMYfPool,
  EthFtdSLPYfPool,
  sOHMFtdSLPYfPool,

  // XyzYfPool,
  // ManaYfPool,
  // SandYfPool,
  // SushiYfPool,
  // AxsYfPool,
  // IlvYfPool,
  // UsdcEntrSLPYfPool,
];

export function getYFKnownPoolByName(name: string): YFPoolMeta | undefined {
  return KNOWN_POOLS.find(pool => pool.name === name);
}

export type YFPoolsType = {
  yfPools: YFPoolMeta[];
  getYFKnownPoolByName: (name: string) => YFPoolMeta | undefined;
  stakingContract?: YfStakingContract;
  merkleDistributor?: MerkleDistributor;
  getPoolBalanceInUSD: (name: string) => BigNumber | undefined;
  getPoolEffectiveBalanceInUSD: (name: string) => BigNumber | undefined;
  getMyPoolBalanceInUSD: (name: string) => BigNumber | undefined;
  getMyPoolEffectiveBalanceInUSD: (name: string) => BigNumber | undefined;
  getYFTotalStakedInUSD: () => BigNumber | undefined;
  getYFTotalEffectiveStakedInUSD: () => BigNumber | undefined;
  getYFDistributedRewards: () => BigNumber | undefined;
  getYFTotalSupply: () => BigNumber | undefined;
};

const YFPoolsContext = createContext<YFPoolsType>({
  yfPools: KNOWN_POOLS,
  getYFKnownPoolByName: getYFKnownPoolByName,
  stakingContract: undefined,
  merkleDistributor: undefined,
  getPoolBalanceInUSD: () => undefined,
  getPoolEffectiveBalanceInUSD: () => undefined,
  getMyPoolBalanceInUSD: () => undefined,
  getMyPoolEffectiveBalanceInUSD: () => undefined,
  getYFTotalStakedInUSD: () => undefined,
  getYFTotalEffectiveStakedInUSD: () => undefined,
  getYFDistributedRewards: () => undefined,
  getYFTotalSupply: () => undefined,
});

export function useYFPools(): YFPoolsType {
  return useContext(YFPoolsContext);
}

const YFPoolsProvider: FC = props => {
  const { children } = props;

  const knownTokensCtx = useKnownTokens();
  const walletCtx = useWallet();
  const [reload] = useReload();

  const stakingContract = useMemo(() => {
    const staking = new YfStakingContract(config.contracts.yf.staking);
    staking.on(Web3Contract.UPDATE_DATA, reload);

    return staking;
  }, []);

  const merkleDistributor = useMemo(() => {
    const merkleDistributor = new MerkleDistributor([], config.contracts.merkleDistributor);
    merkleDistributor.on(Web3Contract.UPDATE_DATA, reload);

    return merkleDistributor;
  }, []);

  useEffect(() => {
    KNOWN_POOLS.forEach(pool => {
      if (pool.contract.isPoolAvailable) {
        pool.contract.on(Web3Contract.UPDATE_DATA, reload);
        pool.contract.loadCommon().catch(Error);

        pool.tokens.forEach(tokenMeta => {
          if (tokenMeta.address) {
            stakingContract.loadCommonFor(tokenMeta.address).catch(Error);
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    KNOWN_POOLS.forEach(pool => {
      pool.contract.setProvider(walletCtx.provider);
    });

    stakingContract.setProvider(walletCtx.provider);
    merkleDistributor.setProvider(walletCtx.provider);
  }, [walletCtx.provider]);

  useEffect(() => {
    stakingContract.setAccount(walletCtx.account);
    merkleDistributor.setAccount(walletCtx.account);
    merkleDistributor.loadUserData().catch(Error);

    KNOWN_POOLS.forEach(pool => {
      pool.contract.setAccount(walletCtx.account);

      if (walletCtx.isActive) {
        if (pool.contract.isPoolAvailable) {
          pool.contract.loadUserData().catch(Error);

          pool.tokens.forEach(tokenMeta => {
            if (tokenMeta.address) {
              stakingContract.loadUserDataFor(tokenMeta.address).catch(Error);
            }
          });
        }
      }
    });
  }, [walletCtx.account]);

  const getPoolBalanceInUSD = useCallback(
    (poolId: string): BigNumber | undefined => {
      const pool = getYFKnownPoolByName(poolId);

      if (!pool) {
        return undefined;
      }

      if (!pool.contract.isPoolAvailable) {
        return BigNumber.ZERO;
      }

      return BigNumber.sumEach(pool.tokens, token => {
        if (!token.address) {
          return BigNumber.ZERO;
        }

        const stakedToken = stakingContract.stakedTokens.get(token.address);

        if (!stakedToken || stakedToken.nextEpochPoolSize === undefined) {
          return undefined;
        }

        return knownTokensCtx.convertTokenInUSD(stakedToken.nextEpochPoolSize.unscaleBy(token.decimals), token.symbol);
      });
    },
    [stakingContract, knownTokensCtx.version],
  );

  const getPoolEffectiveBalanceInUSD = useCallback(
    (poolId: string): BigNumber | undefined => {
      const pool = getYFKnownPoolByName(poolId);

      if (!pool) {
        return undefined;
      }

      if (!pool.contract.isPoolAvailable) {
        return BigNumber.ZERO;
      }

      return BigNumber.sumEach(pool.tokens, token => {
        if (!token.address) {
          return BigNumber.ZERO;
        }

        const stakedToken = stakingContract.stakedTokens.get(token.address);

        if (!stakedToken || stakedToken.currentEpochPoolSize === undefined) {
          return undefined;
        }

        return knownTokensCtx.convertTokenInUSD(
          stakedToken.currentEpochPoolSize.unscaleBy(token.decimals),
          token.symbol,
        );
      });
    },
    [stakingContract, knownTokensCtx.version],
  );

  const getMyPoolBalanceInUSD = useCallback(
    (poolId: string): BigNumber | undefined => {
      const pool = getYFKnownPoolByName(poolId);

      if (!pool) {
        return undefined;
      }

      if (!pool.contract.isPoolAvailable) {
        return BigNumber.ZERO;
      }

      return BigNumber.sumEach(pool.tokens, token => {
        if (!token.address) {
          return BigNumber.ZERO;
        }

        const stakedToken = stakingContract.stakedTokens.get(token.address);

        if (!stakedToken || stakedToken.nextEpochUserBalance === undefined) {
          return undefined;
        }

        return knownTokensCtx.convertTokenInUSD(
          stakedToken.nextEpochUserBalance.unscaleBy(token.decimals),
          token.symbol,
        );
      });
    },
    [stakingContract, knownTokensCtx.version],
  );

  const getMyPoolEffectiveBalanceInUSD = useCallback(
    (poolId: string): BigNumber | undefined => {
      const pool = getYFKnownPoolByName(poolId);

      if (!pool) {
        return undefined;
      }

      if (!pool.contract.isPoolAvailable) {
        return BigNumber.ZERO;
      }

      return BigNumber.sumEach(pool.tokens, token => {
        if (!token.address) {
          return BigNumber.ZERO;
        }

        const stakedToken = stakingContract.stakedTokens.get(token.address);

        if (!stakedToken || stakedToken.currentEpochUserBalance === undefined) {
          return undefined;
        }

        return knownTokensCtx.convertTokenInUSD(
          stakedToken.currentEpochUserBalance.unscaleBy(token.decimals),
          token.symbol,
        );
      });
    },
    [stakingContract, knownTokensCtx.version],
  );

  const getYFTotalStakedInUSD = useCallback(() => {
    return BigNumber.sumEach(KNOWN_POOLS, yfPool => {
      return getPoolBalanceInUSD(yfPool.name);
    });
  }, [getPoolBalanceInUSD]);

  const getYFTotalEffectiveStakedInUSD = useCallback(() => {
    return BigNumber.sumEach(KNOWN_POOLS, yfPool => {
      return getPoolEffectiveBalanceInUSD(yfPool.name);
    });
  }, [getPoolEffectiveBalanceInUSD]);

  const getYFDistributedRewards = useCallback(() => {
    return BigNumber.sumEach(KNOWN_POOLS, yfPool => {
      if (!yfPool.contract.isPoolAvailable) {
        return BigNumber.ZERO;
      }

      const { distributedReward } = yfPool.contract;

      if (distributedReward === undefined) {
        return undefined;
      }

      return new BigNumber(distributedReward);
    });
  }, []);

  const getYFTotalSupply = useCallback(() => {
    return BigNumber.sumEach(KNOWN_POOLS, yfPool => {
      if (!yfPool.contract.isPoolAvailable) {
        return BigNumber.ZERO;
      }

      const { totalSupply } = yfPool.contract;

      if (totalSupply === undefined) {
        return undefined;
      }

      return new BigNumber(totalSupply);
    });
  }, []);

  const value: YFPoolsType = {
    yfPools: KNOWN_POOLS,
    getYFKnownPoolByName,
    stakingContract,
    merkleDistributor,
    getYFTotalStakedInUSD,
    getYFTotalEffectiveStakedInUSD,
    getPoolBalanceInUSD,
    getPoolEffectiveBalanceInUSD,
    getMyPoolBalanceInUSD,
    getMyPoolEffectiveBalanceInUSD,
    getYFDistributedRewards,
    getYFTotalSupply,
  };

  return (
    <YFPoolsContext.Provider value={value}>
      {children}
      <ContractListener contract={stakingContract} />
      <ContractListener contract={merkleDistributor} />
      <ContractListener contract={BondYfPool.contract} />
      <ContractListener contract={ManaYfPool.contract} />
      <ContractListener contract={XyzYfPool.contract} />
      <ContractListener contract={SandYfPool.contract} />
      <ContractListener contract={SushiYfPool.contract} />
      <ContractListener contract={AxsYfPool.contract} />
      <ContractListener contract={IlvYfPool.contract} />
      <ContractListener contract={UsdcEntrSLPYfPool.contract} />
    </YFPoolsContext.Provider>
  );
};

export default YFPoolsProvider;
