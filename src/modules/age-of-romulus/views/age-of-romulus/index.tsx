import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import Modal from 'components/antd/modal';
import Grid from 'components/custom/grid';
import { Text } from 'components/custom/typography';
import useMediaQuery from 'hooks/useMediaQuery';
import { APIVoterEntity, fetchCountAllUsers, fetchVoters } from 'modules/age-of-romulus/api';
import { useAgeOfRomulus } from 'modules/age-of-romulus/providers/age-of-romulus-providers';

import nftCard from 'resources/png/nft_card.png';
import { useWallet } from 'wallets/wallet';

import AgeOfRomulusRank from '../../components/age-of-romulus-rank';
import AgeOfRomulusTable from '../../components/age-of-romulus-table';
import PrizesView from '../../components/prizes-view';

import s from './s.module.scss';


// import { formatToken } from '../../../../web3/utils';

// const enum ActiveDates {
//   amphora = '15 Nov 2021 00:00:00 GMT',
//   kithara = '17 Nov 2021 00:00:00 GMT',
//   galea = '6 Dec 2021 00:00:00 GMT',
//   gladius = '13 Dec 2021 00:00:00 GMT',
//   corona = '20 Dec 2021 00:00:00 GMT',
// }

const AgeOfRomulusView = () => {
  const isTablet = useMediaQuery(992);
  const wallet = useWallet();

  const ageOfRomulusCtx = useAgeOfRomulus();

  console.log('ageOfRomulusCtx', ageOfRomulusCtx);

  const [countAllUsers, setCountAllUsers] = useState<null | number>(null);
  const [currUser, setCurrUser] =  useState<null | undefined | APIVoterEntity>(null)
  const [allUsers, setAllUsers] = useState<null | any[]>(null);

  const isNftModalVisible = false;

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
      console.log('wallet.account', wallet.account);
      wallet.account
         ? // @ts-ignore
          setCurrUser(allUsers.find(i => i.address.toLowerCase() === wallet?.account.toLowerCase()))
          : setCurrUser(undefined)
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
          <div className={s.card}>
            <AgeOfRomulusRank allUsers={allUsers} currUser={currUser} countAllUsers={countAllUsers} />
          </div>
          <PrizesView countAllUsers={countAllUsers} activeKey={ageOfRomulusCtx.ACTIVE_KEY} isClaimDisable={!!currUser} />
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
      {isNftModalVisible && (
        // @ts-ignore
        <Modal width={428} className={s.modal} visible={isNftModalVisible}>
          <div className="flex flow-row justify-center align-center">
            <Text tag="h4" weight="bold" type="h3" color="primary" className="mb-24">
              Congratulations!
            </Text>
            <Text tag="p" type="p2" color="secondary" className="mb-32">
              Received the Roman Corona prize
            </Text>

            <img src={nftCard} width="150" alt="NFT Card" className="mb-32" />
            <button type="button" className={cn('button-primary', s.button)}>
              <span>View your NFT</span>
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AgeOfRomulusView;
