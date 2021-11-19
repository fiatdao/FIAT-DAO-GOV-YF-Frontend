import { useEffect, useState } from 'react';
import cn from 'classnames';

import Grid from 'components/custom/grid';
import Icon from 'components/custom/icon';
import { Text } from 'components/custom/typography';
import useMediaQuery from 'hooks/useMediaQuery';
import { fetchCountAllUsers, fetchVoters } from 'modules/age-of-romulus/api';

import { useWallet } from '../../../../wallets/wallet';
import AgeOfRomulusTable from '../../components/age-of-romulus-table';
import PrizesView from '../../components/prizes-view';

import s from './s.module.scss';

// const enum ActiveDates {
//   amphora = '15 Nov 2021 00:00:00 GMT',
//   kithara = '17 Nov 2021 00:00:00 GMT',
//   galea = '6 Dec 2021 00:00:00 GMT',
//   gladius = '13 Dec 2021 00:00:00 GMT',
//   corona = '20 Dec 2021 00:00:00 GMT',
// }

export enum ActiveKeys {
  amphora = 'amphora',
  kithara = 'kithara',
  galea = 'galea',
  gladius = 'gladius',
  corona = 'corona',
}

const ACTIVE_KEY: ActiveKeys = ActiveKeys.amphora;

const AgeOfRomulusView = () => {
  const isTablet = useMediaQuery(992);

  const wallet = useWallet();

  const [countAllUsers, setCountAllUsers] = useState<null | number>(null);
  const [isClaimDisable, setIsClaimDisable] = useState<boolean | null>(null);
  const [allUsers, setAllUsers] = useState<null | any[]>(null);

  useEffect(() => {
    fetchCountAllUsers().then(setCountAllUsers);
  }, []);

  useEffect(() => {
    if (countAllUsers) {
      const maxCountPerPage = 1000;

      const promises = new Array(Math.ceil(countAllUsers / maxCountPerPage))
        .fill(null)
        .map((_, i) => fetchVoters(i + 1, 1000));

      Promise.all(promises).then(responses => {
        const result = responses.reduce((acc, { data }) => acc.concat(data as any), []);
        setAllUsers(result);
      });
    }
  }, [countAllUsers]);

  useEffect(() => {
    if (allUsers) {
      wallet.account
        ? // @ts-ignore
          setIsClaimDisable(!!allUsers.find(i => i.address.toLowerCase() === wallet?.account.toLowerCase()))
        : setIsClaimDisable(false);
    }
  }, [allUsers, wallet.account]);

  console.log({ countAllUsers });
  console.log({ allUsers });

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
          <PrizesView countAllUsers={countAllUsers} activeKey={ACTIVE_KEY} isClaimDisable={isClaimDisable} />
        </Grid>
        <div className={s.daoStakers}>
          <div className={s.daoStakers__head}>
            <div className={s.daoStakers__head__img} />
            <Text tag="p" type="h1" weight="bold" color="primary">
              DAO Stakers
            </Text>
            <div className={s.counter}>
              {countAllUsers &&
                [...countAllUsers.toString()].map((number, index) => (
                  <Text key={index} tag="div" type="h3" weight="bold" color="white">
                    {number}
                  </Text>
                ))}
            </div>
          </div>
          <AgeOfRomulusTable />
        </div>
      </div>
    </div>
  );
};

export default AgeOfRomulusView;
