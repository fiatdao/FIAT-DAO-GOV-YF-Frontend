import { BigNumber, FixedNumber } from 'ethers';
import { BigNumber as _BigNumber } from 'bignumber.js';
import { AbiItem } from 'web3-utils';
import Web3Contract, { createAbiItem } from 'web3/web3Contract';

import config from 'config';

import { fetchAirdropClaims, fetchAirdropTotal } from '../modules/rewards/api';
import add from 'date-fns/add';
import differenceInCalendarWeeks from 'date-fns/differenceInCalendarWeeks';
import BalanceTree from '../merkle-distributor/balance-tree';

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
  totalInfo?: {
    totalFDTAirdropClaimed: string;
    totalFDTAirdropRedistributed: string;
  };
  adjustedAmount?: {
    airdropAmount: string;
    bonus: string;
    bonusPart: string;
  };
  bonusStart?: string;
  airdropDurationInWeeks: number;
  airdropCurrentWeek?: number;
  airdropData?: any;
  tree?: any;

  constructor(abi: AbiItem[], address: string) {
    super([...ABI, ...abi], address, '');
    this.airdropDurationInWeeks = 100;

    config.web3.chainId === 4
      ? (this.airdropData = require(`../merkle-distributor/airdrop-test.json`))
      : (this.airdropData = require(`../merkle-distributor/airdrop.json`));

    this.on(Web3Contract.UPDATE_ACCOUNT, () => {
      if (!this.account) {
        this.isAirdropClaimed = false;
        this.claimIndex = -1;
        this.claimAmount = undefined;
        this.totalAirdropped = undefined;
        this.totalInfo = undefined;
        this.adjustedAmount = undefined;
        this.bonusStart = undefined;
        this.airdropCurrentWeek = undefined;
        this.tree = undefined;
        this.emit(Web3Contract.UPDATE_DATA);
      }

      const airdropAccounts = this.airdropData.map((drop: { address: any; earnings: any }) => ({
        account: drop.address.toLowerCase(),
        amount: BigNumber.from(FixedNumber.from(drop.earnings)),
      }));
      this.tree = new BalanceTree(airdropAccounts)
      this.totalAirdropped =  this.airdropData.reduce((acc: _BigNumber, curr: { earnings: string }) => acc.plus(new _BigNumber(curr.earnings)), new _BigNumber(0))
      this.claimIndex = airdropAccounts.findIndex((o: { account: string | undefined }) => o.account?.toLowerCase() === this.account?.toLowerCase());
      this.claimAmount = this.claimIndex !== -1 ? this.getClaimAmount(this.account?.toLowerCase() || '') : undefined;
      this.adjustedAmount = undefined;
      this.bonusStart = undefined;
    });
  }



  getClaimAmount(address: string,): string | undefined {
    return this.airdropData.find((e: { address: string; }) => e.address === address)?.earnings;
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

    this.totalInfo = await fetchAirdropTotal()

    this.bonusStart = bonusStart;

    const airdropStartDate = new Date(Number(this.bonusStart ?? 0) * 1000);
    const airdropEndDate = add(airdropStartDate, { weeks: this.airdropDurationInWeeks });
    this.airdropCurrentWeek =
      this.airdropDurationInWeeks -
      differenceInCalendarWeeks(new Date(airdropEndDate), new Date() > airdropEndDate ? airdropEndDate : new Date());

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

  async claim(): Promise<void> {
    const merkleProof = this.tree.getProof(this.claimIndex, this.account?.toLowerCase(), BigNumber.from(FixedNumber.from(this.claimAmount)))
    return this.send('claim', [this.claimIndex, this.account?.toLowerCase(), BigNumber.from(FixedNumber.from(this.claimAmount)), merkleProof], {
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
