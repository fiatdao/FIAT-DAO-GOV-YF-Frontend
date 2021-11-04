import React from 'react';
import BigNumber from 'bignumber.js';
import { getGasValue, getHumanValue, getNonHumanValue } from 'web3/utils';
import Web3Contract, { Web3ContractAbiItem } from 'web3/web3Contract';

import { FDTToken } from 'components/providers/known-tokens-provider';
import config from 'config';
import useMergeState from 'hooks/useMergeState';
import { useReload } from 'hooks/useReload';
import { useWallet } from 'wallets/wallet';

import DAO_COMITIUM_ABI from './daoComitium.json';

import { getNowTs } from 'utils';

const Contract = new Web3Contract(DAO_COMITIUM_ABI as Web3ContractAbiItem[], config.contracts.dao.comitium, 'Community');

function loadCommonData(): Promise<any> {
  return Contract.batch([
    {
      method: 'fdtStaked',
      transform: (value: string) => getHumanValue(new BigNumber(value), FDTToken.decimals),
    },
  ]).then(([fdtStaked]) => {
    return {
      fdtStaked,
    };
  });
}

function loadUserData(userAddress?: string): Promise<any> {
  if (!userAddress) {
    return Promise.reject();
  }

  return Contract.batch([
    {
      method: 'balanceOf',
      methodArgs: [userAddress],
      transform: (value: string) => getHumanValue(new BigNumber(value), FDTToken.decimals),
    },
    {
      method: 'votingPower',
      methodArgs: [userAddress],
      transform: (value: string) => getHumanValue(new BigNumber(value), FDTToken.decimals),
    },
    {
      method: 'multiplierAtTs',
      methodArgs: [userAddress, getNowTs()],
      transform: (value: string) => getHumanValue(new BigNumber(value), FDTToken.decimals)?.toNumber(),
    },
    {
      method: 'userLockedUntil',
      methodArgs: [userAddress],
      transform: (value: string) => Number(value) * 1_000,
    },
    {
      method: 'delegatedPower',
      methodArgs: [userAddress],
      transform: (value: string) => getHumanValue(new BigNumber(value), FDTToken.decimals),
    },
    {
      method: 'userDelegatedTo',
      methodArgs: [userAddress],
    },
  ]).then(([balance, votingPower, multiplier, userLockedUntil, delegatedPower, userDelegatedTo]) => ({
    balance,
    votingPower,
    multiplier,
    userLockedUntil,
    delegatedPower,
    userDelegatedTo,
  }));
}

function fdtStakedAtTsCall(timestamp: number): Promise<BigNumber | undefined> {
  return Contract.call('fdtStakedAtTs', [timestamp], {}).then((value: string) =>
    getHumanValue(new BigNumber(value), FDTToken.decimals),
  );
}

function votingPowerCall(address: string): Promise<BigNumber | undefined> {
  return Contract.call('votingPower', [address], {}).then((value: string) => getHumanValue(new BigNumber(value), 18));
}

function votingPowerAtTsCall(address: string, timestamp: number): Promise<BigNumber | undefined> {
  return Contract.call('votingPowerAtTs', [address, timestamp], {}).then((value: string) =>
    getHumanValue(new BigNumber(value), 18),
  );
}

function depositSend(amount: BigNumber, from: string, gasPrice: number): Promise<void> {
  return Contract.send('deposit', [getNonHumanValue(amount, 18)], {
    from,
    gasPrice: getGasValue(gasPrice),
  });
}

function withdrawSend(amount: BigNumber, from: string, gasPrice: number): Promise<void> {
  return Contract.send('withdraw', [getNonHumanValue(amount, 18)], {
    from,
    gasPrice: getGasValue(gasPrice),
  });
}

function delegateSend(to: string, from: string, gasPrice: number): Promise<void> {
  return Contract.send('delegate', [to], {
    from,
    gasPrice: getGasValue(gasPrice),
  });
}

function stopDelegateSend(from: string, gasPrice: number): Promise<void> {
  return Contract.send('stopDelegate', [], {
    from,
    gasPrice: getGasValue(gasPrice),
  });
}

function lockSend(timestamp: number, from: string, gasPrice: number): Promise<void> {
  return Contract.send('lock', [timestamp], {
    from,
    gasPrice: getGasValue(gasPrice),
  });
}

export type DAOComitiumContractData = {
  contract: Web3Contract;
  activationThreshold?: BigNumber;
  fdtStaked?: BigNumber;
  balance?: BigNumber;
  votingPower?: BigNumber;
  multiplier?: number;
  userLockedUntil?: number;
  delegatedPower?: BigNumber;
  userDelegatedTo?: string;
};

const InitialState: DAOComitiumContractData = {
  contract: Contract,
  activationThreshold: new BigNumber(config.dao.activationThreshold),
  fdtStaked: undefined,
  balance: undefined,
  votingPower: undefined,
  multiplier: undefined,
  userLockedUntil: undefined,
  delegatedPower: undefined,
  userDelegatedTo: undefined,
};

export type DAOComitiumContract = DAOComitiumContractData & {
  reload(): void;
  actions: {
    fdtStakedAtTs(timestamp: number): Promise<BigNumber | undefined>;
    votingPower(address: string): Promise<BigNumber | undefined>;
    votingPowerAtTs(timestamp: number): Promise<BigNumber | undefined>;
    deposit(amount: BigNumber, gasPrice: number): Promise<any>;
    withdraw(amount: BigNumber, gasPrice: number): Promise<any>;
    delegate(to: string, gasPrice: number): Promise<any>;
    stopDelegate(gasPrice: number): Promise<any>;
    lock(timestamp: number, gasPrice: number): Promise<any>;
  };
};

export function useDAOComitiumContract(): DAOComitiumContract {
  const wallet = useWallet();

  const [state, setState] = useMergeState<DAOComitiumContractData>(InitialState);
  const [reload, version] = useReload();

  React.useEffect(() => {
    setState({
      fdtStaked: undefined,
    });

    loadCommonData().then(setState).catch(Error);
  }, [version, setState]);

  React.useEffect(() => {
    setState({
      balance: undefined,
      votingPower: undefined,
      multiplier: undefined,
      userLockedUntil: undefined,
      delegatedPower: undefined,
      userDelegatedTo: undefined,
    });

    loadUserData(wallet.account).then(setState).catch(Error);
  }, [wallet.account, version, setState]);

  return {
    ...state,
    reload,
    actions: {
      fdtStakedAtTs(timestamp: number): Promise<BigNumber | undefined> {
        return fdtStakedAtTsCall(timestamp);
      },
      votingPower(address: string): Promise<BigNumber | undefined> {
        return votingPowerCall(address);
      },
      votingPowerAtTs(timestamp: number): Promise<BigNumber | undefined> {
        return wallet.isActive ? votingPowerAtTsCall(wallet.account!, timestamp) : Promise.reject();
      },
      deposit(amount: BigNumber, gasPrice: number): Promise<void> {
        return wallet.isActive ? depositSend(amount, wallet.account!, gasPrice) : Promise.reject();
      },
      withdraw(amount: BigNumber, gasPrice: number): Promise<void> {
        return wallet.isActive ? withdrawSend(amount, wallet.account!, gasPrice) : Promise.reject();
      },
      delegate(to: string, gasPrice: number): Promise<void> {
        return wallet.isActive ? delegateSend(to, wallet.account!, gasPrice) : Promise.reject();
      },
      stopDelegate(gasPrice: number): Promise<void> {
        return wallet.isActive ? stopDelegateSend(wallet.account!, gasPrice) : Promise.reject();
      },
      lock(timestamp: number, gasPrice: number): Promise<void> {
        return wallet.isActive ? lockSend(timestamp, wallet.account!, gasPrice) : Promise.reject();
      },
    },
  };
}
