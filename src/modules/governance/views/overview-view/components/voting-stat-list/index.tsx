import React from 'react';
import cn from 'classnames';
import { formatToken, formatUSD, formatXYZValue } from 'web3/utils';

import ExternalLink from 'components/custom/externalLink';
import Grid from 'components/custom/grid';
import { Hint, Text } from 'components/custom/typography';
import { UseLeftTime } from 'hooks/useLeftTime';
import { APIOverviewData, fetchOverviewData } from 'modules/governance/api';

import { EnterToken, convertTokenInUSD } from '../../../../../../components/providers/known-tokens-provider';
import Erc20Contract from '../../../../../../web3/erc20Contract';
import { useDAO } from '../../../../components/dao-provider';

import { getFormattedDuration } from 'utils';

import s from './s.module.scss';

export type VotingStatListProps = {
  className?: string;
};

const VotingStatList: React.FC<VotingStatListProps> = props => {
  const { className } = props;

  const daoCtx = useDAO();
  const [overview, setOverview] = React.useState<APIOverviewData | undefined>();

  React.useEffect(() => {
    fetchOverviewData().then(setOverview);
  }, []);

  return (
    <div className={cn(s.cards, className)}>
      <div className="card p-24">
        <Grid flow="row" gap={48}>
          <Hint
            text={
              <Text type="p2">
                This number shows the amount of ${EnterToken.symbol} (and their USD value) currently staked in the DAO.
              </Text>
            }>
            <Text type="lb2" weight="semibold" color="secondary">
              {EnterToken.symbol} staked
            </Text>
          </Hint>
          <Grid flow="row" gap={4}>
            <Grid flow="col" gap={4} align="end">
              <Text type="h2" weight="bold" color="primary">
                {formatToken(daoCtx.daoBarn.entrStaked)}
              </Text>
              <Text type="p1" color="secondary">
                {EnterToken.symbol}
              </Text>
            </Grid>
            <Text type="p1" color="secondary">
              {formatUSD(convertTokenInUSD(daoCtx.daoBarn.entrStaked, EnterToken.symbol))}
            </Text>
          </Grid>
        </Grid>
      </div>

      <div className="card p-24">
        <Grid flow="row" gap={48}>
          <Hint
            text={
              <Grid flow="row" gap={8} align="start">
                <Text type="p2">
                  This number shows the amount of v{EnterToken.symbol} currently minted. This number may differ from the
                  amount of ${EnterToken.symbol}
                  staked because of the multiplier mechanic
                </Text>
                <ExternalLink href="https://docs.universe.xyz/" className="link-blue" style={{ fontWeight: 600 }}>
                  Learn more
                </ExternalLink>
              </Grid>
            }>
            <Text type="lb2" weight="semibold" color="secondary">
              v{EnterToken.symbol}
            </Text>
          </Hint>
          <Grid flow="row" gap={4}>
            <Text type="h2" weight="bold" color="primary">
              {formatXYZValue(overview?.TotalVKek)}
            </Text>
          </Grid>
        </Grid>
      </div>

      <div className="card p-24">
        <Grid flow="row" gap={48}>
          <Hint
            text={
              <Grid flow="row" gap={8} align="start">
                <Text type="p2">
                  This counter shows the average amount of time ${EnterToken.symbol} stakers locked their deposits in
                  order to take advantage of the voting power bonus.
                </Text>
                <ExternalLink href="https://docs.universe.xyz/" className="link-blue" style={{ fontWeight: 600 }}>
                  Learn more
                </ExternalLink>
              </Grid>
            }>
            <Text type="lb2" weight="semibold" color="secondary">
              Avg. Lock Time
            </Text>
          </Hint>
          <Grid flow="row" gap={4}>
            <Text type="h2" weight="bold" color="primary">
              {overview?.avgLockTimeSeconds ? getFormattedDuration(overview?.avgLockTimeSeconds) : '-'}
            </Text>
            <Text type="p1" color="secondary">
              average time
            </Text>
          </Grid>
        </Grid>
      </div>

      <div className="card p-24">
        <Grid flow="row" gap={48}>
          <Hint
            text={
              <Text type="p2">
                This number shows the ${EnterToken.symbol} token rewards distributed so far out of the total of{' '}
                {formatToken(daoCtx.daoReward.poolFeature?.totalAmount)} that are going to be available for the DAO
                Staking.
              </Text>
            }>
            <Text type="lb2" weight="semibold" color="secondary">
              {EnterToken.symbol} Rewards
            </Text>
          </Hint>
          <Grid flow="row" gap={4}>
            <UseLeftTime end={(daoCtx.daoReward.poolFeature?.endTs ?? 0) * 1000} delay={5_000}>
              {() => (
                <Text type="h2" weight="bold" color="primary">
                  {formatToken(daoCtx.daoReward.actions.getXYZRewards())}
                </Text>
              )}
            </UseLeftTime>
            <Text type="p1" color="secondary">
              out of {formatToken(daoCtx.daoReward.poolFeature?.totalAmount)}
            </Text>
          </Grid>
        </Grid>
      </div>

      <div className="card p-24">
        <Grid flow="row" gap={48}>
          <Hint
            text={
              <Grid flow="row" gap={8} align="start">
                <Text type="p2">
                  This number shows the amount of v{EnterToken.symbol} that is delegated to other addresses.
                </Text>
                <ExternalLink href="https://docs.universe.xyz/" className="link-blue" style={{ fontWeight: 600 }}>
                  Learn more
                </ExternalLink>
              </Grid>
            }>
            <Text type="lb2" weight="semibold" color="secondary">
              Delegated
            </Text>
          </Hint>
          <Grid flow="row" gap={4}>
            <Text type="h2" weight="bold" color="primary">
              {formatXYZValue(overview?.totalDelegatedPower)}
            </Text>
            <Text type="p1" color="secondary">
              out of {formatXYZValue((EnterToken.contract as Erc20Contract).totalSupply?.unscaleBy(EnterToken.decimals))}
            </Text>
          </Grid>
        </Grid>
      </div>

      <div className="card p-24">
        <Grid flow="row" gap={48}>
          <Hint
            text={
              <Text type="p2">
                This card shows the number of holders of ${EnterToken.symbol} and compares it to the number of stakers and
                voters in the DAO.
              </Text>
            }>
            <Text type="lb2" weight="semibold" color="secondary">
              Addresses
            </Text>
          </Hint>
          <Grid flow="row" gap={4}>
            <Grid flow="col" gap={4} align="end">
              <Text type="h2" weight="bold" color="primary">
                {overview?.holders}
              </Text>
              <Text type="p1" color="secondary">
                holders
              </Text>
            </Grid>
            <Text type="p1" color="secondary">
              {overview?.kernelUsers} stakers & {overview?.voters} voters
            </Text>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default VotingStatList;
