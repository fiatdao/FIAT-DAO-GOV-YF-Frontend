import React from 'react';
import { useHistory } from 'react-router-dom';
import * as Antd from 'antd';
import BigNumber from 'bignumber.js';
import { ZERO_BIG_NUMBER } from 'web3/utils';

import useMergeState from 'hooks/useMergeState';
import { useReload } from 'hooks/useReload';
import { APIProposalEntity, fetchProposal } from 'modules/senatus/api';
import { useWallet } from 'wallets/wallet';

import { useDAO } from '../../../../components/dao-provider';
import { ProposalReceipt } from '../../../../contracts/daoSenatus';

export type ProposalProviderState = {
  proposal?: APIProposalEntity;
  forRate?: number;
  againstRate?: number;
  quorum?: number;
  minThreshold: number;
  thresholdRate?: number;
  votingPower?: BigNumber;
  receipt?: ProposalReceipt;
  isCanceled?: boolean;
};

const InitialState: ProposalProviderState = {
  minThreshold: 1,
};

export type ProposalContextType = ProposalProviderState & {
  reload(): void;
  cancelProposal(): Promise<void>;
  queueProposalForExecution(gasPrice: number): Promise<void>;
  executeProposal(): Promise<void>;
  proposalCastVote(support: boolean, gasPrice: number): Promise<void>;
  proposalCancelVote(gasPrice: number): Promise<void>;
  startAbrogationProposal(description: string, gasPrice: number): Promise<void>;
};

const ProposalContext = React.createContext<ProposalContextType>({
  ...InitialState,
  reload: () => undefined,
  cancelProposal: () => Promise.reject(),
  queueProposalForExecution: () => Promise.reject(),
  executeProposal: () => Promise.reject(),
  proposalCastVote: () => Promise.reject(),
  proposalCancelVote: () => Promise.reject(),
  startAbrogationProposal: () => Promise.reject(),
});

export function useProposal(): ProposalContextType {
  return React.useContext(ProposalContext);
}

export type ProposalProviderProps = {
  proposalId?: number;
};

const ProposalProvider: React.FC<ProposalProviderProps> = props => {
  const { proposalId, children } = props;

  const history = useHistory();
  const wallet = useWallet();
  const daoCtx = useDAO();
  const [reload, version] = useReload();

  const [state, setState] = useMergeState<ProposalProviderState>(InitialState);

  React.useEffect(() => {
    if (!proposalId) {
      setState({ proposal: undefined });
      return;
    }

    fetchProposal(proposalId)
      .then(proposal => {
        setState({ proposal });
      })
      .catch((status: number) => {
        if (status === 404) {
          Antd.notification.error({
            message: `Proposal with id=${proposalId} doesn't exist.`,
          });
        } else {
          Antd.notification.error({
            message: `Failed to fetch proposal with id=${proposalId}. (Status: ${status})`,
          });
        }

        history.push('/senatus/proposals');
      });
  }, [proposalId, version]);

  React.useEffect(() => {
    setState({
      forRate: undefined,
      againstRate: undefined,
      quorum: undefined,
      isCanceled: undefined,
    });

    if (!state.proposal) {
      return;
    }

    const { forVotes, againstVotes, createTime, warmUpDuration } = state.proposal;
    const total = forVotes.plus(againstVotes);

    let forRate = 0;
    let againstRate = 0;

    if (total.gt(ZERO_BIG_NUMBER)) {
      forRate = forVotes.multipliedBy(100).div(total).toNumber();
      againstRate = againstVotes.multipliedBy(100).div(total).toNumber();
    }

    setState({
      forRate,
      againstRate,
    });

    daoCtx.daoComitium.actions.fdtStakedAtTs(createTime + warmUpDuration).then(fdtStakedAt => {
      let quorum: number | undefined;

      if (fdtStakedAt?.gt(ZERO_BIG_NUMBER)) {
        quorum = total.multipliedBy(100).div(fdtStakedAt).toNumber();
      }

      setState({ quorum });
    });

    daoCtx.daoSenatus.actions.abrogationProposal(state.proposal.proposalId).then(result => {
      if (result) {
        setState({ isCanceled: result.createTime > 0 });
      }
    });
  }, [state.proposal]);

  React.useEffect(() => {
    setState({
      thresholdRate: undefined,
    });

    const { fdtStaked } = daoCtx.daoComitium;

    if (!state.proposal || !fdtStaked || fdtStaked.isEqualTo(ZERO_BIG_NUMBER)) {
      return;
    }

    const { proposer } = state.proposal;

    daoCtx.daoComitium.actions.votingPower(proposer).then(votingPower => {
      if (votingPower) {
        setState({
          thresholdRate: votingPower.div(fdtStaked).multipliedBy(100).toNumber(),
        });
      }
    });
  }, [state.proposal, daoCtx.daoComitium.fdtStaked]);

  React.useEffect(() => {
    setState({
      receipt: undefined,
      votingPower: undefined,
    });

    if (!state.proposal || !wallet.isActive) {
      return;
    }

    const { createTime, warmUpDuration } = state.proposal;

    daoCtx.daoSenatus.actions.getProposalReceipt(state.proposal.proposalId).then(receipt => {
      setState({ receipt });
    });

    daoCtx.daoComitium.actions.votingPowerAtTs(createTime + warmUpDuration).then(votingPower => {
      setState({ votingPower });
    });
  }, [state.proposal, wallet.account]);

  function cancelProposal(): Promise<void> {
    return proposalId ? daoCtx.daoSenatus.actions.cancelProposal(proposalId).then(() => reload()) : Promise.reject();
  }

  function queueProposalForExecution(gasPrice: number): Promise<void> {
    return proposalId
      ? daoCtx.daoSenatus.actions.queueProposalForExecution(proposalId, gasPrice).then(() => reload())
      : Promise.reject();
  }

  function executeProposal(): Promise<void> {
    return proposalId
      ? daoCtx.daoSenatus.actions.executeProposal(proposalId).then(() => reload())
      : Promise.reject();
  }

  function proposalCastVote(support: boolean, gasPrice: number): Promise<void> {
    return proposalId
      ? daoCtx.daoSenatus.actions.proposalCastVote(proposalId, support, gasPrice).then(() => reload())
      : Promise.reject();
  }

  function proposalCancelVote(gasPrice: number): Promise<void> {
    return proposalId
      ? daoCtx.daoSenatus.actions.proposalCancelVote(proposalId, gasPrice).then(() => reload())
      : Promise.reject();
  }

  function startAbrogationProposal(description: string, gasPrice: number): Promise<void> {
    return proposalId
      ? daoCtx.daoSenatus.actions.startAbrogationProposal(proposalId, description, gasPrice).then(() => reload())
      : Promise.reject();
  }

  return (
    <ProposalContext.Provider
      value={{
        ...state,
        reload,
        cancelProposal,
        queueProposalForExecution,
        executeProposal,
        proposalCastVote,
        proposalCancelVote,
        startAbrogationProposal,
      }}>
      {children}
    </ProposalContext.Provider>
  );
};

export default ProposalProvider;
