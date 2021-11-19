import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Progress } from 'antd';
import cn from 'classnames';

import Grid from '../../../../components/custom/grid';
import Icon from '../../../../components/custom/icon';
import { Text } from '../../../../components/custom/typography';
import { useGeneral } from '../../../../components/providers/general-provider';
import iconNotConnect from '../../../../resources/svg/not-connected.svg';
import { useWallet } from '../../../../wallets/wallet';

import s from './s.module.scss';

const AgeOfRomulusRank = () => {
  const wallet = useWallet();
  const { isDarkTheme } = useGeneral();

  const progressPercent = 75;
  const isNextPriseActive = true;

  return (
    <div className={s.dots}>
      {!wallet.isActive ? (
        <div className="flex full-height justify-center align-center">
          <div className="flex flow-row align-center">
            <img src={iconNotConnect} width={48} height={64} className="mb-32" alt="" />
            <Text tag="p" type="p2" color="primary" className="mb-32">
              Wallet not connected: To check your rank, <br />
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
      ) : (
        <div>
          <div className={s.rank}>
            <Text type="p3" color="primary" className="mb-8">
              Your rank:
            </Text>
            <Text tag="p" type="h1" weight="bold" color="primary" className="mb-16">
              #459
            </Text>
            <div className="flex inline flow-col align-center mb-32">
              <Icon name="png/fiat-dao" width={16} height={16} className="mr-4" />
              <Text type="p2" color="primary">
                vFDT 1,002,309.49
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
            {isNextPriseActive ? (
              <Grid flow="col" justify="space-between" className="1fr 1fr">
                <Text tag="p" type="p2" color="primary" className="mb-9">
                  Next prize
                </Text>
                <Text tag="p" type="p2" color="primary" className="mb-9">
                  22 Nov, 2021
                </Text>
              </Grid>
            ) : (
              <Text tag="p" type="p2" color="primary" className="mb-9">
                Upcoming prize
              </Text>
            )}
            <div
              className={cn(s.upcoming__card, {
                [s.upcoming__card__active]: progressPercent >= 100 || !isNextPriseActive,
              })}>
              <Grid flow="col" gap={8} align="center" colsTemplate="60px 1fr">
                <Icon name="png/roman-corona" width="60" height="auto" />
                <div>
                  <Text type="lb2" color="primary">
                    roman corona
                  </Text>
                  <Text type="p3" weight="bold" color="primary">
                    Top 5%
                  </Text>
                </div>
              </Grid>
            </div>
          </div>
          <div className="progress">
            <Text type="p3" color="primary" className="mb-12">
              You are ahead by: 3 vFDT
            </Text>
            <Progress
              strokeColor={{
                '0%': '#FF9574',
                '100%': '#FF4C8C',
              }}
              trailColor={isDarkTheme ? '#171717' : '#F9F9F9'}
              percent={progressPercent}
              strokeWidth={32}
              showInfo={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AgeOfRomulusRank;
