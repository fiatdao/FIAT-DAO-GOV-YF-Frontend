import { ReactNode, useState } from 'react';
import AntdSpin from 'antd/lib/spin';
import cn from 'classnames';
import format from 'date-fns/format';

import Grid from 'components/custom/grid';
import { Hint, Text } from 'components/custom/typography';
import useMediaQuery from 'hooks/useMediaQuery';

import prizeList from '../../prize';
import { ActiveKeys, useAgeOfRomulus } from '../../providers/age-of-romulus-providers';

import s from '../../views/age-of-romulus/s.module.scss';
import { useWallet } from '../../../../wallets/wallet';

const PrizesItem = ({
                      keyItem, title, date, icon, rate, countAllUsers, activeKey
                    }: {
  keyItem: string;
  title: string;
  date: string;
  activeKey: string;
  icon: ReactNode;
  rate: number | null;
  countAllUsers: number | null;
}) => {
  const walletCtx = useWallet();

  const isMobile = useMediaQuery(768);

  const ageOfRomulusCtx = useAgeOfRomulus();

  const [isClaim, setIsClaim] = useState(false);

  const isDisabled =
    // @ts-ignore
    walletCtx.account && prizeList[keyItem].length && prizeList[keyItem].some(i => i.address.toLowerCase() === walletCtx.account.toLowerCase())
      ? // @ts-ignore
      ageOfRomulusCtx[keyItem].isClaimed
      : true

  let stakers;
  switch (keyItem) {
    case ActiveKeys.amphora:
      stakers = 751;
      break;
    case ActiveKeys.kithara:
      stakers = 432;
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

  const handleClaim = async () => {
    setIsClaim(true)
    try {
      // @ts-ignore
      await ageOfRomulusCtx[keyItem].claim()
    } catch (e) {
      console.log({ e });
    } finally {
      setIsClaim(false)
    }
  }

  return (
    <Grid
      flow="col"
      key={title}
      align="center"
      gap={8}
      colsTemplate={!isMobile ? 'auto 60px 1fr auto auto' : 'auto 60px 1fr auto '}
      className={cn(s.card__table__item, { [s.card__table__item__active]: keyItem === activeKey })}>
      <div className={s.date}>
        <span>{format(new Date(date), 'dd')}</span>
        <span>{format(new Date(date), 'LLL')}</span>
      </div>
      {
        <a href={`https://rarible.com/token/0x598b1007a5a9b83dc50e06c668a4eae0986cb6ab:${keyItem === ActiveKeys.amphora ? 1 : keyItem === ActiveKeys.kithara ? 2 : keyItem === ActiveKeys.galea ? 3 : keyItem === ActiveKeys.gladius ? 4 : 5 }`} target="_blank" rel="noopener">
          {icon}
        </a>
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
          disabled={isDisabled || isClaim}
          // disabled={true}
          onClick={handleClaim}
          className="button-primary button-small">
          {!isDisabled ? (
            'Claim'
          ) : (
            <Hint
              text={`This NFT grants you access to the
                       ${
                keyItem === ActiveKeys.amphora
                  ? 'first'
                  : keyItem === ActiveKeys.kithara
                    ? 'second'
                    : keyItem === ActiveKeys.galea
                      ? 'third'
                      : keyItem === ActiveKeys.gladius
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
};

export default PrizesItem;
