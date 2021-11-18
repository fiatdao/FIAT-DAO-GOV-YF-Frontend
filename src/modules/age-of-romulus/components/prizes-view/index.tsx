import cn from 'classnames';

import AntdSpin from 'antd/lib/spin';
import Icon from 'components/custom/icon';
import { Hint, Text } from 'components/custom/typography';
import Grid from 'components/custom/grid';
import useMediaQuery from 'hooks/useMediaQuery';

import s from '../../views/age-of-romulus/s.module.scss';
import { ActiveKeys } from '../../views/age-of-romulus';
import React from 'react';


const PrizesData = [
  {
    key: 'corona',
    date: (
      <div className={s.date}>
        <span>20</span>
        <span>Dec</span>
      </div>
    ),
    icon: <Icon name="png/roman-corona" width="60" height="auto" />,
    title: 'roman corona',
    rate: 'Top 5%',
  },
  {
    key: 'gladius',
    date: (
      <div className={s.date}>
        <span>13</span>
        <span>Dec</span>
      </div>
    ),
    icon: <Icon name="png/roman-gladius" width="60" height="auto" />,
    title: 'Roman gladius',
    rate: 'Top 10%',
  },
  {
    key: 'galea',
    date: (
      <div className={s.date}>
        <span>6</span>
        <span>Dec</span>
      </div>
    ),
    icon: <Icon name="png/roman-galea" width="60" height="auto" />,
    title: 'roman galea',
    rate: 'Top 25%',
  },
  {
    key: 'kithara',
    date: (
      <div className={s.date}>
        <span>29</span>
        <span>Nov</span>
      </div>
    ),
    icon: <Icon name="png/roman-kithara" width="60" height="auto" />,
    title: 'roman kithara',
  },
  {
    key: 'amphora',
    date: (
      <div className={s.date}>
        <span>22</span>
        <span>Nov</span>
      </div>
    ),
    icon: <Icon name="png/roman-amphora" width="60" height="auto" />,
    title: 'roman amphora',
    rate: 'Everyone',
  },
];

const PrizesView = ({ countAllUsers, activeKey, isClaimDisable }:
                      { countAllUsers: number | null, activeKey: string, isClaimDisable: boolean | null }) => {
  const isMobile = useMediaQuery(768);
  return (
    <div>
      <div className={s.card}>
        <Text type="h3" color="primary" className="mb-16">
          Prizes
        </Text>

        <div className={s.card__table}>
          {PrizesData.map(({ key, title,date, icon, rate  }) => {
            const isDisabled = key === activeKey ? !isClaimDisable : true

            let stakers;
            switch (key) {
              case ActiveKeys.amphora:
                stakers = (countAllUsers ?? 0);
                break;
              case ActiveKeys.kithara:
                stakers = Math.ceil((countAllUsers ?? 0) * 0.5)
                break;
              case ActiveKeys.galea:
                stakers = Math.ceil((countAllUsers ?? 0) * 0.25);
                break;
              case ActiveKeys.gladius:
                stakers = Math.ceil((countAllUsers ?? 0) * 0.1);
                break;
              case ActiveKeys.corona:
                stakers = Math.ceil((countAllUsers ?? 0) * 0.05);
                break;
            }
            return (
              <Grid
                flow="col"
                key={title}
                align="center"
                gap={8}
                colsTemplate={!isMobile ? 'auto 60px 1fr auto auto' : 'auto 60px 1fr auto '}
                className={cn(s.card__table__item, { [s.card__table__item__active]: key === activeKey })}>
                {date}
                {icon}
                <div>
                  <Text type="lb2" color="primary">
                    {title}
                  </Text>
                  <Text type="p3" weight="bold" color="primary">
                    {rate}
                  </Text>
                </div>
                <div className={s.stakers}>
                  <Text type="p2" color="secondary">
                    <span>{countAllUsers ? stakers : <AntdSpin />}</span>
                    <span>stakers</span>
                  </Text>
                </div>
                <div className={cn({ [s.button]: isMobile })}>
                  <button type="button" disabled={isDisabled} className="button-primary button-small">
                    {key === activeKey ? 'Claim' : <Hint text="Tooltip">Claim</Hint>}
                  </button>
                </div>
              </Grid>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default PrizesView;
