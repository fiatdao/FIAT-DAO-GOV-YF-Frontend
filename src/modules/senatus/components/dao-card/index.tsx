import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import { formatPercent, formatToken } from 'web3/utils';

import Icon from 'components/custom/icon';
import { Text } from 'components/custom/typography';
import { FDTToken } from 'components/providers/known-tokens-provider';
import { UseLeftTime } from 'hooks/useLeftTime';
import { useDAO } from 'modules/senatus/components/dao-provider';
import { useWallet } from 'wallets/wallet';

import s from './s.module.scss';

const DaoCard: FC = () => {
  const walletCtx = useWallet();
  const daoCtx = useDAO();
  const { daoComitium, daoReward } = daoCtx;

  return (
    <div className="card">
      <div className={cn('card-header', s.cardTitleContainer)}>
        <div className={s.cardTitleTexts}>
          <Icon name="png/fiat-dao" width={40} height={40} className="mr-16" />
          <Text type="p1" weight="500" color="primary">
            DAO Rewards
          </Text>
        </div>
        {walletCtx.isActive && (
          <button className="button-primary" disabled>
            Deposit
          </button>
        )}
      </div>
      <div className="card-row card-row-border p-24">
        <Text type="lb2" weight="500" color="secondary">
          APR
        </Text>
        <div className="flex flow-col">
          <Text type="p1" weight="500" color="primary">
            {formatPercent(daoCtx.apr) ?? '-'}
          </Text>
        </div>
      </div>
      <div className="card-row card-row-border p-24">
        <Text type="lb2" weight="500" color="secondary">
          {FDTToken.symbol} Staked
        </Text>
        <div className="flex flow-col align-center">
          <Icon name="png/fiat-dao" width={16} height={16} className="mr-4" />
          <Text type="p1" weight="500" color="primary">
            {formatToken(daoComitium.fdtStaked) ?? '-'}
          </Text>
        </div>
      </div>
      {walletCtx.isActive && (
        <div className="card-row card-row-border p-24">
          <Text type="lb2" weight="500" color="secondary">
            My Staked Balance
          </Text>
          <div className="flex flow-col align-center">
            <Icon name="png/fiat-dao" width={16} height={16} className="mr-4" />
            <Text type="p1" weight="500" color="primary">
              {formatToken(daoComitium.balance) ?? '-'}
            </Text>
          </div>
        </div>
      )}
      <div className="card-row card-row-border p-24">
        <div className="flex flow-row">
          <Text type="lb2" weight="500" color="secondary" className="mb-4">
            {FDTToken.symbol} Rewards
          </Text>
          <Text type="p2" color="secondary">
            out of {formatToken(daoReward.getLastReward()?.poolFeature?.totalAmount)}
          </Text>
        </div>
        <div className="flex flow-col align-center">
          <Icon name="png/fiat-dao" width={16} height={16} className="mr-4" />
          <UseLeftTime
            end={(daoReward.rewards[daoCtx.daoReward.rewards.length - 1].poolFeature?.endTs ?? 0) * 1000}
            delay={5_000}>
            {() => (
              <Text type="p1" weight="500" color="primary">
                {formatToken(daoReward.getLastReward().getFDTRewards())}
              </Text>
            )}
          </UseLeftTime>
        </div>
      </div>
      {walletCtx.isActive && (
        <div className="card-row card-row-border p-24">
          <Text type="lb2" weight="500" color="secondary">
            My {FDTToken.symbol} Rewards
          </Text>
          <div className="flex flow-col align-center">
            <Icon name="png/fiat-dao" width={16} height={16} className="mr-4" />
            <Text type="p1" weight="500" color="primary">
              {formatToken(daoReward.getLastReward()?.claimValue) ?? '-'}
            </Text>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaoCard;
