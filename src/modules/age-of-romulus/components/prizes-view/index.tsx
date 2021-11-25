import AntdSpin from 'antd/lib/spin';
import cn from 'classnames';
import format from 'date-fns/format';

import Grid from 'components/custom/grid';
import Icon from 'components/custom/icon';
import { Hint, Text } from 'components/custom/typography';
import useMediaQuery from 'hooks/useMediaQuery';

import prizeList from '../../prize';
import { ActiveKeys, useAgeOfRomulus } from '../../providers/age-of-romulus-providers';

import s from '../../views/age-of-romulus/s.module.scss';

export const PrizesData = [
  {
    key: 'corona',
    date: '20 Dec 2021 00:00:00 GMT',
    icon: <Icon name="png/roman-corona" width="60" height="auto" />,
    title: 'roman corona',
    rate: 5,
  },
  {
    key: 'gladius',
    date: '13 Dec 2021 00:00:00 GMT',
    icon: <Icon name="png/roman-gladius" width="60" height="auto" />,
    title: 'Roman gladius',
    rate: 10,
  },
  {
    key: 'galea',
    date: '6 Dec 2021 00:00:00 GMT',
    icon: <Icon name="png/roman-galea" width="60" height="auto" />,
    title: 'roman galea',
    rate: 25,
  },
  {
    key: 'kithara',
    date: '29 Nov 2021 00:00:00 GMT',
    icon: <Icon name="png/roman-kithara" width="60" height="auto" />,
    title: 'roman kithara',
    rate: 50,
  },
  {
    key: 'amphora',
    date: '22 Nov 2021 00:00:00 GMT',
    icon: <Icon name="png/roman-amphora" width="60" height="auto" />,
    title: 'roman amphora',
    rate: null,
  },
];

const PrizesView = ({
  countAllUsers,
  activeKey,
  currUser,
}: {
  countAllUsers: number | null;
  activeKey: string;
  currUser: any | null;
}) => {
  const isMobile = useMediaQuery(768);

  const ageOfRomulusCtx = useAgeOfRomulus();

  return (
    <div>
      <div className={s.card}>
        <Text type="h3" color="primary" className="mb-16">
          Prizes
        </Text>

        <div className={s.card__table}>
          {PrizesData.map(({ key, title, date, icon, rate }) => {
            const isDisabled =
              // @ts-ignore
              currUser && prizeList[key].length && prizeList[key].some(i => i.address.toLowerCase() === currUser.address.toLowerCase())
                ? // @ts-ignore
                  ageOfRomulusCtx[key].isClaimed
                : true

            let stakers;
            switch (key) {
              case ActiveKeys.amphora:
                stakers = 751;
                break;
              case ActiveKeys.kithara:
                stakers = Math.ceil((countAllUsers ?? 0) * 0.5);
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
                <div className={s.date}>
                  <span>{format(new Date(date), 'dd')}</span>
                  <span>{format(new Date(date), 'LLL')}</span>
                </div>
                {
                  key === activeKey ? (
                  <a href='https://rarible.com/token/0x598b1007a5a9b83dc50e06c668a4eae0986cb6ab:1' target="_blank" rel="noopener">
                    {icon}
                  </a>
                ) : icon
                }
                <div>
                  <Text type="lb2" color="primary">
                    {title}
                  </Text>
                  <Text type="p3" weight="bold" color="primary">
                    {rate ? `Top ${rate}%` : 'Everyone'}
                  </Text>
                </div>
                <div className={s.stakers}>
                  <Text type="p2" color="secondary">
                    <span>{countAllUsers ? stakers : <AntdSpin />}</span>
                    <span>stakers</span>
                  </Text>
                </div>
                <div className={cn({ [s.button]: isMobile })}>
                  {/*// @ts-ignore*/}
                  <button
                    type="button"
                    disabled={isDisabled}
                    // disabled={true}
                    // @ts-ignore
                    onClick={() => ageOfRomulusCtx[key].claim()}
                    className="button-primary button-small">
                    {key === activeKey ? (
                      'Claim'
                    ) : (
                      <Hint
                        text={`This NFT grants you access to the
                       ${
                         key === ActiveKeys.amphora
                           ? 'first'
                           : key === ActiveKeys.kithara
                           ? 'second'
                           : key === ActiveKeys.galea
                           ? 'third'
                           : key === ActiveKeys.gladius
                           ? 'fourth'
                           : 'fifth'
                       }
                        tier of liquidity mining rewards for the FDT / gOHM pair on Sushiswap.`}>
                        Claim
                      </Hint>
                    )}
                  </button>
                </div>
              </Grid>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PrizesView;
