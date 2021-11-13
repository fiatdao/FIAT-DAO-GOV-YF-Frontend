import React from 'react';
import * as Antd from 'antd';
import cn from 'classnames';
import { ZERO_BIG_NUMBER } from 'web3/utils';

import Alert from 'components/antd/alert';
import Form from 'components/antd/form';
import GasFeeList from 'components/custom/gas-fee-list';
import Grid from 'components/custom/grid';
import Icon from 'components/custom/icon';
import TokenInput from 'components/custom/token-input';
import { Text } from 'components/custom/typography';
import useMergeState from 'hooks/useMergeState';

import TokenAmount from '../../../../components/custom/token-amount';
import { FDTToken } from '../../../../components/providers/known-tokens-provider';
import { useDAO } from '../../components/dao-provider';

import { isValidAddress } from 'utils';

import s from './s.module.scss';

type DelegateFormData = {
  delegateAddress?: string;
  gasPrice?: {
    value: number;
  };
};

const InitialFormValues: DelegateFormData = {
  delegateAddress: undefined,
  gasPrice: undefined,
};

type WalletDelegateViewState = {
  saving: boolean;
};

const InitialState: WalletDelegateViewState = {
  saving: false,
};

const WalletDelegateView: React.FC = () => {
  const [form] = Antd.Form.useForm<DelegateFormData>();

  const daoCtx = useDAO();
  const [state, setState] = useMergeState<WalletDelegateViewState>(InitialState);

  const { balance: stakedBalance, userDelegatedTo, userLockedUntil } = daoCtx.daoComitium;
  const isDelegated = isValidAddress(userDelegatedTo);
  const isLocked = (userLockedUntil ?? 0) > Date.now();
  const hasStakedBalance = stakedBalance?.gt(ZERO_BIG_NUMBER);
  const formDisabled = !hasStakedBalance;

  React.useEffect(() => {
    form.setFieldsValue({
      delegateAddress: isValidAddress(userDelegatedTo) ? userDelegatedTo : undefined,
    });
  }, [userDelegatedTo]);

  async function handleSubmit(values: DelegateFormData) {
    const { delegateAddress, gasPrice } = values;

    if (!delegateAddress || !gasPrice) {
      return;
    }

    setState({ saving: true });

    try {
      if (delegateAddress !== userDelegatedTo) {
        await daoCtx.daoComitium.actions.delegate(delegateAddress, gasPrice.value);
      } else {
        await daoCtx.daoComitium.actions.stopDelegate(gasPrice.value);
      }

      form.setFieldsValue(InitialFormValues);
      daoCtx.daoComitium.reload();
    } catch {}

    setState({ saving: false });
  }

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
            Current Voting Type
          </Text>
          <Text type="p1" weight="semibold" color="primary">
            {isDelegated ? 'Delegate voting' : 'Manual voting'}
          </Text>
        </Grid>

        {isDelegated && (
          <Grid flow="row" gap={4}>
            <Text type="small" weight="500" color="secondary">
              Delegated Address
            </Text>
            <Text type="p1" weight="semibold" color="primary">
              {userDelegatedTo}
            </Text>
          </Grid>
        )}

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
              <Form.Item
                name="delegateAddress"
                label="Delegate address"
                rules={[{ required: true, message: 'Required' }]}>
                <TokenInput
                  addonBefore={<Icon name={FDTToken.icon!} width={27} height={27} />}
                  disabled={formDisabled || state.saving}
                />
              </Form.Item>
              <Alert message="Delegating your voting power to this address means that they will be able to vote in your place. You can’t delegate the voting bonus, only the staked balance." />
              {isLocked && (
                <Alert message="Switching back to manual voting while a lock is active will put the amount back under lock. Delegation does not stop the lock timer." />
              )}
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
          <Form.Item shouldUpdate>
            {({ getFieldsValue }) => {
              const { delegateAddress } = getFieldsValue();

              return (
                <button
                  type="submit"
                  className="button-primary"
                  disabled={state.saving || !delegateAddress}
                  style={{ justifySelf: 'start' }}>
                  {userDelegatedTo === delegateAddress ? 'Stop Delegate' : 'Delegate'}
                </button>
              );
            }}
          </Form.Item>
        </Grid>
      </Form>
    </div>
  );
};

export default WalletDelegateView;
