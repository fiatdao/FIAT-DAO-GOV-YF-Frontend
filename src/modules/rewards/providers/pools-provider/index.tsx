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
  EthFdtSLPToken,
  wsOHMFdtSLPToken,
  gOHMFdtAmphoraSLPToken,
  TokenMeta,
  useKnownTokens,
} from 'components/providers/known-tokens-provider';
import config from 'config';
import { useReload } from 'hooks/useReload';
import { YfPoolContract } from 'modules/rewards/contracts/yfPool';
import { YfStakingContract } from 'modules/rewards/contracts/yfStaking';
import { YfNFTContract } from 'modules/rewards/contracts/yfNFT';
import { YfStakingNFTContract } from 'modules/rewards/contracts/yfStakingNFT';
import { useWallet } from 'wallets/wallet';

export enum YFPoolID {
  BOND = 'bond',
  UMA = 'uma',
  MKR = 'mkr',
  YFI = 'yfi',
  RGT = 'rgt',
  wsOHM = 'wsOHM',
  ETH_FDT_SLP = 'eth-fdt-slp',
  wsOHM_FDT_SLP = 'wsOHM-fdt-slp',
  wsOHM_FDT_SLP_OLD = 'wsOHM-fdt-slp-old',
}

export enum YFPoolNFTID {
  gOHM_FDT_SLP_Amphora = 'gOHM-fdt-slp-amphora',
  gOHM_FDT_SLP_Kithara = 'gOHM-fdt-slp-kithara',
  gOHM_FDT_SLP_Galea = 'gOHM-fdt-slp-galea',
  gOHM_FDT_SLP_Gladius = 'gOHM-fdt-slp-gladius',
  gOHM_FDT_SLP_Corona = 'gOHM-fdt-slp-corona',
}

export type YFPoolMeta = {
  name: YFPoolID | YFPoolNFTID;
  label: string;
  icons: string[];
  colors: string[];
  tokens: TokenMeta[];
  contract: YfPoolContract;
  isNFTPool: boolean;
  nftId?: number;
};

export const BondYfPool: YFPoolMeta = {
  name: YFPoolID.BOND,
  label: 'BOND',
  icons: ['static/token-bond'],
  colors: ['var(--theme-red-color)'],
  tokens: [BondToken],
  isNFTPool: false,
  contract: new YfPoolContract(config.contracts.yf.bond),
};

export const UMAYfPool: YFPoolMeta = {
  name: YFPoolID.UMA,
  label: 'UMA',
  icons: ['png/uma'],
  colors: ['var(--theme-red-color)'],
  tokens: [UMAToken],
  isNFTPool: false,
  contract: new YfPoolContract(config.contracts.yf.uma),
};

export const MKRYfPool: YFPoolMeta = {
  name: YFPoolID.MKR,
  label: 'MKR',
  icons: ['png/mkr'],
  colors: ['var(--theme-red-color)'],
  tokens: [MKRToken],
  isNFTPool: false,
  contract: new YfPoolContract(config.contracts.yf.mkr),
};

export const YFIYfPool: YFPoolMeta = {
  name: YFPoolID.YFI,
  label: 'YFI',
  icons: ['png/YFI'],
  colors: ['var(--theme-red-color)'],
  tokens: [YFIToken],
  isNFTPool: false,
  contract: new YfPoolContract(config.contracts.yf.yfi),
};

export const RGTYfPool: YFPoolMeta = {
  name: YFPoolID.RGT,
  label: 'RGT',
  icons: ['png/rgt'],
  colors: ['var(--theme-red-color)'],
  tokens: [RGTToken],
  isNFTPool: false,
  contract: new YfPoolContract(config.contracts.yf.rgt),
};

export const wsOHMYfPool: YFPoolMeta = {
  name: YFPoolID.wsOHM,
  label: 'wsOHM',
  icons: ['png/wsOHM'],
  colors: ['var(--theme-red-color)'],
  tokens: [wsOHMToken],
  isNFTPool: false,
  contract: new YfPoolContract(config.contracts.yf.wsOHM),
};

export const EthFdtSLPYfPool: YFPoolMeta = {
  name: YFPoolID.ETH_FDT_SLP,
  label: 'ETH_FDT_SUSHI_LP',
  icons: ['png/ETH_FDT_SLP'],
  colors: ['var(--theme-red-color)'],
  tokens: [EthFdtSLPToken],
  isNFTPool: false,
  contract: new YfPoolContract(config.contracts.yf.ethFDTSLP),
};

export const wsOHMFdtSLPYfPool: YFPoolMeta = {
  name: YFPoolID.wsOHM_FDT_SLP,
  label: 'wsOHM_FDT_SUSHI_LP',
  icons: ['png/wsOHM_FDT_SUSHI_LP'],
  colors: ['var(--theme-red-color)'],
  tokens: [wsOHMFdtSLPToken],
  isNFTPool: false,
  contract: new YfPoolContract(config.contracts.yf.wsOHMFDTSLP),
};

export const wsOHMFdtOLDSLPYfPool: YFPoolMeta = {
  name: YFPoolID.wsOHM_FDT_SLP_OLD,
  label: 'wsOHM_FDT_SUSHI_LP_OLD',
  icons: ['png/wsOHM_FDT_SUSHI_LP'],
  colors: ['var(--theme-red-color)'],
  tokens: [wsOHMFdtSLPToken],
  isNFTPool: false,
  contract: new YfPoolContract(config.contracts.yf.wsOHMFDTSLPOld),
};

export const gOHMFdtAmphoraSLPYfPool: YFPoolMeta = {
  name: YFPoolNFTID.gOHM_FDT_SLP_Amphora,
  label: 'gOHM_FDT_SUSHI_LP_Amphora',
  icons: ['png/gohm_fdt_slp_amphora'],
  colors: ['var(--theme-red-color)'],
  tokens: [gOHMFdtAmphoraSLPToken],
  isNFTPool: true,
  nftId: 1,
  contract: new YfPoolContract(config.contracts.yf.gOHMFDTAmphoraSLP),
};

const KNOWN_POOLS: YFPoolMeta[] = [
  BondYfPool,
  UMAYfPool,
  MKRYfPool,
  YFIYfPool,
  RGTYfPool,
  wsOHMYfPool,
  // EthFdtSLPYfPool,
  wsOHMFdtSLPYfPool,
  wsOHMFdtOLDSLPYfPool,
];

const KNOWN_POOLS_NFT: YFPoolMeta[] = [
  gOHMFdtAmphoraSLPYfPool,
];

export function getYFKnownPoolByName(name: string): YFPoolMeta | undefined {
  return [...KNOWN_POOLS, ...KNOWN_POOLS_NFT].find(pool => pool.name === name);
}

export type YFPoolsType = {
  yfPools: YFPoolMeta[];
  yfPoolsNFT: YFPoolMeta[];
  getYFKnownPoolByName: (name: string) => YFPoolMeta | undefined;
  yfNFTContract?: YfNFTContract;
  stakingContract?: YfStakingContract;
  stakingNFTContract?: YfStakingNFTContract;
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
  yfPoolsNFT: KNOWN_POOLS_NFT,
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

  const yfNFTContract = useMemo(() => {
    const yfNFT = new YfNFTContract(config.contracts.yf.yfERC1155);
    yfNFT.on(Web3Contract.UPDATE_DATA, reload);

    return yfNFT;
  }, []);

  const stakingContract = useMemo(() => {
    const staking = new YfStakingContract(config.contracts.yf.staking);
    staking.on(Web3Contract.UPDATE_DATA, reload);

    return staking;
  }, []);

  const stakingNFTContract = useMemo(() => {
    const stakingNFT = new YfStakingNFTContract(config.contracts.yf.stakingNFT);
    stakingNFT.on(Web3Contract.UPDATE_DATA, reload);

    return stakingNFT;
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
    KNOWN_POOLS_NFT.forEach(pool => {
      if (pool.contract.isPoolAvailable) {
        pool.contract.on(Web3Contract.UPDATE_DATA, reload);
        pool.contract.loadCommon().catch(Error);
        const nftId = pool.name === YFPoolNFTID.gOHM_FDT_SLP_Amphora ? 1 : 0;
        pool.tokens.forEach(tokenMeta => {
          if (tokenMeta.address) {
            stakingNFTContract.loadCommonFor(tokenMeta.address, nftId).catch(Error);
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    [...KNOWN_POOLS, ...KNOWN_POOLS_NFT].forEach(pool => {
      pool.contract.setProvider(walletCtx.provider);
    });

    yfNFTContract.setProvider(walletCtx.provider);
    stakingContract.setProvider(walletCtx.provider);
    stakingNFTContract.setProvider(walletCtx.provider);
    merkleDistributor.setProvider(walletCtx.provider);
  }, [walletCtx.provider]);

  useEffect(() => {
    yfNFTContract.setAccount(walletCtx.account);
    stakingContract.setAccount(walletCtx.account);
    stakingNFTContract.setAccount(walletCtx.account);
    merkleDistributor.setAccount(walletCtx.account);
    merkleDistributor.loadUserData().catch(Error);
    yfNFTContract.loadUserDataFor().catch(Error);


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
    KNOWN_POOLS_NFT.forEach(pool => {
      pool.contract.setAccount(walletCtx.account);

      if (walletCtx.isActive) {
        if (pool.contract.isPoolAvailable) {
          pool.contract.loadUserData().catch(Error);
          pool.tokens.forEach(tokenMeta => {
            if (tokenMeta.address) {
              stakingNFTContract.loadUserDataFor(tokenMeta.address, (pool.nftId as number)).catch(Error);
            }
          });
        }
      }
    });
  }, [walletCtx.account]);

  const getPoolBalanceInUSD = useCallback(
    (poolId: string): BigNumber | undefined => {
      const isNFTPool = (Object.values(YFPoolNFTID) as string[]).includes(poolId)
      const currStakingContract = isNFTPool ? stakingNFTContract : stakingContract;
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

        const stakedToken = currStakingContract.stakedTokens.get(token.address);

        if (!stakedToken || stakedToken.nextEpochPoolSize === undefined) {
          return undefined;
        }

        return knownTokensCtx.convertTokenInUSD(stakedToken.nextEpochPoolSize.unscaleBy(token.decimals), token.symbol);
      });
    },
    [stakingContract, stakingNFTContract, knownTokensCtx.version],
  );

  const getPoolEffectiveBalanceInUSD = useCallback(
    (poolId: string): BigNumber | undefined => {
      const pool = getYFKnownPoolByName(poolId);

      const currStakingContract = !!pool?.isNFTPool ? stakingNFTContract : stakingContract;

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

        const stakedToken = currStakingContract.stakedTokens.get(token.address);

        if (!stakedToken || stakedToken.currentEpochPoolSize === undefined) {
          return undefined;
        }

        return knownTokensCtx.convertTokenInUSD(
          stakedToken.currentEpochPoolSize.unscaleBy(token.decimals),
          token.symbol,
        );
      });
    },
    [stakingContract, stakingNFTContract, knownTokensCtx.version],
  );

  const getMyPoolBalanceInUSD = useCallback(
    (poolId: string): BigNumber | undefined => {
      const pool = getYFKnownPoolByName(poolId);

      const currStakingContract = !!pool?.isNFTPool ? stakingNFTContract : stakingContract;

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

        const stakedToken = currStakingContract.stakedTokens.get(token.address);

        if (!stakedToken || stakedToken.nextEpochUserBalance === undefined) {
          return undefined;
        }

        return knownTokensCtx.convertTokenInUSD(
          stakedToken.nextEpochUserBalance.unscaleBy(token.decimals),
          token.symbol,
        );
      });
    },
    [stakingContract, stakingNFTContract, knownTokensCtx.version],
  );

  const getMyPoolEffectiveBalanceInUSD = useCallback(
    (poolId: string): BigNumber | undefined => {
      const pool = getYFKnownPoolByName(poolId);

      const currStakingContract = !!pool?.isNFTPool ? stakingNFTContract : stakingContract;

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

        const stakedToken = currStakingContract.stakedTokens.get(token.address);

        if (!stakedToken || stakedToken.currentEpochUserBalance === undefined) {
          return undefined;
        }

        return knownTokensCtx.convertTokenInUSD(
          stakedToken.currentEpochUserBalance.unscaleBy(token.decimals),
          token.symbol,
        );
      });
    },
    [stakingContract, stakingNFTContract, knownTokensCtx.version],
  );

  const getYFTotalStakedInUSD = useCallback(() => {
    return BigNumber.sumEach([...KNOWN_POOLS, ...KNOWN_POOLS_NFT], yfPool => {
      return getPoolBalanceInUSD(yfPool.name);
    });
  }, [getPoolBalanceInUSD]);

  const getYFTotalEffectiveStakedInUSD = useCallback(() => {
    return BigNumber.sumEach([...KNOWN_POOLS, ...KNOWN_POOLS_NFT], yfPool => {
      return getPoolEffectiveBalanceInUSD(yfPool.name);
    });
  }, [getPoolEffectiveBalanceInUSD]);

  const getYFDistributedRewards = useCallback(() => {
    return BigNumber.sumEach([...KNOWN_POOLS, ...KNOWN_POOLS_NFT], yfPool => {
      if (!yfPool.contract.isPoolAvailable) {
        return BigNumber.ZERO;
      }

      const { distributedReward } = yfPool.contract;

      if (distributedReward === undefined) {
        return undefined;
      }

      console.log('yfPool', yfPool.name);
      console.log('new BigNumber(distributedReward)', new BigNumber(distributedReward).toString());

      return new BigNumber(distributedReward);
    });
  }, []);

  const getYFTotalSupply = useCallback(() => {
    return BigNumber.sumEach([...KNOWN_POOLS, ...KNOWN_POOLS_NFT], yfPool => {
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
    yfPoolsNFT: KNOWN_POOLS_NFT,
    getYFKnownPoolByName,
    yfNFTContract,
    stakingContract,
    stakingNFTContract,
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
      <ContractListener contract={yfNFTContract} />
      <ContractListener contract={stakingContract} />
      <ContractListener contract={stakingNFTContract} />
      <ContractListener contract={merkleDistributor} />
      <ContractListener contract={BondYfPool.contract} />
      <ContractListener contract={UMAYfPool.contract} />
      <ContractListener contract={MKRYfPool.contract} />
      <ContractListener contract={YFIYfPool.contract} />
      <ContractListener contract={RGTYfPool.contract} />
      <ContractListener contract={wsOHMYfPool.contract} />
      <ContractListener contract={EthFdtSLPToken.contract} />
      <ContractListener contract={wsOHMFdtSLPToken.contract} />
    </YFPoolsContext.Provider>
  );
};

export default YFPoolsProvider;
