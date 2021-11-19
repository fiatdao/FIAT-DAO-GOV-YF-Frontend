import React from 'react';
import { isMobile } from 'react-device-detect';
import cn from 'classnames';

import Modal, { ModalProps } from 'components/antd/modal';

import { Text } from '../../../../components/custom/typography';
import iconNotConnect from '../../../../resources/svg/not-connected.svg';
import { useWallet } from '../../../../wallets/wallet';

import s from './s.module.scss';

const NotConnectedModal: React.FC<ModalProps> = props => {
  const wallet = useWallet();
  const { ...modalProps } = props;

  return (
    <Modal width={524} className={s.modal} {...modalProps}>
      <div className="flex flow-row align-center">
        <img src={iconNotConnect} width={48} height={64} className="mb-32" alt="" />
        <Text tag="p" type="p2" color="primary" className="mb-32">
          Wallet not connected: To check your rank, <br />
          connect your wallet below
        </Text>
        <button
          type="button"
          className={cn('button-primary', { 'button-small': isMobile })}
          onClick={() => wallet.showWalletsModal()}>
          <span>Connect {!isMobile && 'wallet'}</span>
        </button>
      </div>
    </Modal>
  );
};

export default NotConnectedModal;
