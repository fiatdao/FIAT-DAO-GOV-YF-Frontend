import { BigNumber } from 'ethers';
import { AbiItem } from 'web3-utils';
import Web3Contract, { createAbiItem } from 'web3/web3Contract';

import prizeList from 'modules/age-of-romulus/prize';
import BalanceTree from 'merkle-distributor/balance-tree';

const ABI: AbiItem[] = [
  createAbiItem('isClaimed', ['uint256'], ['bool']),
  createAbiItem('claim', ['uint256', 'address', 'uint256', 'bytes32[]']),
];

export default class ClaimAgeOfRomulus extends Web3Contract {
  isClaimed?: boolean;
  claimIndex?: number;
  claimAmount?: BigNumber;
  tree?: any;

  constructor(abi: AbiItem[], address: string, weekKey: string) {
    super([...ABI, ...abi], address, '');

    this.on(Web3Contract.UPDATE_ACCOUNT, () => {
      // @ts-ignore
      const airdropData = prizeList[weekKey];
      const airdropAccounts = airdropData.map((drop: { address: any; earnings: any }) => ({
        account: drop.address.toLowerCase(),
        amount: BigNumber.from(1),
      }));
      this.tree = airdropAccounts.length && new BalanceTree(airdropAccounts)
      this.claimAmount = BigNumber.from(1);
      if (!this.account) {
        this.isClaimed = false;
        this.claimIndex = -1;
        this.emit(Web3Contract.UPDATE_DATA);
      }

      this.claimIndex = airdropAccounts.findIndex((o: { account: string | undefined }) => o.account === this.account?.toLowerCase());
    });
  }

  getClaimAmount(address: string, airdropData: any[]): string | undefined {
    return airdropData.find(e => e.address === address.toLowerCase())?.earnings;
  }

  async loadUserData(): Promise<void> {
    const account = this.account;

    if (!account) {
      return;
    }

    if (this.claimAmount !== null && this.claimIndex !== -1) {
      this.isClaimed =  await this.call('isClaimed',[this.claimIndex]);
      this.emit(Web3Contract.UPDATE_DATA);
    }
  }

  async claim(): Promise<void> {
    const merkleProof = this.tree.getProof(this.claimIndex, this.account?.toLowerCase(), this.claimAmount)
    return this.send('claim',
      [this.claimIndex, this.account?.toLowerCase(), this.claimAmount, merkleProof], {
      from: this.account,
    }).then(() => {
      this.isClaimed = true;
      this.claimIndex = -1;
      this.claimAmount = undefined;
      this.emit(Web3Contract.UPDATE_DATA);
    });
  }
}
