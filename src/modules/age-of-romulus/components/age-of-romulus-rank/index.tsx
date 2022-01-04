import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';
import { Progress, Spin } from 'antd';
import BigNumber from 'bignumber.js';
import cn from 'classnames';
import format from 'date-fns/format';
import { formatBigValue } from 'web3/utils';

import Grid from 'components/custom/grid';
import Icon from 'components/custom/icon';
import { Text } from 'components/custom/typography';
import { useGeneral } from 'components/providers/general-provider';
import arCompleted from 'resources/svg/age_of_romulus_completed.svg';
import iconNotConnect from 'resources/svg/not-connected.svg';
import { useWallet } from 'wallets/wallet';

import { APIVoterEntity } from '../../api';
import { ActiveKeys, useAgeOfRomulus } from '../../providers/age-of-romulus-providers';
import { PrizesData } from '../prizes-view';

import s from './s.module.scss';

interface IAgeOfRomulusRank {
  allUsers: null | any[];
  currUser: null | undefined | APIVoterEntity;
  countAllUsers: null | number;
}

const AgeOfRomulusRank = ({ allUsers, currUser, countAllUsers }: IAgeOfRomulusRank) => {
  const wallet = useWallet();
  const { isDarkTheme } = useGeneral();
  const ageOfRomulusCtx = useAgeOfRomulus();

  const [nextPrize] = useState(() => {
    if(ageOfRomulusCtx.ACTIVE_KEY === ActiveKeys.complete) {
      return PrizesData[0]
    }
    const nextPrizeIndex = PrizesData.map((i: any) => i.key).indexOf(ageOfRomulusCtx.ACTIVE_KEY);
    return PrizesData[nextPrizeIndex ? nextPrizeIndex - 1 : nextPrizeIndex];
  });

  const [isUntil, setIsUntil] = useState(false);
  const [lastVoterWithPrize, setLastVoterWithPrize] = useState(() => new BigNumber(0));

  useEffect(() => {
    if (allUsers && countAllUsers && currUser) {
      const arrForPrize = [...allUsers];
      arrForPrize.splice(Math.ceil(countAllUsers * ((nextPrize.rate as number) / 100)));
      setLastVoterWithPrize(arrForPrize[arrForPrize.length - 1].votingPower);
    }
  }, [allUsers, countAllUsers, currUser]);

  useEffect(() => {
    if (lastVoterWithPrize.isGreaterThan(new BigNumber(0))) {
      setIsUntil(lastVoterWithPrize.isGreaterThan((currUser as APIVoterEntity).votingPower));
    }
  }, [lastVoterWithPrize]);

  return (
    <div className={s.dots}>
      {!wallet.isActive ? (
        <div className="flex full-height justify-center align-center">
          <div className="flex flow-row align-center">
            <img src={iconNotConnect} width={48} height={64} className="mb-32" alt="" />
            <Text tag="p" type="p2" color="primary" className="mb-32 text-center">
              To check your rank, <br />
              connect your wallet below
            </Text>
            <button
              type="button"
              className={cn('button-primary', { 'button-small': isMobile })}
              onClick={() => wallet.showWalletsModal()}>
              <span>Connect {!isMobile && 'wallet'}</span>
            </button>
          </div>
        </div>
      ) : ageOfRomulusCtx.ACTIVE_KEY !== ActiveKeys.complete ? (
        !!currUser ? (
          <div>
            <div className={s.rank}>
              <Text type="p3" color="primary" className="mb-8">
                Your rank:
              </Text>
              <Text tag="p" type="h1" weight="bold" color="primary" className="mb-16">
                #{currUser.rank}
              </Text>
              <div className="flex inline flow-col align-center mb-32">
                <Icon name="png/fiat-dao" width={16} height={16} className="mr-4" />
                <Text type="p2" color="primary">
                  vFDT {formatBigValue(currUser.votingPower, 2, '-', 2)}
                </Text>
              </div>
            </div>
            <div className={s.rewards}>
              <div className={s.line} />
              <Text tag="p" weight="500" type="p2">
                Rewards
              </Text>
              <div className={s.line} />
            </div>
            <div className={s.upcoming}>
              <Grid flow="col" justify="space-between" className="1fr 1fr">
                <Text tag="p" type="p2" color="primary" className="mb-9">
                  Next prize
                </Text>
                <Text tag="p" type="p2" color="primary" className="mb-9">
                  {format(new Date(nextPrize.date), 'dd')} {format(new Date(nextPrize.date), 'LLL')},{' '}
                  {format(new Date(nextPrize.date), 'y')}
                </Text>
              </Grid>
              <div className={cn(s.upcoming__card, { [s.upcoming__card__active]: !isUntil })}>
                <Grid flow="col" gap={8} align="center" colsTemplate="60px 1fr">
                  {nextPrize.icon}
                  <div>
                    <Text type="lb2" color="primary">
                      {nextPrize.title}
                    </Text>
                    <Text type="p3" weight="bold" color="primary">
                      {nextPrize.rate ? `Top ${nextPrize.rate}%` : 'Everyone'}
                    </Text>
                  </div>
                </Grid>
              </div>
            </div>
            <div className="progress">
              <Text type="p3" color="primary" className="mb-12">
                {isUntil
                  ? `Additional vFDT required for next prize: ${formatBigValue(
                      lastVoterWithPrize.minus(currUser.votingPower),
                      2,
                      '-',
                      2,
                    )} vFDT`
                  : `You are ahead by: ${formatBigValue(
                      currUser.votingPower.minus(lastVoterWithPrize),
                      2,
                      '-',
                      2,
                    )} vFDT`}
              </Text>
              <Progress
                strokeColor={{
                  '0%': '#FF9574',
                  '100%': '#FF4C8C',
                }}
                trailColor={isDarkTheme ? '#171717' : '#F9F9F9'}
                percent={
                  isUntil ? currUser.votingPower.times(new BigNumber(100)).div(lastVoterWithPrize).toNumber() : 100
                }
                strokeWidth={32}
                showInfo={false}
              />
            </div>
          </div>
        ) : currUser === undefined ? (
          <div className="flex full-height justify-center align-center">
            <div className="flex flow-row align-center">
              <Icon name="png/fiat-dao" width="60" height="auto" className="mb-32" />
              <Text tag="p" type="p2" color="primary" className="mb-32 text-center">
                To participate in Age of Romulus, stake <br />
                FDT tokens in the DAO
              </Text>
              <Link to="/senatus" className="button-primary">
                Stake FDT
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex align-center full-height justify-center">
            <Spin size={'large'} spinning />
          </div>
        )
      ) : (
        <div className="flex align-center full-height justify-center">
          <div className="flex align-center justify-center flow-row">
            <img src={arCompleted} width={154} className="mb-24" alt="" />
            <Text type="h2" weight="bold" textGradient="var(--gradient-pink)" className="mb-12">
              Completed!
            </Text>
            <Text tag="p" type="p2" color="primary" className="text-center">
              The Age of Romulus ended on Dec 28th, 2021. <br />
              You can still claim any unclaimed NFTs.
            </Text>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgeOfRomulusRank;
