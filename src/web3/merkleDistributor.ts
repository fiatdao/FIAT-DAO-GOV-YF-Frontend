import { BigNumber, FixedNumber } from 'ethers';
import { BigNumber as _BigNumber } from 'bignumber.js';
import { AbiItem } from 'web3-utils';
import Web3Contract, { createAbiItem } from 'web3/web3Contract';

import config from 'config';

const ABI: AbiItem[] = [
  createAbiItem('isClaimed', ['uint256'], ['bool']),
  createAbiItem('claim', ['uint256', 'address', 'uint256', 'bytes32[]']),
  createAbiItem('calculateAdjustedAmount', ['uint256'], ['uint256', 'uint256', 'uint256']),
  createAbiItem('bonusStart', [], ['uint256']),
];

export default class MerkleDistributor extends Web3Contract {
  isAirdropClaimed?: boolean;
  claimIndex?: number;
  claimAmount?: string;
  totalAirdropped?: _BigNumber;
  adjustedAmount?: {
    airdropAmount: string;
    bonus: string;
    bonusPart: string;
  };
  bonusStart?: string;

  constructor(abi: AbiItem[], address: string) {
    super([...ABI, ...abi], address, '');

    this.on(Web3Contract.UPDATE_ACCOUNT, () => {
      if (!this.account) {
        this.isAirdropClaimed = false;
        this.claimIndex = -1;
        this.claimAmount = undefined;
        this.totalAirdropped = undefined;
        this.adjustedAmount = undefined;
        this.bonusStart = undefined;
        this.emit(Web3Contract.UPDATE_DATA);
      }
      let airdropData;
      config.web3.chainId === 4
        ? (airdropData = require(`../merkle-distributor/airdrop-test.json`))
        : (airdropData = require(`../merkle-distributor/airdrop.json`));
      const airdropAccounts = airdropData.map((drop: { address: any; earnings: any }) => ({
        account: drop.address.toLowerCase(),
        amount: BigNumber.from(FixedNumber.from(drop.earnings)),
      }));
      this.totalAirdropped =  airdropData.reduce((acc: _BigNumber, curr: { earnings: string }) => acc.plus(new _BigNumber(curr.earnings)), new _BigNumber(0))
      this.claimIndex = airdropAccounts.findIndex((o: { account: string | undefined }) => o.account?.toLowerCase() === this.account?.toLowerCase());
      this.claimAmount = this.claimIndex !== -1 ? this.getClaimAmount(this.account?.toLowerCase() || '', airdropData) : undefined;
      this.adjustedAmount = undefined;
      this.bonusStart = undefined;
    });
  }



  getClaimAmount(address: string, airdropData: any[]): string | undefined {
    return airdropData.find(e => e.address === address)?.earnings;
  }

  async loadUserData(): Promise<void> {
    const account = this.account;

    if (!account) {
      return;
    }

    const amount = BigNumber.from(FixedNumber.from(this.claimAmount));

    const [ bonusStart] = await this.batch([
      { method: 'bonusStart', methodArgs: [], callArgs: { from: account } },
    ]);

    this.bonusStart = bonusStart;

    if (this.claimAmount !== null && this.claimIndex !== -1) {
      const [isClaimed, adjustedAmount] = await this.batch([
        { method: 'isClaimed', methodArgs: [this.claimIndex], callArgs: { from: account } },
        { method: 'calculateAdjustedAmount', methodArgs: [amount], callArgs: { from: account } },
      ]);

      this.isAirdropClaimed = isClaimed;
      this.adjustedAmount = {
        airdropAmount: adjustedAmount[0],
        bonus: adjustedAmount[1],
        bonusPart: adjustedAmount[2]
      };

      this.emit(Web3Contract.UPDATE_DATA);
    }
  }

  async claim(index: number | BigNumber, address: string, amount: string, merkleProof: string[]): Promise<void> {
    return this.send('claim', [this.claimIndex, this.account?.toLowerCase(), amount, merkleProof], {
      from: this.account,
    }).then(() => {
      this.isAirdropClaimed = true;
      this.claimIndex = -1;
      this.claimAmount = undefined;
      this.adjustedAmount = undefined;
      this.bonusStart = undefined;
      this.emit(Web3Contract.UPDATE_DATA);
    });
  }
}
