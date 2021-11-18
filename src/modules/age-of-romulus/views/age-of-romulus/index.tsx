import React from 'react';
import cn from 'classnames';

import Grid from 'components/custom/grid';

import Icon from '../../../../components/custom/icon';
import { Hint, Text } from '../../../../components/custom/typography';
import useMediaQuery from '../../../../hooks/useMediaQuery';

import s from './s.module.scss';

const PrizesData = [
  {
    date: (
      <div className={s.date}>
        <span>20</span>
        <span>Dec</span>
      </div>
    ),
    icon: <Icon name="png/roman-corona" width="60" height="auto" />,
    title: 'roman corona',
    rate: 'Top 5%',
    stakers: '25',
    active: false,
  },
  {
    date: (
      <div className={s.date}>
        <span>13</span>
        <span>Dec</span>
      </div>
    ),
    icon: <Icon name="png/roman-gladius" width="60" height="auto" />,
    title: 'Roman gladius',
    rate: 'Top 10%',
    stakers: '50',
    active: false,
  },
  {
    date: (
      <div className={s.date}>
        <span>6</span>
        <span>Dec</span>
      </div>
    ),
    icon: <Icon name="png/roman-galea" width="60" height="auto" />,
    title: 'roman galea',
    rate: 'Top 25%',
    stakers: '125',
    active: false,
  },
  {
    date: (
      <div className={s.date}>
        <span>29</span>
        <span>Nov</span>
      </div>
    ),
    icon: <Icon name="png/roman-kithara" width="60" height="auto" />,
    title: 'roman kithara',
    rate: 'Top 50%',
    stakers: '250',
    active: false,
  },
  {
    date: (
      <div className={s.date}>
        <span>22</span>
        <span>Nov</span>
      </div>
    ),
    icon: <Icon name="png/roman-amphora" width="60" height="auto" />,
    title: 'roman amphora',
    rate: 'Everyone',
    stakers: '500',
    active: true,
  },
];

const AgeOfRomulusView = () => {
  const isTablet = useMediaQuery(992);
  const isMobile = useMediaQuery(768);

  return (
    <div className={s.ageOfRomulus}>
      <div className="container-limit">
        <Text tag="h1" type="h1" weight="bold" color="primary" font="tertiary" className="mb-48">
          Age of Romulus <span>Leaderboard</span>
        </Text>
        <Grid gap={!isTablet ? 32 : 16} colsTemplate={!isTablet ? '1fr 1fr' : '1fr'} className="mb-32 sm-mb-16">
          <div className={cn(s.card, s.card__dots)}>
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
              <Text tag="p" type="p2" color="primary" className="mb-9">
                Upcoming prize
              </Text>
              <div className={s.upcoming__card}>
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
          </div>
          <div className={s.card}>
            <Text type="h3" color="primary" className="mb-16">
              Prizes
            </Text>

            <div className={s.card__table}>
              {PrizesData.map(item => (
                <Grid
                  flow="col"
                  key={item.title}
                  align="center"
                  gap={8}
                  colsTemplate={!isMobile ? 'auto 60px 1fr auto auto' : 'auto 60px 1fr auto '}
                  className={cn(s.card__table__item, { [s.card__table__item__active]: item.active })}>
                  {item.date}
                  {item.icon}
                  <div>
                    <Text type="lb2" color="primary">
                      {item.title}
                    </Text>
                    <Text type="p3" weight="bold" color="primary">
                      {item.rate}
                    </Text>
                  </div>
                  <div className={s.stakers}>
                    <Text type="p2" color="secondary">
                      <span>{item.stakers}</span>
                      <span>stakers</span>
                    </Text>
                  </div>
                  <div className={cn({ [s.button]: isMobile })}>
                    <button type="button" disabled={!item.active} className="button-primary button-small">
                      {item.active ? 'Claim' : <Hint text="Tooltip">Claim</Hint>}
                    </button>
                  </div>
                </Grid>
              ))}
            </div>
          </div>
        </Grid>
        <div className={s.daoStakers}>
          <div className={s.daoStakers__head}>
            <div className={s.daoStakers__head__img} />
            <Text tag="p" type="h1" weight="bold" color="primary">
              DAO Stakers
            </Text>
            <Grid flow="col" gap={8} align="center" className={s.counter} colsTemplate="1fr 1fr 1fr">
              <Text tag="div" type="h3" weight="bold" color="white">
                4
              </Text>
              <Text tag="div" type="h3" weight="bold" color="white">
                0
              </Text>
              <Text tag="div" type="h3" weight="bold" color="white">
                0
              </Text>
            </Grid>
          </div>
          <div className={s.daoStakers__data}>DAO Stakers data</div>
        </div>
      </div>
    </div>
  );
};

export default AgeOfRomulusView;
