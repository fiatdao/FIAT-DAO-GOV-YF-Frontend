import React from 'react';
import { getEtherscanTxUrl } from 'web3/utils';
import { Web3SendState } from 'web3/web3Contract';

import Button from 'components/antd/button';
import Modal, { ModalProps } from 'components/antd/modal';
import ExternalLink from 'components/custom/externalLink';
import Icon from 'components/custom/icon';
import { Text } from 'components/custom/typography';

type Props = ModalProps & {
  state?: Web3SendState;
  txHash?: string;
  renderProgress?: () => React.ReactNode;
  renderSuccess?: () => React.ReactNode;
};

const TxStatusModal: React.FC<Props> = props => {
  const { state, txHash, renderProgress, renderSuccess, ...modalProps } = props;

  return (
    <Modal width={560} title="Transaction status" {...modalProps}>
      <div className="grid flow-row pv-8 ph-8">
        {state === 'progress' && (
          <>
            <Icon name="png/tx-progress" width={240} height={200} className="mb-32 mh-auto" />
            <Text type="h3" weight="semibold" color="primary" className="mb-16 text-center">
              Your transaction is being processed ...
            </Text>
            <div className="mb-64">{renderProgress?.()}</div>
            <ExternalLink href={getEtherscanTxUrl(txHash)} className="button-primary full-width">
              View on Etherscan
            </ExternalLink>
          </>
        )}
        {state === 'success' && (
          <>
            <Icon name="png/tx-success" width={240} height={200} className="mb-32 mh-auto" />
            <Text type="h3" weight="semibold" color="primary" className="mb-16 text-center">
              Congratulations!
            </Text>
            <Text type="small" weight="semibold" color="secondary" className="mb-16 text-center">
              Your transaction was successful.
            </Text>
            {renderSuccess?.()}
          </>
        )}
        {state === 'fail' && (
          <>
            <Icon name="png/tx-failure" width={240} height={200} className="mb-32 mh-auto" />
            <Text type="h3" weight="semibold" color="primary" className="mb-16 text-center">
              Failed!
            </Text>
            <Text type="small" weight="semibold" color="secondary" className="mb-64 text-center">
              Your transaction failed to execute.
              <br />
              Please try again.
            </Text>
            <Button htmlType="submit" type="primary" onClick={props?.onCancel}>
              Dismiss
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default TxStatusModal;
