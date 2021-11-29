import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
import cn from 'classnames';
import add from 'date-fns/add';
import differenceInCalendarWeeks from 'date-fns/differenceInCalendarWeeks';
import Erc20Contract from 'web3/erc20Contract';
import { formatToken } from 'web3/utils';

import Divider from 'components/antd/divider';
import Grid from 'components/custom/grid';
import Icon from 'components/custom/icon';
import { Hint, Text } from 'components/custom/typography';
import { FDTToken } from 'components/providers/known-tokens-provider';
import { useWallet } from 'wallets/wallet';

import AirdropModal from '../../components/pool-airdrop-modal';
import PoolHarvestModal from '../../components/pool-harvest-modal';
import { useYFPools } from '../../providers/pools-provider';

import s from './s.module.scss';

const PoolRewards: React.FC = () => {
  const walletCtx = useWallet();
  const yfPoolsCtx = useYFPools();

  const [harvestModalVisible, showHarvestModal] = useState(false);
  const [airdropModalVisible, showAirdropModal] = useState(true);

  const fdtContract = FDTToken.contract as Erc20Contract;
  const { currentEpoch } = yfPoolsCtx.stakingContract ?? {};

  const totalToClaim = yfPoolsCtx.yfPools.reduce((sum: BigNumber | undefined, { contract }) => {
    if (!contract.address) {
      return sum ?? BigNumber.ZERO;
    }

    return (sum ?? BigNumber.ZERO).plus(contract.toClaim ?? BigNumber.ZERO);
  }, undefined);

  const totalPotentialReward = yfPoolsCtx.yfPools.reduce((sum: BigNumber | undefined, { contract }) => {
    if (contract.isPoolEnded !== false || !contract.address) {
      return sum ?? BigNumber.ZERO;
    }

    return (sum ?? BigNumber.ZERO).plus(contract.potentialReward ?? BigNumber.ZERO);
  }, undefined);

  const merkleDistributorData = yfPoolsCtx.merkleDistributor;
  const isAirdropClaimed = merkleDistributorData?.isAirdropClaimed;
  const adjustedAmount = merkleDistributorData?.adjustedAmount;

  const airdropAmount = !isAirdropClaimed ? BigNumber.from(adjustedAmount) : BigNumber.from(0);
  const airdropDurationInWeeks = 100;
  const airdropStartDate = new Date(1626674400000); // 2021-07-19 00:00:00
  const airdropEndDate = add(airdropStartDate, { weeks: airdropDurationInWeeks });
  const airdropCurrentWeek =
    airdropDurationInWeeks -
    differenceInCalendarWeeks(new Date(airdropEndDate), new Date() > airdropEndDate ? airdropEndDate : new Date());

  return (
    <div className={cn(s.component, 'pv-24')}>
      <div className="container-limit">
        <Text type="lb2" weight="semibold" className="sm-mb-16" color="primary">
          My Rewards
        </Text>

        <Grid flow="col" gap={24} className={s.items}>
          <Grid flow="row" gap={2} className={s.item1}>
            <Text type="p2" color="secondary">
              Current reward
            </Text>
            <Grid flow="col" align="center" gap={8} className={s.item1__grid}>
              <Text type="h3" weight="semibold" color="primary">
                {formatToken(totalToClaim?.unscaleBy(FDTToken.decimals)) ?? '-'}
              </Text>
              <Icon name={FDTToken.icon!} width={27} height={27} />
              {walletCtx.isActive && (
                <button
                  type="button"
                  className="button-primary button-small"
                  // disabled={!totalToClaim?.gt(BigNumber.ZERO)}
                  onClick={() => showHarvestModal(true)}>
                  Claim
                </button>
              )}
            </Grid>
          </Grid>
          <Divider type="vertical" />
          <Grid flow="row" gap={2} className={s.item2}>
            <Text type="p2" color="secondary">
              {FDTToken.symbol} Balance
            </Text>
            <Grid flow="col" gap={8} align="center">
              <Text type="h3" weight="semibold" color="primary">
                {formatToken(fdtContract.balance?.unscaleBy(FDTToken.decimals)) ?? '-'}
              </Text>
              <Icon name={FDTToken.icon!} width={27} height={27} />
            </Grid>
          </Grid>
          {!!currentEpoch && (
            <>
              <Divider type="vertical" />
              <Grid flow="row" gap={2} className={s.item4}>
                <Grid flow="col" gap={8} align="center">
                  <Hint
                    text={`This number shows the $${FDTToken.symbol} rewards you would potentially be able to harvest this epoch, but is subject to change - in case more users deposit, or you withdraw some of your stake.`}>
                    <Text type="p2" color="secondary">
                      Potential reward this epoch
                    </Text>
                  </Hint>
                </Grid>
                <Grid flow="col" gap={8} align="center">
                  <Text type="h3" weight="semibold" color="primary">
                    {formatToken(totalPotentialReward) ?? '-'}
                  </Text>
                  <Icon name={FDTToken.icon!} width={27} height={27} />
                </Grid>
              </Grid>
            </>
          )}
          {/* ToDo: Airdrop grid, uncomment when needed */}
          {/* <Divider type="vertical" />
          <Grid flow="row" gap={2} className={s.item3}>
            <Grid flow="col" gap={8} align="center">
              <Hint text="You have claimable tokens from the $ENTR Airdrop. This balance will rise over time and as more people exit the pool and forfeit their additional rewards. Warning: You can only claim once.">
                <Text type="p2" color="secondary">
                  <span style={{ marginRight: 5 }}>Airdrop reward</span>
                  <span className={s.week}>
                    WEEK {airdropCurrentWeek}/{airdropDurationInWeeks}
                  </span>
                </Text>
              </Hint>
            </Grid>
            <Grid flow="col" gap={4} align="center">
              <Text type="h3" weight="bold" color="primary">
                {formatToken(airdropAmount?.unscaleBy(EnterToken.decimals)) ?? 0}
              </Text>
              <Icon name={EnterToken.icon!} width={40} height={40} />
              {walletCtx.isActive && (
                <button
                  type="button"
                  className="button-primary button-small"
                  // disabled={!airdropAmount?.gt(BigNumber.ZERO)}
                  onClick={() => showAirdropModal(true)}>
                  Claim
                </button>
              )}
            </Grid>
          </Grid> */}
        </Grid>
      </div>
      {harvestModalVisible && <PoolHarvestModal onCancel={() => showHarvestModal(false)} />}
      {airdropModalVisible && (
        <AirdropModal merkleDistributor={merkleDistributorData} onCancel={() => showAirdropModal(false)} />
      )}
    </div>
  );
};

export default PoolRewards;
