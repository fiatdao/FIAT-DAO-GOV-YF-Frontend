import React from 'react';
import cn from 'classnames';
import { formatToken, formatUSD, formatEntrValue } from 'web3/utils';

import ExternalLink from 'components/custom/externalLink';
import Grid from 'components/custom/grid';
import { Hint, Text } from 'components/custom/typography';
import { UseLeftTime } from 'hooks/useLeftTime';
import { APIOverviewData, fetchOverviewData } from 'modules/governance/api';

import { FDTToken, convertTokenInUSD } from '../../../../../../components/providers/known-tokens-provider';
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
                This number shows the amount of ${FDTToken.symbol} currently staked in the DAO.
              </Text>
            }>
            <Text type="lb2" weight="semibold" color="secondary">
              {FDTToken.symbol} staked
            </Text>
          </Hint>
          <Grid flow="row" gap={4}>
            <Grid flow="col" gap={4} align="end">
              <Text type="h2" weight="bold" color="primary">
                {formatToken(daoCtx.daoComitium.fdtStaked)}
              </Text>
              <Text type="p1" color="secondary">
                {FDTToken.symbol}
              </Text>
            </Grid>
            <Text type="p1" color="secondary">
              {formatUSD(convertTokenInUSD(daoCtx.daoComitium.fdtStaked, FDTToken.symbol))}
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
                  This counter shows the average amount of time ${FDTToken.symbol} stakers locked their deposits in
                  order to take advantage of the voting power bonus.
                </Text>
                <ExternalLink href="https://docs.enterdao.xyz/" className="link-blue" style={{ fontWeight: 600 }}>
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
                This number shows the ${FDTToken.symbol} token rewards distributed so far out of the total of{' '}
                {formatToken(daoCtx.daoReward.poolFeature?.totalAmount)} that are going to be available for the DAO
                Staking.
              </Text>
            }>
            <Text type="lb2" weight="semibold" color="secondary">
              {FDTToken.symbol} Rewards
            </Text>
          </Hint>
          <Grid flow="row" gap={4}>
            <UseLeftTime end={(daoCtx.daoReward.poolFeature?.endTs ?? 0) * 1000} delay={5_000}>
              {() => (
                <Text type="h2" weight="bold" color="primary">
                  {formatToken(daoCtx.daoReward.actions.getEntrRewards())}
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
                  This number shows the amount of v{FDTToken.symbol} that is delegated to other addresses.
                </Text>
                <ExternalLink href="https://docs.enterdao.xyz/" className="link-blue" style={{ fontWeight: 600 }}>
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
              {formatEntrValue(overview?.totalDelegatedPower)}
            </Text>
            <Text type="p1" color="secondary">
              out of {formatEntrValue((FDTToken.contract as Erc20Contract).totalSupply?.unscaleBy(FDTToken.decimals))}
            </Text>
          </Grid>
        </Grid>
      </div>

      <div className="card p-24">
        <Grid flow="row" gap={48}>
          <Hint
            text={
              <Text type="p2">
                This card shows the number of holders of ${FDTToken.symbol} and compares it to the number of stakers and
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
              {overview?.comitiumUsers} stakers
            </Text>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default VotingStatList;
