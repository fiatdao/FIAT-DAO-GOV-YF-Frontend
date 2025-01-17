import React from 'react';

import Modal, { ModalProps } from 'components/antd/modal';
import Grid from 'components/custom/grid';
import { Text } from 'components/custom/typography';
import { useEthWeb3 } from 'components/providers/eth-web3-provider';
import { useWallet } from 'wallets/wallet';

export type UnsupportedChainModalProps = ModalProps;

const UnsupportedChainModal: React.FC<UnsupportedChainModalProps> = props => {
  const { ...modalProps } = props;

  const ethWeb3 = useEthWeb3();
  const wallet = useWallet();

  return (
    <Modal width={568} {...modalProps}>
      <Grid flow="row" gap={24} align="start">
        <Grid flow="row" gap={16}>
          <Text type="h2" weight="bold" color="primary">
            Wrong network
          </Text>
          <Text type="p1" weight="semibold" color="secondary">
            Please switch your wallet network to {ethWeb3.networkName ?? '<!>'} to use the app
          </Text>
          <Text type="p1" color="secondary">
            If you still encounter problems, you may want to switch to a different wallet
          </Text>
        </Grid>

        <button
          type="button"
          className="button-ghost"
          onClick={() => {
            props.onCancel?.();
            wallet.showWalletsModal();
          }}>
          <span>Switch wallet</span>
        </button>
      </Grid>
    </Modal>
  );
};

export default UnsupportedChainModal;
