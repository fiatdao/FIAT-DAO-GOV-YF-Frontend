import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import { formatPercent, formatToken } from 'web3/utils';

import Icon from 'components/custom/icon';
import { Text } from 'components/custom/typography';
import { FDTToken } from 'components/providers/known-tokens-provider';
import { UseLeftTime } from 'hooks/useLeftTime';
import { useDAO } from 'modules/governance/components/dao-provider';
import { useWallet } from 'wallets/wallet';

import s from './s.module.scss';

const DaoCard: FC = () => {
  const walletCtx = useWallet();
  const daoCtx = useDAO();
  const { daoBarn, daoReward } = daoCtx;

  return (
    <div className="card">
      <div className={cn('card-header', s.cardTitleContainer)}>
        <div className={s.cardTitleTexts}>
          <Icon name="png/enter-star" width={40} height={40} className="mr-4" />
          <Text type="p1" weight="semibold" color="primary" ellipsis>
            DAO Rewards
          </Text>
        </div>
        {walletCtx.isActive && (
          <Link to="/governance/wallet/deposit" className="button-primary">
            Deposit
          </Link>
        )}
      </div>
      <div className="card-row card-row-border p-24">
        <Text type="lb2" weight="semibold" color="secondary">
          APR
        </Text>
        <div className="flex flow-col">
          <Text type="p1" weight="semibold" color="primary">
            {formatPercent(daoCtx.apr) ?? '-'}
          </Text>
        </div>
      </div>
      <div className="card-row card-row-border p-24">
        <Text type="lb2" weight="semibold" color="secondary">
          {FDTToken.symbol} Staked
        </Text>
        <div className="flex flow-col">
          <Icon name="static/fiat-dao" className="mr-4" />
          <Text type="p1" weight="semibold" color="primary">
            {formatToken(daoBarn.entrStaked) ?? '-'}
          </Text>
        </div>
      </div>
      {walletCtx.isActive && (
        <div className="card-row card-row-border p-24">
          <Text type="lb2" weight="semibold" color="secondary">
            My Staked Balance
          </Text>
          <div className="flex flow-col">
            <Icon name="static/fiat-dao" className="mr-4" />
            <Text type="p1" weight="semibold" color="primary">
              {formatToken(daoBarn.balance) ?? '-'}
            </Text>
          </div>
        </div>
      )}
      <div className="card-row card-row-border p-24">
        <div className="flex flow-row">
          <Text type="lb2" weight="semibold" color="secondary" className="mb-4">
            {FDTToken.symbol} Rewards
          </Text>
          <Text type="p2" color="secondary">
            out of {formatToken(daoReward.poolFeature?.totalAmount)}
          </Text>
        </div>
        <div className="flex flow-col">
          <Icon name="static/fiat-dao" className="mr-4" />
          <UseLeftTime end={(daoReward.poolFeature?.endTs ?? 0) * 1000} delay={5_000}>
            {() => (
              <Text type="p1" weight="bold" color="primary">
                {formatToken(daoReward.actions.getEntrRewards())}
              </Text>
            )}
          </UseLeftTime>
        </div>
      </div>
      {walletCtx.isActive && (
        <div className="card-row card-row-border p-24">
          <Text type="lb2" weight="semibold" color="secondary">
            My {FDTToken.symbol} Rewards
          </Text>
          <div className="flex flow-col">
            <Icon name="static/fiat-dao" className="mr-4" />
            <Text type="p1" weight="semibold" color="primary">
              {formatToken(daoReward.claimValue) ?? '-'}
            </Text>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaoCard;
