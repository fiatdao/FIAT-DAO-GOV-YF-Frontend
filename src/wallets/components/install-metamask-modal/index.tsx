import React from 'react';

// import Button from 'components/antd/button';
import Modal, { ModalProps } from 'components/antd/modal';
import Grid from 'components/custom/grid';
import { Text } from 'components/custom/typography';

const METAMASK_CHROME_EXT_URL = 'https://metamask.io/';

const InstallMetaMaskModal: React.FC<ModalProps> = props => {
  const { ...modalProps } = props;

  return (
    <Modal width={568} {...modalProps}>
      <Grid flow="row" gap={24}>
        <Grid flow="row" gap={16}>
          <Text type="h2" weight="bold" color="primary">
            Install MetaMask
          </Text>
          <Text type="p1" weight="semibold" color="secondary">
            You need to have{' '}
            <Text type="p1" tag="span" weight="bold" color="primary">
              MetaMask
            </Text>{' '}
            installed to continue.
            <br />
            Once you have installed it, please{' '}
            <button className="button-text" onClick={() => document.location.reload()}>
              refresh the page
            </button>
          </Text>
        </Grid>
        <Grid flow="col" justify="space-between">
          <button type="button" onClick={props.onCancel} className="button-ghost">
            <span>Go Back</span>
          </button>
          <a href={METAMASK_CHROME_EXT_URL} rel="noopener noreferrer" target="_blank">
            <button type="button" className="button-primary">
              Install MetaMask
            </button>
          </a>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default InstallMetaMaskModal;
