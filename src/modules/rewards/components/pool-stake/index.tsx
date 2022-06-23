import React, { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AntdForm from 'antd/lib/form';
import BigNumber from 'bignumber.js';
import cn from 'classnames';
import TxConfirmModal from 'web3/components/tx-confirm-modal';
import Erc20Contract from 'web3/erc20Contract';
import { formatToken, formatUSD } from 'web3/utils';
import { parseUnits } from '@ethersproject/units';

import Alert from 'components/antd/alert';
import Form from 'components/antd/form';
import Spin from 'components/antd/spin';
import Tooltip from 'components/antd/tooltip';
import Icon from 'components/custom/icon';
import TokenAmount from 'components/custom/token-amount';
import { Text } from 'components/custom/typography';
import { FDTToken, KnownTokens, convertTokenInUSD, useKnownTokens } from 'components/providers/known-tokens-provider';
import config from 'config';
import { YfPoolContract } from 'modules/rewards/contracts/yfPool';

import Divider from '../../../../components/antd/divider';
import { useYFPool } from '../../providers/pool-provider';
import { useYFPools } from '../../providers/pools-provider';

import s from './s.module.scss';

type StakeFormData = {
  amount?: BigNumber;
};

const PoolStake: FC = () => {
  const knownTokensCtx = useKnownTokens();
  const yfPoolsCtx = useYFPools();
  const yfPoolCtx = useYFPool();

  const [form] = AntdForm.useForm<StakeFormData>();

  const [activeToken, setActiveToken] = useState(yfPoolCtx.poolMeta?.tokens[0]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [enabling, setEnabling] = useState(false);
  const [staking, setStaking] = useState(false);
  const [bnAmount, setBnAmount] = useState(new BigNumber(0));

  const { poolMeta, poolBalance } = yfPoolCtx;
  const activeContract = activeToken?.contract as Erc20Contract;

  const currStakingContract = !!poolMeta?.isNFTPool ? yfPoolsCtx.stakingNFTContract : yfPoolsCtx.stakingContract;


  // @ts-ignore
  const selectedStakedToken = currStakingContract?.stakedTokens.get(poolMeta?.isNFTPool ? poolMeta.nftId : (activeToken?.address as string));
  const allowance = activeContract.getAllowanceOf(currStakingContract?.address as string)?.unscaleBy(activeToken?.decimals);
  const stakedBalance = selectedStakedToken?.nextEpochUserBalance?.unscaleBy(activeToken?.decimals);
  const walletBalance = activeContract.balance?.unscaleBy(activeToken?.decimals);
  const maxAmount = BigNumber.min(walletBalance ?? BigNumber.ZERO, allowance ?? BigNumber.ZERO);

  const nftBalance = yfPoolsCtx.yfNFTContract?.balanceOf?.[(poolMeta?.name as string)] ?? null

  function handleTokenSelect(tokenSymbol: string) {
    const tokenMeta = knownTokensCtx.getTokenBySymbol(tokenSymbol);
    setActiveToken(tokenMeta);
  }

  async function handleEnable() {
    setEnabling(true);

    try {
      await activeContract.approve(true, currStakingContract?.address!);
    } catch {}

    setEnabling(false);
  }

  function handleStake({ amount }: any) {
    setBnAmount(amount);
    setConfirmModalVisible(true);
  }

  function handleStakeCancel() {
    setConfirmModalVisible(false);
  }

  async function handleApproveNFT() {
    setStaking(true)
    try {
      await yfPoolsCtx.yfNFTContract?.approve()
      await yfPoolsCtx.yfNFTContract?.loadUserDataFor()
    } catch (e) {} finally {
      setStaking(false)
    }
  }

  async function handleStakeConfirm({ gasPrice }: any) {
    setConfirmModalVisible(false);

    let value = bnAmount;

    if (!activeToken || bnAmount.isNaN() || value.isLessThanOrEqualTo(BigNumber.ZERO)) {
      return Promise.reject();
    }

    setStaking(true);

    value = value.scaleBy(activeToken.decimals)!;
    if(!!poolMeta?.isNFTPool) {
      try {
        await yfPoolsCtx.stakingNFTContract?.stake(activeToken.address, (poolMeta.nftId as number), parseUnits(value.toString(), activeToken.decimals).toString(), gasPrice);

        setBnAmount(new BigNumber(0));
        yfPoolsCtx.stakingNFTContract?.loadCommonFor(activeToken.address, (poolMeta.nftId as number)).catch(Error);
        yfPoolsCtx.stakingNFTContract?.loadUserDataFor(activeToken.address, (poolMeta.nftId as number)).catch(Error);
      } catch (e) {}
    } else {
      try {
        await yfPoolsCtx.stakingContract?.stake(activeToken.address, value, gasPrice);

        setBnAmount(new BigNumber(0));
        yfPoolsCtx.stakingContract?.loadCommonFor(activeToken.address).catch(Error);
        yfPoolsCtx.stakingContract?.loadUserDataFor(activeToken.address).catch(Error);
      } catch (e) {}
    }

    (poolMeta?.contract as YfPoolContract).loadCommon().catch(Error);
    (poolMeta?.contract as YfPoolContract).loadUserData().catch(Error);
    activeContract.loadBalance().catch(Error);

    setStaking(false);
  }

  return (
    <>
      <div className={cn('flexbox-list p-16', s.stakeBlock)}>
        <div className="flex flow-row mr-16 sm-mr-0">
          <Text type="small" weight="500" color="secondary" className="mb-8 sm-mb-0">
            Staked balance
          </Text>
          <Tooltip title={formatUSD(convertTokenInUSD(stakedBalance, (activeToken?.symbol as string))) ?? '-'}>
            <Text type="p1" weight="semibold" color="primary">
              {formatToken(stakedBalance, {
                decimals: activeToken?.decimals,
              }) ?? '-'}
            </Text>
          </Tooltip>
        </div>
        <div className="flex flow-row">
          <Text type="small" weight="500" color="secondary" className="mb-8 sm-mb-0">
            Wallet balance
          </Text>
          <Tooltip title={formatUSD(convertTokenInUSD(walletBalance, (activeToken?.symbol as string))) ?? '-'}>
            <Text type="p1" weight="semibold" color="primary">
              {formatToken(walletBalance, {
                decimals: activeToken?.decimals,
              }) ?? '-'}
            </Text>
          </Tooltip>
        </div>
      </div>
      <Form validateTrigger={['onSubmit']} initialValues={{ amount: undefined }} onFinish={handleStake} form={form}>
        <Form.Item name="amount" rules={[{ required: true, message: 'Required' }]}>
          <TokenAmount
            tokenIcon={activeToken?.icon}
            max={maxAmount}
            maximumFractionDigits={activeToken?.decimals}
            name={activeToken?.symbol}
            displayDecimals={4}
            disabled={staking}
            slider
          />
        </Form.Item>
        {!!poolMeta?.isNFTPool && poolBalance?.isZero() && nftBalance?.isZero()
          ?(
            <Form.Item >
              <Alert
                className="mb-32"
                message={
                  <>
                    You are not eligible for liquidity mining in this pool. To participate, you need to stake in the DAO and claim NFTs from Age of Romulus.
                    {' '}
                    <a href='https://medium.com/fiat-dao/the-ludi-liquidi-are-soon-upon-us-f80955864ada' style={{ textDecoration: 'underline' }} target="_blank" rel="noopener">
                      Learn more.
                    </a>
                  </>
                }
              />
            </Form.Item>
          ) : (
            <>
              <Form.Item >
                {poolMeta?.contract.isPoolEnded === true && (
                  <>
                    <Alert
                      message={
                        <div className="flex flow-row row-gap-16 align-start">
                          <Text type="p2" weight="semibold" color="blue">
                            Deposits made after an epoch started will be considered as pro-rata figures in relation to the length
                            of the epoch.
                          </Text>
                        </div>
                      }
                      className="mb-32"
                    />
                    {activeToken?.symbol === KnownTokens.FDT && (
                      <Alert
                        className="mb-32"
                        message={
                          <div className="flex flow-row row-gap-16 align-start">
                            <Text type="p2" weight="semibold" color="blue">
                              You can still deposit {activeToken.symbol} in the DAO governance to earn interest for your funds.
                            </Text>
                            <Link to="/senatus" className="link-blue">
                              <Text type="p2" weight="bold" style={{ textDecoration: 'underline' }}>
                                Go to governance staking
                              </Text>
                            </Link>
                          </div>
                        }
                      />
                    )}
                  </>
                )}

                {poolMeta?.contract.isPoolEnded === false && (
                  <Alert
                    className="mb-32"
                    message="Deposits made after an epoch started will be considered as pro-rata figures in relation to the length of the epoch."
                  />
                )}
              </Form.Item>

              <div style={{ display: 'flex' }}>
                {!!poolMeta?.isNFTPool && !yfPoolsCtx.yfNFTContract?.isApproved
                ? (<button
                    onClick={handleApproveNFT}
                    disabled={staking}
                    type="button"
                    className="button-primary">
                    Approve NFT
                  </button>)
                  // @ts-ignore
                : (
                  <>
                    <button
                      type="submit"
                      className="button-primary"
                      disabled={
                        !allowance?.gt(BigNumber.ZERO) ||
                        staking
                      }
                    >
                      {staking && <Spin spinning />}
                      Stake
                    </button>

                    {allowance?.eq(BigNumber.ZERO) && (
                      <button
                        type="button"
                        className="button-primary"
                        disabled={enabling}
                        onClick={handleEnable}
                        style={{ marginLeft: 10 }}>
                        {enabling && <Spin spinning />}
                        Enable {activeToken?.symbol}
                      </button>
                    )}
                  </>
                  )}
              </div>
            </>
          )}

      </Form>

      {confirmModalVisible && (
        <TxConfirmModal
          title="Stake"
          header={
            <div className="mb-24">
              <div className="flex align-center justify-center pb-24">
                <Text type="h2" weight="bold" color="primary" className="mr-8">
                  {formatToken(bnAmount, {
                    decimals: activeToken?.decimals,
                  })}
                </Text>
                <Icon name={activeToken?.icon!} />
              </div>
              <Divider />
            </div>
          }
          submitText={`Confirm your stake`}
          onCancel={handleStakeCancel}
          onConfirm={handleStakeConfirm}
        />
      )}
    </>
  );
};

export default PoolStake;
