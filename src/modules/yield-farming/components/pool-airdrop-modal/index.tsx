import React, { FC, useMemo, useState } from 'react';
import { BigNumber as _BigNumber } from 'bignumber.js';
import { BigNumber, FixedNumber } from 'ethers';
import MerkleDistributor from 'web3/merkleDistributor';
import { formatToken } from 'web3/utils';

import Button from 'components/antd/button';
import Modal, { ModalProps } from 'components/antd/modal';
import Spin from 'components/antd/spin';
import Grid from 'components/custom/grid';
import { Text } from 'components/custom/typography';
import { EnterToken } from 'components/providers/known-tokens-provider';
import config from 'config';
import BalanceTree from 'merkle-distributor/balance-tree';
import { useWallet } from 'wallets/wallet';

export type AirdropModalProps = ModalProps & {
  merkleDistributor?: MerkleDistributor;
};

const AirdropModal: FC<AirdropModalProps> = props => {
  const { merkleDistributor, ...modalProps } = props;

  const walletCtx = useWallet();

  const [claiming, setClaiming] = useState(false);

  const merkleDistributorContract = merkleDistributor;

  const tree = useMemo(() => {
    let airdropData;
    config.isDev
      ? (airdropData = require(`../../../../merkle-distributor/airdrop-test.json`))
      : (airdropData = require(`../../../../merkle-distributor/airdrop.json`));
    const airdropAccounts = airdropData.map((drop: { address: any; earnings: any }) => ({
      account: drop.address,
      amount: BigNumber.from(FixedNumber.from(drop.earnings)),
    }));

    return new BalanceTree(airdropAccounts);
  }, []);

  const claimAmount = merkleDistributorContract?.claimAmount || 0;
  const claimAmountFromJSON = BigNumber.from(FixedNumber.from(claimAmount));

  const claimIndex = merkleDistributorContract?.claimIndex || -1;
  const merkleProof =
    claimIndex !== -1
      ? tree.getProof(claimIndex || BigNumber.from(0), walletCtx.account || '', claimAmountFromJSON)
      : [];
  const adjustedAmount = _BigNumber.from(merkleDistributorContract?.adjustedAmount);

  async function claimAirdrop() {
    setClaiming(true);
    try {
      await merkleDistributorContract?.claim(
        claimIndex || BigNumber.from(0),
        merkleDistributorContract.account || '',
        claimAmountFromJSON.toString(),
        merkleProof,
      );
    } catch (e) {}

    setClaiming(false);
    props.onCancel?.();
  }

  async function cancelAirdropModal() {
    props.onCancel?.();
  }

  return (
    <Modal width={416} {...modalProps}>
      <div className="flex flow-row">
        <div className="flex flow-row mb-32">
          <Text type="h2" weight="semibold" color="primary" className="mb-8" font="secondary">
            Airdrop reward
          </Text>
          <Text type="p1" weight="500" color="secondary">
            You have claimable tokens from the $XYZ Airdrop. This balance will rise over time and as more people exit
            the pool and forfeit their additional rewards. <br></br>
            <Text type="p1" tag="span" weight="bold">
              Warning: You can only claim once!
            </Text>
          </Text>
          <br></br>
          <Text type="p1" weight="bold" color="primary" className="mb-8">
            Available to claim now: {formatToken(adjustedAmount?.unscaleBy(EnterToken.decimals))}
          </Text>
        </div>
        <Grid flow="col" justify="space-between">
          <Spin spinning={claiming === true}>
            <Button type="primary" onClick={() => claimAirdrop()}>
              Claim
            </Button>
          </Spin>
          <Button type="ghost" onClick={() => cancelAirdropModal()}>
            Cancel
          </Button>
        </Grid>
      </div>
    </Modal>
  );
};

export default AirdropModal;
