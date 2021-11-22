import React from 'react';
import cn from 'classnames';
import Lottie from 'lottie-react';

import Table from 'components/antd/table';
import Grid from 'components/custom/grid';

import ExternalLink from '../../components/custom/externalLink';
import Icon from '../../components/custom/icon';
import { Hint, Text } from '../../components/custom/typography';
import useMediaQuery from '../../hooks/useMediaQuery';
import { useWallet } from '../../wallets/wallet';
import airdropRewardWalletRequest from './animation/AirdropRewardWalletRequest.json';
import waveAnimations from './animation/waves.json';

import { getEtherscanTxUrl, shortenAddr } from '../../web3/utils';

import s from './AirDropPage.module.scss';

const progressPercent = 50;
const columns = [
  {
    dataIndex: 'address',
    key: 'address',
    render: (text: any) => text,
  },
  {
    dataIndex: 'amount',
    key: 'amount',
  },
];

const data = [
  {
    key: '1',
    address: (
      <ExternalLink href={getEtherscanTxUrl('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')} className="link-blue mb-4">
        <Text type="p1" weight="semibold" color="var(--gradient-blue-safe)" textGradient="var(--gradient-blue)">
          {shortenAddr('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')}
        </Text>
      </ExternalLink>
    ),
    amount: (
      <div className="flex flow-col align-center justify-end">
        <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
        <Text type="p2" weight="700" color="primary">
          100,000
        </Text>
      </div>
    ),
  },
  {
    key: '2',
    address: (
      <ExternalLink href={getEtherscanTxUrl('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')} className="link-blue mb-4">
        <Text type="p1" weight="semibold" color="var(--gradient-blue-safe)" textGradient="var(--gradient-blue)">
          {shortenAddr('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')}
        </Text>
      </ExternalLink>
    ),
    amount: (
      <div className="flex flow-col align-center justify-end">
        <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
        <Text type="p2" weight="700" color="primary">
          100,000
        </Text>
      </div>
    ),
  },
  {
    key: '3',
    address: (
      <ExternalLink href={getEtherscanTxUrl('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')} className="link-blue mb-4">
        <Text type="p1" weight="semibold" color="var(--gradient-blue-safe)" textGradient="var(--gradient-blue)">
          {shortenAddr('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')}
        </Text>
      </ExternalLink>
    ),
    amount: (
      <div className="flex flow-col align-center justify-end">
        <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
        <Text type="p2" weight="700" color="primary">
          100,000
        </Text>
      </div>
    ),
  },
  {
    key: '4',
    address: (
      <ExternalLink href={getEtherscanTxUrl('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')} className="link-blue mb-4">
        <Text type="p1" weight="semibold" color="var(--gradient-blue-safe)" textGradient="var(--gradient-blue)">
          {shortenAddr('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')}
        </Text>
      </ExternalLink>
    ),
    amount: (
      <div className="flex flow-col align-center justify-end">
        <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
        <Text type="p2" weight="700" color="primary">
          100,000
        </Text>
      </div>
    ),
  },
  {
    key: '5',
    address: (
      <ExternalLink href={getEtherscanTxUrl('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')} className="link-blue mb-4">
        <Text type="p1" weight="semibold" color="var(--gradient-blue-safe)" textGradient="var(--gradient-blue)">
          {shortenAddr('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')}
        </Text>
      </ExternalLink>
    ),
    amount: (
      <div className="flex flow-col align-center justify-end">
        <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
        <Text type="p2" weight="700" color="primary">
          100,000
        </Text>
      </div>
    ),
  },
  {
    key: '5',
    address: (
      <ExternalLink href={getEtherscanTxUrl('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')} className="link-blue mb-4">
        <Text type="p1" weight="semibold" color="var(--gradient-blue-safe)" textGradient="var(--gradient-blue)">
          {shortenAddr('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')}
        </Text>
      </ExternalLink>
    ),
    amount: (
      <div className="flex flow-col align-center justify-end">
        <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
        <Text type="p2" weight="700" color="primary">
          100,000
        </Text>
      </div>
    ),
  },
  {
    key: '6',
    address: (
      <ExternalLink href={getEtherscanTxUrl('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')} className="link-blue mb-4">
        <Text type="p1" weight="semibold" color="var(--gradient-blue-safe)" textGradient="var(--gradient-blue)">
          {shortenAddr('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')}
        </Text>
      </ExternalLink>
    ),
    amount: (
      <div className="flex flow-col align-center justify-end">
        <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
        <Text type="p2" weight="700" color="primary">
          100,000
        </Text>
      </div>
    ),
  },
  {
    key: '7',
    address: (
      <ExternalLink href={getEtherscanTxUrl('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')} className="link-blue mb-4">
        <Text type="p1" weight="semibold" color="var(--gradient-blue-safe)" textGradient="var(--gradient-blue)">
          {shortenAddr('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')}
        </Text>
      </ExternalLink>
    ),
    amount: (
      <div className="flex flow-col align-center justify-end">
        <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
        <Text type="p2" weight="700" color="primary">
          100,000
        </Text>
      </div>
    ),
  },
  {
    key: '8',
    address: (
      <ExternalLink href={getEtherscanTxUrl('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')} className="link-blue mb-4">
        <Text type="p1" weight="semibold" color="var(--gradient-blue-safe)" textGradient="var(--gradient-blue)">
          {shortenAddr('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')}
        </Text>
      </ExternalLink>
    ),
    amount: (
      <div className="flex flow-col align-center justify-end">
        <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
        <Text type="p2" weight="700" color="primary">
          100,000
        </Text>
      </div>
    ),
  },
  {
    key: '9',
    address: (
      <ExternalLink href={getEtherscanTxUrl('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')} className="link-blue mb-4">
        <Text type="p1" weight="semibold" color="var(--gradient-blue-safe)" textGradient="var(--gradient-blue)">
          {shortenAddr('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')}
        </Text>
      </ExternalLink>
    ),
    amount: (
      <div className="flex flow-col align-center justify-end">
        <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
        <Text type="p2" weight="700" color="primary">
          100,000
        </Text>
      </div>
    ),
  },
];

const AirDropPage = () => {
  const wallet = useWallet();
  const isTablet = useMediaQuery(992);
  const isMobile = useMediaQuery(720);
  return (
    <section className={s.page}>
      <div className={s.container}>
        <Text type="h2" weight="bold" color="primary" className="mb-8">
          Airdrop reward
        </Text>
        <Text type="small" color="secondary" className="mb-32">
          You may have received claimable token rewards from the $FDT BarnBridge Community Airdrop. Claiming your
          airdrop before a year has
          <br /> passed will forfeit a portion of your balance. Your total claimable amount will rise whenever someone
          forfeits a portion of their reward.
        </Text>
        <Grid colsTemplate={!isTablet ? '1fr 350px' : '1fr'} gap={30} className="mb-12">
          <Grid rowsTemplate="auto 1fr auto">
            <Grid
              colsTemplate={!isMobile ? '1fr 1fr 1fr' : '1fr'}
              gap={24}
              justify="space-between"
              className={cn(s.card, s.card__head, 'mb-32')}>
              <div>
                <Hint text="Total airdropped - tooltip" className="mb-4">
                  <Text type="small" color="secondary">
                    Total airdropped
                  </Text>
                </Hint>
                <div className="flex flow-col align-center">
                  <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
                  <Text type="p2" weight="700" color="primary">
                    10,000,000
                  </Text>
                </div>
              </div>
              <div>
                <Hint text="Total claimed - tooltip" className="mb-4">
                  <Text type="small" color="secondary">
                    Total claimed
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
                <Hint text="Total redistributed - tooltip" className="mb-4">
                  <Text type="small" color="secondary">
                    Total redistributed
                  </Text>
                </Hint>
                <div className="flex flow-col align-center">
                  <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
                  <Text type="p2" weight="700" color="green">
                    135,000
                  </Text>
                </div>
              </div>
            </Grid>
            <div className={cn(s.card, 'mb-32')}>
              {!wallet.isActive ? (
                <div className="flex full-height justify-center align-center">
                  <div className="flex flow-row align-center">
                    <Lottie animationData={airdropRewardWalletRequest} className={s.walletRequest} />
                    <Text tag="p" type="p2" color="primary" className="mb-32 text-center">
                      To check if you are eligible for the airdrop, <br />
                      connect your wallet.
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
                  <div className={s.week}>
                    <Text type="small">WEEK 15/100</Text>
                  </div>
                  <div className={s.bigBlock}>
                    <div>
                      <Hint text="Your total airdrop amount - tooltip" className="mb-12">
                        <Text type="small" color="secondary">
                          Your total airdrop amount
                        </Text>
                      </Hint>
                      <div className="flex flow-col align-center mb-48">
                        <Icon width={40} height={40} name="png/fiat-dao" className="mr-4" />
                        <Text type="h1" weight="700" color="primary">
                          135,000
                        </Text>
                      </div>
                      <Hint text="Your airdrop amount - tooltip" className="mb-12">
                        <Text type="small" color="secondary">
                          Your airdrop amount
                        </Text>
                      </Hint>
                      <div className="flex flow-col align-center mb-32">
                        <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
                        <Text type="p2" weight="700" color="primary">
                          500,000
                        </Text>
                      </div>
                      <Hint text="Your airdrop amount - tooltip" className="mb-12">
                        <Text type="small" color="secondary">
                          Your bonus amount
                        </Text>
                      </Hint>
                      <div className="flex flow-col align-center">
                        <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
                        <Text type="p2" weight="700" color="green">
                          500,000
                        </Text>
                      </div>
                    </div>
                    <div className={s.progress}>
                      <div>
                        <span>
                          <Text type="h1" weight="700" color="primary">
                            100,000
                          </Text>
                          <Text type="p3" color="primary">
                            available
                          </Text>
                        </span>
                        <Lottie
                          animationData={waveAnimations}
                          style={{ transform: `translateY(calc(-${progressPercent}% - -10px))` }}
                          className={s.waveAnimation}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div>
              <div className={s.cardGradient}>
                <div>
                  <Grid colsTemplate={!isTablet ? '1fr 1fr auto' : '1fr'} align="center" gap={24}>
                    <div>
                      <Text type="small" color="secondary" className="mb-4">
                        Available to claim now:
                      </Text>
                      <div className="flex flow-col align-center">
                        <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
                        <Text type="h2" weight="700" color="primary">
                          100,000
                        </Text>
                      </div>
                    </div>
                    <div>
                      <Text type="small" color="secondary" className="mb-4">
                        Available to claim now:
                      </Text>
                      <div className="flex flow-col align-center">
                        <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
                        <Text type="h2" weight="700" color="primary" textGradient="var(--gradient-pink)">
                          100,000
                        </Text>
                      </div>
                    </div>
                    <button className="button-primary">Claim</button>
                  </Grid>
                </div>
              </div>
            </div>
          </Grid>
          <div className={cn(s.card, s.card__table)}>
            <Hint text="Total redistributed - tooltip" className="mt-16 mb-32">
              <Text type="small" color="secondary">
                Last claimed
              </Text>
            </Hint>
            <div className={s.table}>
              <Table
                showHeader={false}
                pagination={{ pageSize: 8, position: ['bottomCenter'], defaultPageSize: 8, pageSizeOptions: ['8'] }}
                columns={columns}
                dataSource={data}
              />
            </div>
          </div>
        </Grid>
      </div>
    </section>
  );
};

export default AirDropPage;
