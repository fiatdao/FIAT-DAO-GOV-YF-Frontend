import React from 'react';
import cn from 'classnames';
import { formatToken, formatUSD } from 'web3/utils';

import ExternalLink from 'components/custom/externalLink';
import { Hint, Text } from 'components/custom/typography';
import { EnterToken } from 'components/providers/known-tokens-provider';
import { ENTR_MARKET_LINK } from 'config';
import { UseLeftTime } from 'hooks/useLeftTime';

import { useYFPool } from '../../providers/pool-provider';
import { useYFPools } from '../../providers/pools-provider';

import { getFormattedDuration } from 'utils';

import s from './s.module.scss';

type Props = {
  className?: string;
};

const PoolStats: React.FC<Props> = ({ className }) => {
  const yfPoolsCtx = useYFPools();
  const yfPoolCtx = useYFPool();
  const { poolMeta } = yfPoolCtx;

  const yfTotalStakedInUSD = yfPoolsCtx.getYFTotalStakedInUSD();
  const yfTotalEffectiveStakedInUSD = yfPoolsCtx.getYFTotalEffectiveStakedInUSD();
  const yfTotalSupply = yfPoolsCtx.getYFTotalSupply();
  const yfDistributedRewards = yfPoolsCtx.getYFDistributedRewards();
  const { epochStart, currentEpoch } = yfPoolsCtx.stakingContract ?? {};
  const [, epochEndDate] = yfPoolsCtx.stakingContract?.epochDates ?? [];

  const isEnded = poolMeta?.contract.isPoolEnded === true;

  return (
    <div className={cn(s.component, className)}>
      <div className="card p-24">
        <div className="flex flow-row justify-space-between full-height">
          <Hint
            className="mb-48"
            text={
              <Text type="p2">
                This number shows the Total Value Locked across the staking pool(s). It is the USD and ETH conversion of
                the amounts in the pool balance(s).
              </Text>
            }>
            <Text type="lb2" weight="semibold" color="primary" className={s.label}>
              Total Value Locked
            </Text>
          </Hint>
          <div className="flex flow-row">
            <Text type="h2" weight="bold" color="primary" className="mb-4">
              {formatUSD(yfTotalStakedInUSD, {
                decimals: 0,
              }) ?? '-'}
            </Text>
            <Text type="p1" color="secondary">
              {formatUSD(yfTotalEffectiveStakedInUSD, {
                decimals: 0,
              }) ?? '-'}{' '}
              eff. locked
            </Text>
          </div>
        </div>
      </div>

      <div className="card p-24">
        <div className="flex flow-row justify-space-between full-height">
          <Hint
            className="mb-48"
            text={
              <Text type="p2">
                This number shows the ${EnterToken.symbol} token rewards distributed so far out of the total of{' '}
                {formatToken(yfTotalSupply) ?? '-'} that are going to be available for Yield Farming.
              </Text>
            }>
            <Text type="lb2" weight="semibold" color="primary" className={s.label}>
              {EnterToken.symbol} Rewards
            </Text>
          </Hint>
          <div className="flex flow-row">
            <Text type="h2" weight="bold" color="primary" className="mb-4">
              {formatToken(yfDistributedRewards) ?? '-'}
            </Text>
            <Text type="p1" color="secondary">
              out of {formatToken(yfTotalSupply) ?? '-'}
            </Text>
          </div>
        </div>
      </div>

      <div className="card p-24">
        <div className="flex flow-row justify-space-between full-height">
          <Text type="lb2" weight="semibold" color="primary" className={cn(s.label, 'mb-48')}>
            {EnterToken.symbol} Price
          </Text>
          <div className="flex flow-row">
            <Text type="h2" weight="bold" color="primary" className="mb-4">
              {formatUSD(EnterToken.price) ?? '-'}
            </Text>
            <ExternalLink href={ENTR_MARKET_LINK} className="link-gradient">
              <Text type="p1" weight="semibold" color="var(--gradient-pink-safe)" textGradient="var(--gradient-pink)">
                SushiSwap market
              </Text>
            </ExternalLink>
          </div>
        </div>
      </div>

      {!isEnded && (
        <div className="card p-24">
          {currentEpoch === 0 && (
            <div className="flex flow-row justify-space-between full-height">
              <Hint
                className="mb-48"
                text={
                  <Text type="p2">
                    This counter shows the time left until the first epoch starts. The pool(s) below are synchronized
                    and have epochs that last a epoch. You can deposit to the pool(s) during the warm-up duration.
                  </Text>
                }>
                <Text type="lb2" weight="semibold" color="primary" className={s.label}>
                  Time Left
                </Text>
              </Hint>
              <div className="flex flow-row">
                {epochStart ? (
                  <UseLeftTime end={epochStart * 1_000} delay={1_000}>
                    {leftTime => (
                      <Text type="h2" weight="bold" color="primary" className="mb-4">
                        {leftTime > 0 ? getFormattedDuration(0, epochStart * 1_000) : '0s'}
                      </Text>
                    )}
                  </UseLeftTime>
                ) : (
                  '-'
                )}
                <Text type="p1" color="secondary">
                  until the first epoch starts
                </Text>
              </div>
            </div>
          )}
          {currentEpoch !== 0 && (
            <div className="flex flow-row justify-space-between full-height">
              <Hint
                className="mb-48"
                text={
                  <Text type="p2">
                    This counter shows the time left in the current epoch. The pool(s) below are synchronized and have
                    epochs that last a epoch. You can deposit to the pool(s) during the duration of an epoch and receive
                    rewards proportional to the time they are staked, but the funds must stay staked until the clock
                    runs out and the epoch ends in order to be able to harvest the rewards.
                  </Text>
                }>
                <Text type="lb2" weight="semibold" color="primary" className={s.label}>
                  Time Left
                </Text>
              </Hint>
              <div className="flex flow-row">
                {epochEndDate ? (
                  <UseLeftTime end={epochEndDate} delay={1_000}>
                    {leftTime => (
                      <Text type="h2" weight="bold" color="primary" className="mb-4">
                        {leftTime > 0 ? getFormattedDuration(0, epochEndDate) : '0s'}
                      </Text>
                    )}
                  </UseLeftTime>
                ) : (
                  '-'
                )}
                <Text type="p1" color="secondary">
                  until next epoch
                </Text>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PoolStats;
