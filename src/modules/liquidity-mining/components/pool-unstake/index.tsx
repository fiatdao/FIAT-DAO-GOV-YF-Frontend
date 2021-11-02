import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import AntdForm from 'antd/lib/form';
import cn from 'classnames';
import TxConfirmModal from 'web3/components/tx-confirm-modal';
import Erc20Contract from 'web3/erc20Contract';
import { formatNumber, formatToken, formatUSD } from 'web3/utils';

import Form from 'components/antd/form';
import Alert from 'components/antd/alert';
import Spin from 'components/antd/spin';
import Tooltip from 'components/antd/tooltip';
import Divider from 'components/antd/divider';
import Icon from 'components/custom/icon';
import TokenAmount from 'components/custom/token-amount';
import { Text } from 'components/custom/typography';
import { KnownTokens, convertTokenInUSD, useKnownTokens } from 'components/providers/known-tokens-provider';
import { YfPoolContract } from 'modules/liquidity-mining/contracts/yfPool';

import { useYFPool } from '../../providers/pool-provider';
import { useYFPools } from '../../providers/pools-provider';

import s from './s.module.scss';

type UnStakeFormData = {
  amount?: BigNumber;
};

const PoolUnstake: FC = () => {
  const knownTokensCtx = useKnownTokens();
  const yfPoolsCtx = useYFPools();
  const yfPoolCtx = useYFPool();

  const [activeToken, setActiveToken] = useState(yfPoolCtx.poolMeta?.tokens[0]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [unstaking, setUnstaking] = useState(false);
  const [bnAmount, setBnAmount] = useState(new BigNumber(0));

  const [form] = AntdForm.useForm<UnStakeFormData>();

  const { poolMeta } = yfPoolCtx;
  const activeContract = activeToken?.contract as Erc20Contract;

  if (!poolMeta || !activeToken) {
    return null;
  }

  const selectedStakedToken = yfPoolsCtx.stakingContract?.stakedTokens.get(activeToken.address);
  const stakedBalance = selectedStakedToken?.nextEpochUserBalance?.unscaleBy(activeToken.decimals);
  const walletBalance = activeContract.balance?.unscaleBy(activeToken.decimals);
  const maxAmount = stakedBalance ?? BigNumber.ZERO;
  // const bnAmount = BigNumber.from(amount);

  function handleTokenSelect(tokenSymbol: string) {
    const tokenMeta = knownTokensCtx.getTokenBySymbol(tokenSymbol);
    setActiveToken(tokenMeta);
  }

  function handleUnstake({ amount }: any) {
    setBnAmount(amount)
    setConfirmModalVisible(true);
  }

  function handleUnstakeCancel() {
    setConfirmModalVisible(false);
  }

  async function handleUnstakeConfirm({ gasPrice }: any) {
    setConfirmModalVisible(false);

    let value = bnAmount;

    if (!activeToken || value.isNaN() || value.isLessThanOrEqualTo(BigNumber.ZERO)) {
      return Promise.reject();
    }

    setUnstaking(true);

    value = value.scaleBy(activeToken.decimals)!;

    try {
      await yfPoolsCtx.stakingContract?.unstake(activeToken.address, value, gasPrice);

      setBnAmount(new BigNumber(0));
      yfPoolsCtx.stakingContract?.loadCommonFor(activeToken.address).catch(Error);
      yfPoolsCtx.stakingContract?.loadUserDataFor(activeToken.address).catch(Error);
      (poolMeta?.contract as YfPoolContract).loadCommon().catch(Error);
      (poolMeta?.contract as YfPoolContract).loadUserData().catch(Error);
      activeContract.loadBalance().catch(Error);
    } catch (e) {}

    setUnstaking(false);
  }

  return (
    <>
      <div className={cn('flexbox-list p-16', s.stakeBlock)}>
        <div className="flex flow-row mr-16">
          <Text type="small" weight="500" color="secondary" className="mb-8">
            Staked balance
          </Text>
          <Tooltip title={formatUSD(convertTokenInUSD(stakedBalance, activeToken.symbol)) ?? '-'}>
            <Text type="p1" weight="semibold" color="primary">
              {formatToken(stakedBalance, {
                decimals: activeToken.decimals,
              }) ?? '-'}
            </Text>
          </Tooltip>
        </div>
        <div className="flex flow-row">
          <Text type="small" weight="500" color="secondary" className="mb-8">
            Wallet balance
          </Text>
          <Tooltip title={formatUSD(convertTokenInUSD(walletBalance, activeToken.symbol)) ?? '-'}>
            <Text type="p1" weight="semibold" color="primary">
              {formatToken(walletBalance, {
                decimals: activeToken.decimals,
              }) ?? '-'}
            </Text>
          </Tooltip>
        </div>
      </div>
      <Form
        validateTrigger={['onSubmit']}
        initialValues={{ amount: undefined }}
        onFinish={handleUnstake}
        form={form}>
        <Form.Item name="amount" rules={[{ required: true, message: 'Required' }]}>
          <TokenAmount
            tokenIcon={activeToken.icon}
            max={maxAmount}
            maximumFractionDigits={activeToken.decimals}
            name={activeToken.symbol}
            displayDecimals={4}
            disabled={unstaking}
            slider
          />
        </Form.Item>
        <Form.Item >
          {poolMeta.contract.isPoolEnded === true && (
            <>
              <Alert
                message={
                  <div className="flex flow-row row-gap-16 align-start">
                    <Text type="p2" weight="semibold" color="blue">
                      Any funds withdrawn before the end of this epoch will not accrue any rewards for this epoch.
                    </Text>
                  </div>
                }
                className="mb-32"
              />
              {activeToken.symbol === KnownTokens.FDT && (
                <Alert
                  className="mb-32"
                  message={
                    <div className="flex flow-row row-gap-16 align-start">
                      <Text type="p2" weight="semibold" color="blue">
                        You can still deposit {KnownTokens.FDT} in the DAO governance to earn interest for your funds.
                      </Text>
                      <Link to="/governance" className="link-blue">
                        <Text type="p2" weight="bold" className="text-underline">
                          Go to governance staking
                        </Text>
                      </Link>
                    </div>
                  }
                />
              )}
            </>
          )}

          {poolMeta.contract.isPoolEnded === false && (
            <Alert
              className="mb-32"
              message="Any funds withdrawn before the end of this epoch will not accrue any rewards for this epoch."
            />
          )}
        </Form.Item>
        <button
          type="submit"
          className="button-primary"
          disabled={unstaking}>
          {unstaking && <Spin spinning />}
          Unstake
        </button>
      </Form>

      {confirmModalVisible && (
        <TxConfirmModal
          title="Unstake"
          header={
           <div className="mb-24">
             <div className="flex align-center justify-center pb-24">
               <Text type="h2" weight="bold" color="primary" className="mr-8">
                 {formatToken(bnAmount, {
                   decimals: activeToken.decimals,
                 })}
               </Text>
               <Icon name={activeToken.icon!} />
             </div>
             <Divider />
           </div>
          }
          submitText={`Confirm your unstake`}
          onCancel={handleUnstakeCancel}
          onConfirm={handleUnstakeConfirm}
        />
      )}
    </>
  );
};

export default PoolUnstake;
