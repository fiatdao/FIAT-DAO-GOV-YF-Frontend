import React from 'react';

import Button from 'components/antd/button';
import Modal, { ModalProps } from 'components/antd/modal';
import Grid from 'components/custom/grid';
import { IconWallet } from 'components/custom/icon-wallet';
import { Text } from 'components/custom/typography';
import { useGeneral } from 'components/providers/general-provider';
import useMergeState from 'hooks/useMergeState';
import LedgerDerivationPathModal from 'wallets/components/ledger-deriviation-path-modal';
import { CoinbaseWalletArgs } from 'wallets/connectors/coinbase';
import { WalletConnectors, useWallet } from 'wallets/wallet';

import s from './s.module.scss';

import { WalletConnector } from 'wallets/types';

export type ConnectWalletModalProps = ModalProps;

type ConnectWalletModalState = {
  showLedgerModal: boolean;
};

const InitialState: ConnectWalletModalState = {
  showLedgerModal: false,
};

const ConnectWalletModal: React.FC<ConnectWalletModalProps> = props => {
  const { ...modalProps } = props;

  const { isDarkTheme } = useGeneral();
  const wallet = useWallet();
  const [state, setState] = useMergeState<ConnectWalletModalState>(InitialState);

  function handleConnectorSelect(connector: WalletConnector) {
    if (wallet.isActive) {
      return;
    }

    if (connector.id === 'ledger') {
      setState({
        showLedgerModal: true,
      });
      return;
    }

    let args = {};

    if (connector.id === 'coinbase') {
      args = {
        darkMode: isDarkTheme,
      } as CoinbaseWalletArgs;
    }

    wallet.connect(connector, args).catch(Error);
  }

  return (
    <Modal width={568} {...modalProps}>
      <Grid flow="row" gap={40}>
        <Grid flow="row" gap={24}>
          <Text type="h1" weight="bold" color="primary" align="center">
            Select Wallet
          </Text>
          <Text type="p1" color="secondary" align="center">
            Please pick a wallet to connect to EnterDAO
          </Text>
        </Grid>

        <Grid gap={24} colsTemplate="repeat(auto-fit, minmax(120px, 240px))">
          {WalletConnectors.map(connector => (
            <Button
              key={connector.id}
              type="select"
              className={s.button}
              style={{ height: '96px' }}
              onClick={() => handleConnectorSelect(connector)}>
              <IconWallet wallet={connector.id} style={{ maxHeight: 32 }} className={s.walletIcon} />
            </Button>
          ))}
        </Grid>

        <Grid flow="row">
          <Text type="p1" color="secondary" align="center">
            We do not own your private keys and cannot access your funds without your confirmation.
          </Text>
        </Grid>
      </Grid>

      {state.showLedgerModal && (
        <LedgerDerivationPathModal
          onCancel={() => {
            setState({ showLedgerModal: false });
          }}
        />
      )}
    </Modal>
  );
};

export default ConnectWalletModal;
