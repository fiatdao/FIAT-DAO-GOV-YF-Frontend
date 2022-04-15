import React from 'react';
import BigNumber from 'bignumber.js';
import { ZERO_BIG_NUMBER, getHumanValue, formatBigValue } from 'web3/utils';
import Web3Contract, { Web3ContractAbiItem } from 'web3/web3Contract';

import { FDTToken } from 'components/providers/known-tokens-provider';
import config from 'config';
import { useReload } from 'hooks/useReload';
import { useWallet } from 'wallets/wallet';

import DAO_REWARD_ABI from './daoReward.json';

export type DaoRewardPullFeature = {
  source: string;
  startTs: number;
  endTs: number;
  totalDuration: number;
  totalAmount: BigNumber;
};

export enum RewardsID {
  First = 'first',
  Second = 'second',
}

export type RewardsMeta = {
  name: RewardsID;
  label: string;
  contract: Web3Contract;
  claimSend: (from: string) => Promise<void>;
  getFDTRewards(): BigNumber | undefined;
  claimValue?: BigNumber;
  poolFeature?: DaoRewardPullFeature;
};

export const ContractFirst: RewardsMeta = {
  name: RewardsID.First,
  label: 'Reward contract 1',
  contract: new Web3Contract(DAO_REWARD_ABI as Web3ContractAbiItem[], config.contracts.dao.rewardFirst, 'Reward contract 1'),
  claimSend: async(from: string): Promise<void> => {
    return ContractFirst.contract.send('claim', [], {
      from,
    });
  },
  getFDTRewards:(): BigNumber | undefined => {
    if (!ContractFirst.poolFeature) {
      return undefined;
    }

    const { startTs, endTs, totalDuration, totalAmount } = ContractFirst.poolFeature;
    const now = Date.now() / 1_000;

    if (startTs > now) {
      return ZERO_BIG_NUMBER;
    }

    if (endTs <= now) {
      return totalAmount;
    }

    return totalAmount.multipliedBy(now - startTs).div(totalDuration);
  }
};

export const ContractSecond: RewardsMeta = {
  name: RewardsID.Second,
  label: 'Reward contract 2',
  contract:  new Web3Contract(DAO_REWARD_ABI as Web3ContractAbiItem[], config.contracts.dao.rewardSecond, 'Reward contract 2'),
  claimSend: async (from: string): Promise<void> => {
    return ContractSecond.contract.send('claim', [], {
      from,
    });
  },
  getFDTRewards:(): BigNumber | undefined => {
    if (!ContractSecond.poolFeature) {
      return undefined;
    }

    const { startTs, endTs, totalDuration, totalAmount } = ContractSecond.poolFeature;
    const now = Date.now() / 1_000;

    if (startTs > now) {
      return ZERO_BIG_NUMBER;
    }

    if (endTs <= now) {
      return totalAmount;
    }

    return totalAmount.multipliedBy(now - startTs).div(totalDuration);
  }
};

async function loadCommonData(): Promise<any> {

  const queryPoolFeature = [
    {
      method: 'pullFeature',
      transform: (value: DaoRewardPullFeature) => ({
        ...value,
        totalAmount: getHumanValue(new BigNumber(value.totalAmount), FDTToken.decimals),
      }),
    },
  ]


  const [firstPoolFeature] = await ContractFirst.contract.batch(queryPoolFeature)
  const [secondPoolFeature] = await ContractSecond.contract.batch(queryPoolFeature)

  ContractFirst.poolFeature = firstPoolFeature
  ContractSecond.poolFeature = secondPoolFeature
}

async function loadUserData(userAddress?: string): Promise<any> {
  if (!userAddress) {
    return Promise.reject();
  }

  const queryClaimValue = [
    {
      method: 'claim',
      callArgs: {
        from: userAddress,
      },
      transform: (value: string) => getHumanValue(new BigNumber(value), FDTToken.decimals),
      onError: () => ZERO_BIG_NUMBER,
    },
  ]

  const [ firstClaimValue ] = await ContractFirst.contract.batch(queryClaimValue);
  const [ secondClaimValue ] = await ContractSecond.contract.batch(queryClaimValue);


  ContractFirst.claimValue = firstClaimValue
  ContractSecond.claimValue = secondClaimValue
}

export type DAORewardContractData = {
  rewards: RewardsMeta[];
};

const KNOWN_REWARDS: RewardsMeta[] = [
  ContractFirst,
  // ContractSecond,
];

export type DAORewardContract = DAORewardContractData & {
  reload(): void;
  getLastReward(): RewardsMeta
  getAllFDTRewards(): BigNumber | undefined;
  getAllTotalAmount(): BigNumber | undefined;
  getAllClaimValue(): BigNumber | undefined;
};

export function useDAORewardContract(): DAORewardContract {
  const wallet = useWallet();

  const [reload] = useReload();

  React.useEffect(() => {
    loadCommonData().then(reload).catch(Error);
  }, []);

  React.useEffect(() => {
    loadUserData(wallet.account).then(reload).catch(Error);
  }, [wallet.account]);

  function getAllFDTRewards(): BigNumber | undefined {
    if (!ContractFirst.poolFeature && !ContractSecond.poolFeature) {
      return undefined;
    }

    return  BigNumber.sumEach(KNOWN_REWARDS, contract => {
      return contract.getFDTRewards()
    })
  }

  function getAllTotalAmount(): BigNumber | undefined {
    if (!ContractFirst.poolFeature && !ContractSecond.poolFeature) {
      return undefined;
    }

    return  BigNumber.sumEach(KNOWN_REWARDS, contract => {
      return contract.poolFeature?.totalAmount
    })
  }

  function getAllClaimValue(): BigNumber | undefined {
    if (!ContractFirst.claimValue && !ContractSecond.claimValue) {
      return undefined;
    }

    return  BigNumber.sumEach(KNOWN_REWARDS, contract => {
      return contract.claimValue
    })
  }

  function getLastReward(): RewardsMeta {
    return KNOWN_REWARDS[KNOWN_REWARDS.length - 1]
  }

  return {
    reload,
    rewards: KNOWN_REWARDS,
    getLastReward,
    getAllFDTRewards,
    getAllTotalAmount,
    getAllClaimValue,
  };
}
