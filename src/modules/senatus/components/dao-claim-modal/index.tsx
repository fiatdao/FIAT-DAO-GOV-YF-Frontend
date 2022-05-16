import React, { FC, useState } from 'react';
import BigNumber from 'bignumber.js';
import cn from 'classnames';
import { formatBigValue } from 'web3/utils';

import Modal, { ModalProps } from 'components/antd/modal';
import Spin from 'components/antd/spin';
import Grid from 'components/custom/grid';
import Icon  from 'components/custom/icon';
import { Text } from 'components/custom/typography';
import { FDTToken } from 'components/providers/known-tokens-provider';

import s from './s.module.scss';
import { useDAO } from '../dao-provider';
import Erc20Contract from '../../../../web3/erc20Contract';
import { useWallet } from '../../../../wallets/wallet';

type DAOClaimButtonButtonProps = {
  label: string;
  reward?: BigNumber;
  loading: boolean;
  claimSend: (from: string) => Promise<void>;
};

const DAOClaimButton: FC<DAOClaimButtonButtonProps> = props => {
  const { label, reward, loading, claimSend } = props;
  const daoCtx = useDAO();
  const wallet = useWallet();
  const [isClaim, setIsClaim] = useState(false)

  const handleClaim = () => {
    setIsClaim(true)
    claimSend(wallet.account as string)
      .catch(Error)
      .then(() => {
        daoCtx.daoReward.reload();
        (FDTToken.contract as Erc20Contract).loadBalance().catch(Error);
      }).finally(() => setIsClaim(false));
  }

  return (
    <Spin spinning={loading}>
      <button
        onClick={handleClaim}
        disabled={loading || !reward?.gt(BigNumber.ZERO) || isClaim}
        className={cn('p-24 button-ghost button-small', s.block)}
        style={{ width: '100%' }}>
        <div className="flex align-center justify-space-between" style={{ width: '100%', zIndex: 1 }}>
          <div className="flex align-center">
            <Text type="p1" weight="semibold" color="primary">
              {label}
            </Text>
          </div>
          <div className="flex flow-row align-start">
            <Text type="lb2" weight="500" color="secondary" className="mb-8">
              REWARD
            </Text>
            <div className="flex align-center">
              <Text type="p1" weight="semibold" color="primary" className="mr-12">
                {formatBigValue(reward) ?? '-'}
              </Text>
              <Icon className="mr-12" name={FDTToken.icon!} width={24} height={24} />
            </div>
          </div>
        </div>
      </button>
    </Spin>
  );
};

const DAOClaimModal: FC<ModalProps> = props => {
  const { ...modalProps } = props;
  const daoCtx = useDAO();

  return (
    <Modal width={565} {...modalProps}>
      <div className="flex flow-row">
        <div className="flex flow-row mb-32">
          <Text type="h2" weight="semibold" color="primary" className="mb-8" font="secondary">
            Claim your reward
          </Text>
          <Text type="p1" weight="semibold" color="secondary">
            Select the reward contract you want to claim your reward from
          </Text>
        </div>
        <Grid flow="row" gap={24} className={s.grid}>
          {daoCtx.daoReward.rewards.map((i) => (
            <DAOClaimButton
              key={i.name}
              label={i.label}
              reward={i.claimValue}
              loading={!i.claimValue}
              claimSend={i.claimSend}
            />
          ))}
        </Grid>
      </div>
    </Modal>
  );
};

export default DAOClaimModal;
