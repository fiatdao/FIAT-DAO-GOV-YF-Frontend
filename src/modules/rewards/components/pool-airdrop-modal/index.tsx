import React, { FC, useMemo, useState } from 'react';
import { Progress } from 'antd';
// import { BigNumber as _BigNumber } from 'bignumber.js';
import cn from 'classnames';
import { BigNumber, FixedNumber } from 'ethers';
import MerkleDistributor from 'web3/merkleDistributor';

import Divider from 'components/antd/divider';
import Modal, { ModalProps } from 'components/antd/modal';
import Spin from 'components/antd/spin';
import Grid from 'components/custom/grid';
import { Hint, Text } from 'components/custom/typography';
// import { FDTToken } from 'components/providers/known-tokens-provider';
import config from 'config';
import BalanceTree from 'merkle-distributor/balance-tree';
import { useWallet } from 'wallets/wallet';

import Icon from '../../../../components/custom/icon';
import { useGeneral } from '../../../../components/providers/general-provider';
import useMediaQuery from '../../../../hooks/useMediaQuery';

import s from './s.module.scss';

// import { formatToken } from 'web3/utils';

export type AirdropModalProps = ModalProps & {
  merkleDistributor?: MerkleDistributor;
};

const AirdropModal: FC<AirdropModalProps> = props => {
  const { isDarkTheme } = useGeneral();
  const isMobile = useMediaQuery(992);
  const { merkleDistributor, ...modalProps } = props;

  const walletCtx = useWallet();

  const [claiming, setClaiming] = useState(false);

  const merkleDistributorContract = merkleDistributor;

  const tree = useMemo(() => {
    let airdropData;
    config.isDev
      ? (airdropData = require(`../../../../merkle-distributor/airdrop-test.json`))
      : (airdropData = require(`../../../../merkle-distributor/airdrop.json`));
    const airdropAccounts = airdropData.map((drop: { address: any; earnings: any }) => ({
      account: drop.address,
      amount: BigNumber.from(FixedNumber.from(drop.earnings)),
    }));

    return new BalanceTree(airdropAccounts);
  }, []);

  const claimAmount = merkleDistributorContract?.claimAmount || 0;
  const claimAmountFromJSON = BigNumber.from(FixedNumber.from(claimAmount));

  const claimIndex = merkleDistributorContract?.claimIndex || -1;
  const merkleProof =
    claimIndex !== -1
      ? tree.getProof(claimIndex || BigNumber.from(0), walletCtx.account || '', claimAmountFromJSON)
      : [];
  // const adjustedAmount = _BigNumber.from(merkleDistributorContract?.adjustedAmount);

  async function claimAirdrop() {
    setClaiming(true);
    try {
      await merkleDistributorContract?.claim(
        claimIndex || BigNumber.from(0),
        merkleDistributorContract.account || '',
        claimAmountFromJSON.toString(),
        merkleProof,
      );
    } catch (e) {}

    setClaiming(false);
    props.onCancel?.();
  }

  async function cancelAirdropModal() {
    props.onCancel?.();
  }

  return (
    <Modal width={560} {...modalProps} className={s.modal}>
      <div className="flex flow-row">
        <div className="flex flow-row mb-32">
          <Text type="h2" weight="semibold" color="primary" className="mb-16" font="secondary">
            Airdrop reward
          </Text>
          <Text type="p3" className={s.modal__description}>
            You have claimable tokens from the FDT BarnBridge Community Airdrop. Claims made before a year has elapsed
            will forfeit a portion of their rewards. Your unclaimed balance will rise whenever someone exits the pool
            and forfeit a portion of their reward.
          </Text>
        </div>
        <div className="flex flow-col align-center gap-12 mb-16">
          <Text type="p2" color="primary" weight="500" className="mr-4">
            Total airdropped:
          </Text>
          <Icon width={19} height={19} name="png/fiat-dao" className={cn(s.fdReward, 'mr-4')} />
          <Hint text="2.5% of FDT supply was reserved for the BarnBridge community in recognition of their incubation of FIAT.">
            <Text type="p1" weight="700" color="primary">
              10,000,000
            </Text>
          </Hint>
        </div>
        <Grid colsTemplate={!isMobile ? '1fr 1fr' : '1fr'} className={isMobile ? 'mb-12' : 'mb-0'} gap={12}>
          <div className={s.card}>
            <Hint text="The amount of $FDT claimed to date." className="mb-16">
              <Text type="p3" weight="500" color="primary">
                Total claimed:
              </Text>
            </Hint>
            <div className="flex flow-col align-center gap-12">
              <Progress
                strokeLinecap="square"
                strokeColor={{
                  '0%': '#FF9574',
                  '100%': '#FF4C8C',
                }}
                type="circle"
                trailColor={isDarkTheme ? '#171717' : '#F9F9F9'}
                strokeWidth={16}
                width={54}
                percent={12}
                className="mr-12"
                format={() => (
                  <span className={s.progress}>
                    10<span>%</span>
                  </span>
                )}
              />
              <Icon width={19} height={19} name="png/fiat-dao" className={cn(s.fdReward, 'mr-4')} />
              <Text type="p2" weight="700" color="primary">
                500,000
              </Text>
            </div>
          </div>
          <div className={s.card}>
            <Hint text="The amount of forfeited $FDT redistributed across remaining recipients." className="mb-16">
              <Text type="p3" weight="500" color="primary">
                Total redistributed:
              </Text>
            </Hint>
            <div className="flex flow-col align-center mt-32 sm-mb-16 sm-mt-16">
              <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
              <Text type="p2" weight="700" color="green">
                500,000
              </Text>
            </div>
          </div>
        </Grid>
        <div className={cn(s.card, 'mb-32')}>
          <Grid
            colsTemplate={!isMobile ? '1fr 1fr 1fr' : '1fr'}
            gap={!isMobile ? 10 : 20}
            justify="space-between"
            className="mb-24">
            <div>
              <Hint
                text="You received $FDT because you were either staking your $BOND as of 0:00 UTC November 4th,
                2021, had voted in BarnBridge governance up until that date, or a combination of both."
                className="mb-4">
                <Text type="p3" weight="500" color="primary">
                  Your airdrop amount:
                </Text>
              </Hint>
              <div className="flex flow-col align-center">
                <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
                <Text type="p2" weight="700" color="primary">
                  100,000
                </Text>
              </div>
            </div>
            <div>
              <Hint
                text="This is the amount of additional $FDT you have received as a result of early claimants
                forfeiting a portion of their airdrop."
                className="mb-4">
                <Text type="p3" weight="500" color="primary">
                  Your bonus amount:
                </Text>
              </Hint>
              <div className="flex flow-col align-center">
                <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
                <Text type="p2" weight="700" color="green">
                  +35,000
                </Text>
              </div>
            </div>
            <div>
              <Hint
                text="This is the total amount of $FDT you are getting based on your initial airdrop amount + bonus
                amount from redistributed $FDT."
                className="mb-4">
                <Text type="p3" weight="500" color="primary">
                  Your total amount:
                </Text>
              </Hint>
              <div className="flex flow-col align-center">
                <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
                <Text type="p2" weight="700" color="primary">
                  135,000
                </Text>
              </div>
            </div>
          </Grid>
          <Divider />
          <Grid
            flow="col"
            align={'center'}
            colsTemplate="1fr auto"
            gap={10}
            justify="space-between"
            className="mt-24 mb-8">
            <div>
              <div className={s.week}>
                <Text type="p3" weight="bold">
                  WEEK 15/100
                </Text>
              </div>
            </div>
            <div>
              <div className="flex flow-col align-center">
                <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
                <Text type="p2" weight="700" color="primary">
                  135,000
                </Text>
              </div>
            </div>
          </Grid>
          <Progress
            strokeColor={{
              '0%': '#FF9574',
              '100%': '#FF4C8C',
            }}
            trailColor={isDarkTheme ? '#171717' : '#F9F9F9'}
            percent={40}
            strokeWidth={19}
            showInfo={false}
          />
        </div>
        <Grid
          gap={isMobile ? 32 : 0}
          colsTemplate={!isMobile ? '1fr auto' : '1fr'}
          justify="space-between"
          align={'center'}>
          <div>
            <Text type="p3" weight="500" color="primary">
              Available to claim now:
            </Text>
            <Text type="h2" weight="bold" color="primary" className="mb-8">
              30,000
            </Text>
          </div>
          <Grid flow="col" colsTemplate="1fr 1fr" gap={12} align={'center'} className={s.buttons}>
            <Spin spinning={claiming}>
              <button type="button" className="button-primary" onClick={() => claimAirdrop()}>
                Claim
              </button>
            </Spin>
            <div>
              <button type="button" className={cn('button-ghost', s.ghost)} onClick={() => cancelAirdropModal()}>
                <span>Cancel</span>
              </button>
            </div>
          </Grid>
        </Grid>
      </div>
    </Modal>
  );
};

export default AirdropModal;
