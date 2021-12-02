import {  useState  } from 'react';
import cn from 'classnames';
import { BigNumber as _BigNumber } from 'bignumber.js';
import Lottie from 'lottie-react';

import { Grid, Hint, Icon, Text } from 'components/custom';

import { useMediaQuery } from '../../../../hooks';
import { useWallet } from '../../../../wallets/wallet';
import airdropRewardLocked from '../../animation/AirdropRewardLocked.json';
import airdropRewardWalletRequest from '../../animation/AirdropRewardWalletRequest.json';
import waveAnimations from '../../animation/waves.json';
import airdropRewardClaimed from '../../animation/airdropRewardClaimed.json';
import LastClaimed from '../../components/last-claimed-table';

import s from './AirDropPage.module.scss';

import { useYFPools } from '../../providers/pools-provider';
import { formatToken } from '../../../../web3/utils';

import { FDTToken } from 'components/providers/known-tokens-provider';

const AirDropPage = () => {
  const yfPoolsCtx = useYFPools();

  const merkleDistributorContract = yfPoolsCtx.merkleDistributor;

  const wallet = useWallet();
  const isTablet = useMediaQuery(992);
  const isMobile = useMediaQuery(720);
  const lockedAirDrop = merkleDistributorContract?.claimIndex === -1;

  const totalClaimed = new _BigNumber(merkleDistributorContract?.totalInfo?.totalFDTAirdropClaimed ?? 0).unscaleBy(FDTToken.decimals)
  const totalRedistributed = new _BigNumber(merkleDistributorContract?.totalInfo?.totalFDTAirdropRedistributed ?? 0).unscaleBy(FDTToken.decimals)

  const userAmount = new _BigNumber(merkleDistributorContract?.claimAmount ?? 0)
  const userAvailable = new _BigNumber(merkleDistributorContract?.adjustedAmount?.airdropAmount ?? 0).unscaleBy(FDTToken.decimals)
  const userBonus = new _BigNumber(merkleDistributorContract?.adjustedAmount?.bonus ?? 0).unscaleBy(FDTToken.decimals)

  const progressPercent = userAvailable?.times(100).div(userAmount ?? 0).toNumber()

  const [isClaim, setIsClaim] = useState(false)

  const handleClaim = async () => {
    setIsClaim(true)
    try {
      await merkleDistributorContract?.claim()
    } catch (e) {
      console.log(e)
    } finally {
      setIsClaim(false)
    }
  }

  return (
    <section className={s.page}>
      <div className={s.container}>
        <Text type="h2" weight="bold" color="primary" className="mb-8">
          Airdrop reward
        </Text>
        <Text type="p3" color="secondary" className="mb-32">
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
                <Hint text="2.5% of FDT supply was reserved for the BarnBridge community in recognition of their incubation of FIAT." className="mb-4">
                  <Text type="small" color="secondary">
                    Total airdropped
                  </Text>
                </Hint>
                <div className="flex flow-col align-center">
                  <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
                  <Text type="p2" weight="bold" color="primary">
                    {formatToken(merkleDistributorContract?.totalAirdropped) ?? 0}
                  </Text>
                </div>
              </div>
              <div>
                <Hint text="The amount of $FDT claimed to date." className="mb-4">
                  <Text type="small" color="secondary">
                    Total claimed
                  </Text>
                </Hint>
                <div className="flex flow-col align-center">
                  <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
                  <Text type="p2" weight="bold" color="primary">
                    {formatToken(totalClaimed)}
                  </Text>
                </div>
              </div>
              <div>
                <Hint text="The amount of forfeited $FDT redistributed across remaining recipients." className="mb-4">
                  <Text type="small" color="secondary">
                    Total redistributed
                  </Text>
                </Hint>
                <div className="flex flow-col align-center">
                  <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
                  <Text type="p2" weight="bold" color="green">
                    {formatToken(totalRedistributed)}
                  </Text>
                </div>
              </div>
            </Grid>
            <div className={cn(s.card, { 'mb-32': !merkleDistributorContract?.isAirdropClaimed && !lockedAirDrop })}>

              {lockedAirDrop && (
                <div className="flex full-height justify-center align-center">
                  <div className="flex flow-row align-center">
                    <Lottie animationData={airdropRewardLocked} className={s.lockedAirDrop} />
                    <Text tag="p" type="p2" color="primary" className="text-center">
                      Sorry, you are not eligible for <br />
                      this airdrop.
                    </Text>
                  </div>
                </div>
              )}
              {merkleDistributorContract?.isAirdropClaimed && (
                <div className="flex full-height justify-center align-center">
                  <div className="flex flow-row align-center">
                    <Lottie animationData={airdropRewardClaimed} className={s.claimedAirDrop} />
                    <Text tag="p" type="p2" color="primary" className="text-center">
                      You have already claimed <br />
                      your airdrop reward
                    </Text>
                  </div>
                </div>
              )}
              {!lockedAirDrop && !merkleDistributorContract?.isAirdropClaimed && (
                <>
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
                        <Text type="small">WEEK {merkleDistributorContract?.airdropCurrentWeek}/{merkleDistributorContract?.airdropDurationInWeeks}</Text>
                      </div>
                      <div className={s.bigBlock}>
                        <div>
                          <Hint text="This is the total amount of $FDT you are getting based on your initial airdrop amount + bonus
                amount from redistributed $FDT." className="mb-12">
                            <Text type="small" color="secondary">
                              Your total airdrop amount
                            </Text>
                          </Hint>
                          <div className="flex flow-col align-center mb-48">
                            <Icon width={40} height={40} name="png/fiat-dao" className="mr-4" />
                            <Text type="h1" weight="bold" color="primary">
                              {formatToken(userBonus?.plus(userAmount ?? 0), { decimals: 1 })}
                            </Text>
                          </div>
                          <Hint text="You received $FDT because you were either staking your $BOND as of 0:00 UTC November 4th,
                2021, had voted in BarnBridge governance up until that date, or a combination of both." className="mb-12">
                            <Text type="small" color="secondary">
                              Your airdrop amount
                            </Text>
                          </Hint>
                          <div className="flex flow-col align-center mb-32">
                            <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
                            <Text type="p2" weight="bold" color="primary">
                              {formatToken(userAmount)}
                            </Text>
                          </div>
                          <Hint text="This is the amount of additional $FDT you have received as a result of early claimants
                forfeiting a portion of their airdrop." className="mb-12">
                            <Text type="small" color="secondary">
                              Your bonus amount
                            </Text>
                          </Hint>
                          <div className="flex flow-col align-center">
                            <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
                            <Text type="p2" weight="bold" color="green">
                              +{formatToken(userBonus)}
                            </Text>
                          </div>
                        </div>
                        <div className={s.progress}>
                          <div>
                            <span>
                              <Text type="h1" weight="bold" color="primary">
                                 {formatToken(userAvailable, { compact: true })}
                              </Text>
                              <Text type="p3" color="primary">
                                available
                              </Text>
                            </span>
                            <Lottie
                              animationData={waveAnimations}
                              style={{ transform: `translateY(calc(-${isNaN(progressPercent as number) ? 0 : (progressPercent as number) < 20 ? 20 : progressPercent}% - -10px))` }}
                              className={s.waveAnimation}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            {!merkleDistributorContract?.isAirdropClaimed && !lockedAirDrop && (<div>
              <div className={s.cardGradient}>
                <div>
                  <Grid className={s.cardGradient__grid} align='center' gap={!isTablet ? 40 : 24}>
                    <div>
                      <Text type='small' color='secondary' className='mb-4'>
                        Available to claim now:
                      </Text>
                      <div className='flex flow-col align-center'>
                        <Icon width={19} height={19} name='png/fiat-dao' className='mr-4' />
                        <Text type='h2' weight='bold' color='primary'>
                          {formatToken(userAvailable)}
                        </Text>
                      </div>
                    </div>
                    <div>
                      <Text type='small' color='secondary' className='mb-4'>
                        You forfeit:
                      </Text>
                      <div className='flex flow-col align-center'>
                        <Icon width={19} height={19} name='png/fiat-dao' className='mr-4' />
                        <Text type='h2' weight='bold' color='primary' textGradient='var(--gradient-pink)'>
                          {formatToken(userBonus?.plus(userAmount ?? 0)?.minus(userAvailable ?? 0))}
                        </Text>
                      </div>
                    </div>
                    <div className={cn('flex align-center', s.button)}>
                      <button
                        disabled={
                          merkleDistributorContract?.adjustedAmount?.airdropAmount === undefined
                          || merkleDistributorContract?.isAirdropClaimed
                          || isClaim
                        }
                        onClick={handleClaim} className='button-primary'>Claim
                      </button>
                    </div>
                  </Grid>
                </div>
              </div>
            </div>)}
          </Grid>
          <div className={cn(s.card, s.card__table)}>
            <Hint text="Total redistributed - tooltip" className="mt-16 mb-32">
              <Text type="small" color="secondary">
                Last claimed
              </Text>
            </Hint>
            <div className={s.table}>
              <LastClaimed />
            </div>
          </div>
        </Grid>
      </div>
    </section>
  );
};

export default AirDropPage;
