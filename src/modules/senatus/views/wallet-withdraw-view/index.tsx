import React, { useMemo } from 'react';
import * as Antd from 'antd';
import BigNumber from 'bignumber.js';
import { ZERO_BIG_NUMBER, formatEntrValue } from 'web3/utils';

import Alert from 'components/antd/alert';
import Button from 'components/antd/button';
import Form from 'components/antd/form';
import GasFeeList from 'components/custom/gas-fee-list';
import Grid from 'components/custom/grid';
import Icon from 'components/custom/icon';
import TokenAmount from 'components/custom/token-amount';
import { Text } from 'components/custom/typography';
import { FDTToken } from 'components/providers/known-tokens-provider';
import useMergeState from 'hooks/useMergeState';

import Erc20Contract from '../../../../web3/erc20Contract';
import { useDAO } from '../../components/dao-provider';
import { RewardsID } from '../../contracts/daoReward';
import cn from 'classnames';

import s from './s.module.scss';
import { useReload } from '../../../../hooks';

type WithdrawFormData = {
  amount?: BigNumber;
  gasPrice?: {
    value: number;
  };
};

const InitialFormValues: WithdrawFormData = {
  amount: undefined,
  gasPrice: undefined,
};

type WalletWithdrawViewState = {
  saving: boolean;
};

const InitialState: WalletWithdrawViewState = {
  saving: false,
};

const WalletWithdrawView: React.FC = () => {
  const daoCtx = useDAO();
  const [_, version] = useReload();
  const [form] = Antd.Form.useForm<WithdrawFormData>();

  const [state, setState] = useMergeState<WalletWithdrawViewState>(InitialState);

  const { balance: stakedBalance, userLockedUntil } = daoCtx.daoComitium;
  const fdtBalance = (FDTToken.contract as Erc20Contract).balance?.unscaleBy(FDTToken.decimals);
  const isLocked = (userLockedUntil ?? 0) > Date.now();
  const hasStakedBalance = stakedBalance?.gt(ZERO_BIG_NUMBER);
  const formDisabled = !hasStakedBalance || isLocked;

  async function handleSubmit(values: WithdrawFormData) {
    const { amount, gasPrice } = values;

    if (!amount || !gasPrice) {
      return;
    }

    setState({ saving: true });

    try {
      await daoCtx.daoComitium.actions.withdraw(amount, gasPrice.value);
      form.setFieldsValue(InitialFormValues);
      daoCtx.daoComitium.reload();
      (FDTToken.contract as Erc20Contract).loadBalance().catch(Error);
    } catch {}

    setState({ saving: false });
  }

  const isDisabled = useMemo((): boolean => {
    const firstDao = daoCtx.daoReward.rewards.find(({ name }) => name ===  RewardsID.First);
    console.log('firstDao', firstDao?.claimValue);
    console.log('!firstDao?.claimValue?.isZero()', firstDao?.claimValue?.isZero());
    return !firstDao?.claimValue?.isZero();
  }, [version]);

  console.log('isDisabled', isDisabled);

  return (
    <div className={cn('card', s.card)}>
      <Grid gap={24} className={cn('card-header', s.cardHeader)}>
        <Grid flow="col" gap={12} align="center">
          <Icon name="png/fiat-dao" width={27} height={27} />
          <Text type="p1" weight="semibold" color="primary">
            {FDTToken.symbol}
          </Text>
        </Grid>

        <Grid flow="row" gap={4}>
          <Text type="small" weight="500" color="secondary">
            Staked Balance
          </Text>
          <Text type="p1" weight="semibold" color="primary">
            {formatEntrValue(stakedBalance)}
          </Text>
        </Grid>

        <Grid flow="row" gap={4}>
          <Text type="small" weight="500" color="secondary">
            Wallet Balance
          </Text>
          <Text type="p1" weight="semibold" color="primary">
            {formatEntrValue(fdtBalance)}
          </Text>
        </Grid>

        <div className={s.empty} />
      </Grid>
      <Form
        className="p-24"
        form={form}
        initialValues={InitialFormValues}
        validateTrigger={['onSubmit']}
        onFinish={handleSubmit}>
        <Grid flow="row" gap={32}>
          <Grid className={s.cardCont}>
            <Grid flow="row" gap={32}>
              <Form.Item name="amount" label="Amount" rules={[{ required: true, message: 'Required' }]}>
                <TokenAmount
                  tokenIcon={FDTToken.icon}
                  name={FDTToken.symbol}
                  max={stakedBalance}
                  maximumFractionDigits={FDTToken.decimals}
                  displayDecimals={4}
                  disabled={formDisabled || state.saving}
                  slider
                />
              </Form.Item>
              <Alert message="Locked balances are not available for withdrawal until the timer ends. Withdrawal means you will stop earning staking rewards for the amount withdrawn." />
            </Grid>
            <Grid flow="row">
              <Form.Item
                name="gasPrice"
                label="Gas Fee (Gwei)"
                hint="This value represents the gas price you're willing to pay for each unit of gas. Gwei is the unit of ETH typically used to denominate gas prices and generally, the more gas fees you pay, the faster the transaction will be mined."
                rules={[{ required: true, message: 'Required' }]}>
                <GasFeeList disabled={state.saving} />
              </Form.Item>
            </Grid>
          </Grid>
          <button
            type="submit"
            className="button-primary"
            disabled={isDisabled || state.saving || formDisabled}
            style={{ justifySelf: 'start' }}>
            Withdraw
          </button>
        </Grid>
      </Form>
    </div>
  );
};

export default WalletWithdrawView;
