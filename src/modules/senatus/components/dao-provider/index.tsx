import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import ContractListener from 'web3/components/contract-listener';
import Erc20Contract from 'web3/erc20Contract';
import { ZERO_BIG_NUMBER } from 'web3/utils';

import { FDTToken } from 'components/providers/known-tokens-provider';
import config from 'config';
import useMergeState from 'hooks/useMergeState';
import { DAOComitiumContract, useDAOComitiumContract } from 'modules/senatus/contracts/daoComitium';
import { DAOSenatusContract, useDAOSenatusContract } from 'modules/senatus/contracts/daoSenatus';
import { DAORewardContract, useDAORewardContract } from 'modules/senatus/contracts/daoReward';
import { useWallet } from 'wallets/wallet';

import { APIProposalStateId } from '../../api';

export type DAOProviderState = {
  minThreshold: number;
  isActive?: boolean;
  fdtStaked?: BigNumber;
  activationThreshold?: BigNumber;
  activationRate?: number;
  thresholdRate?: number;
};

const InitialState: DAOProviderState = {
  minThreshold: 1,
  isActive: undefined,
  fdtStaked: undefined,
  activationThreshold: undefined,
  activationRate: undefined,
  thresholdRate: undefined,
};

type DAOContextType = DAOProviderState & {
  apr?: BigNumber;
  daoComitium: DAOComitiumContract;
  daoReward: DAORewardContract;
  daoSenatus: DAOSenatusContract;
  actions: {
    activate: () => Promise<void>;
    hasActiveProposal: () => Promise<boolean>;
    hasThreshold(): boolean | undefined;
  };
};

const DAOContext = React.createContext<DAOContextType>({
  ...InitialState,
  apr: undefined,
  daoComitium: undefined as any,
  daoReward: undefined as any,
  daoSenatus: undefined as any,
  actions: {
    activate: Promise.reject,
    hasActiveProposal: Promise.reject,
    hasThreshold: () => undefined,
  },
});

export function useDAO(): DAOContextType {
  return React.useContext(DAOContext);
}

const DAOProvider: React.FC = props => {
  const { children } = props;

  const walletCtx = useWallet();

  const daoComitium = useDAOComitiumContract();
  const daoReward = useDAORewardContract();
  const daoSenatus = useDAOSenatusContract();

  const [state, setState] = useMergeState<DAOProviderState>(InitialState);

  React.useEffect(() => {
    daoComitium.contract.setProvider(walletCtx.provider);
    daoReward.contract.setProvider(walletCtx.provider);
    daoSenatus.contract.setProvider(walletCtx.provider);
  }, [walletCtx.provider]);

  React.useEffect(() => {
    const fdtContract = FDTToken.contract as Erc20Contract;

    fdtContract.setAccount(walletCtx.account);
    daoComitium.contract.setAccount(walletCtx.account);
    daoReward.contract.setAccount(walletCtx.account);
    daoSenatus.contract.setAccount(walletCtx.account);

    if (walletCtx.isActive) {
      fdtContract.loadAllowance(config.contracts.dao.comitium).catch(Error);
    }
  }, [walletCtx.account]);

  React.useEffect(() => {
    const { isActive } = daoSenatus;
    const { fdtStaked, activationThreshold, votingPower } = daoComitium;

    let activationRate: number | undefined;

    if (fdtStaked && activationThreshold?.gt(ZERO_BIG_NUMBER)) {
      activationRate = fdtStaked.multipliedBy(100).div(activationThreshold).toNumber();
      activationRate = Math.min(activationRate, 100);
    }

    let thresholdRate: number | undefined;

    if (votingPower && fdtStaked?.gt(ZERO_BIG_NUMBER)) {
      thresholdRate = votingPower.multipliedBy(100).div(fdtStaked).toNumber();
      thresholdRate = Math.min(thresholdRate, 100);
    }

    setState({
      isActive,
      fdtStaked,
      activationThreshold,
      activationRate,
      thresholdRate,
    });
  }, [daoSenatus.isActive, daoComitium.fdtStaked, daoComitium.activationThreshold, daoComitium.votingPower]);

  const apr = useMemo(() => {
    const { poolFeature } = daoReward;
    const { fdtStaked } = daoComitium;

    if (!poolFeature || !fdtStaked || poolFeature.endTs < Date.now() / 1_000) {
      return undefined;
    }

    const duration = Number(poolFeature.totalDuration);
    const yearInSeconds = 365 * 24 * 60 * 60;

    return poolFeature.totalAmount.div(fdtStaked).div(duration).multipliedBy(yearInSeconds);
  }, [daoReward.poolFeature, daoComitium.fdtStaked]);

  function activate() {
    return daoSenatus.actions.activate().then(() => {
      daoSenatus.reload();
      daoComitium.reload();
    });
  }

  function hasActiveProposal(): Promise<boolean> {
    return daoSenatus.actions.getLatestProposalId().then(proposalId => {
      if (!proposalId) {
        return Promise.resolve(false);
      }

      return daoSenatus.actions.getProposalState(proposalId).then(proposalState => {
        return ![
          APIProposalStateId.CANCELED,
          APIProposalStateId.EXECUTED,
          APIProposalStateId.FAILED,
          APIProposalStateId.EXPIRED,
          APIProposalStateId.ABROGATED,
        ].includes(proposalState as any);
      });
    });
  }

  function hasThreshold(): boolean | undefined {
    if (state.thresholdRate === undefined) {
      return undefined;
    }

    return state.thresholdRate >= state.minThreshold;
  }

  return (
    <DAOContext.Provider
      value={{
        ...state,
        apr,
        daoComitium,
        daoReward,
        daoSenatus,
        actions: {
          activate,
          hasThreshold,
          hasActiveProposal,
        },
      }}>
      {children}
      <ContractListener contract={daoComitium.contract} />
      <ContractListener contract={daoReward.contract} />
      <ContractListener contract={daoSenatus.contract} />
    </DAOContext.Provider>
  );
};

export default DAOProvider;
