import { BigNumber, FixedNumber } from 'ethers';
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
        account: drop.address,
        amount: BigNumber.from(FixedNumber.from(drop.earnings)),
      }));
      this.tree = airdropAccounts.length && new BalanceTree(airdropAccounts)
      this.claimAmount = BigNumber.from(1);
      if (!this.account) {
        this.isClaimed = false;
        this.claimIndex = -1;
        this.emit(Web3Contract.UPDATE_DATA);
      }

      this.claimIndex = airdropAccounts.findIndex((o: { account: string | undefined }) => o.account === this.account?.toLowerCase());
      // @ts-ignore
      // this.claimAmount = this.claimIndex !== -1 ? this.getClaimAmount(this.account?.toLowerCase(), airdropData) : undefined;
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
      this.isClaimed =  await this.call('isClaimed',[this.account]);
      this.emit(Web3Contract.UPDATE_DATA);
    }
  }

  async claim(): Promise<void> {
    try{
      console.log('claimIndex===', this.claimIndex);
      console.log('account===', this.account?.toLowerCase());
      console.log('this.claimAmount===', this.claimAmount?.toString());
      const merkleProof = this.tree.getProof(this.claimIndex, this.account?.toLowerCase(), this.claimAmount)
      console.log('merkleProof', merkleProof);
    } catch (e) {
      console.log('e===', e);
    }
    // return this.send('claim',
    //   [this.claimIndex, this.account?.toLowerCase(), this.claimAmount, merkleProof], {
    //   from: this.account,
    // }).then(() => {
    //   this.isClaimed = true;
    //   this.claimIndex = -1;
    //   this.claimAmount = undefined;
    //   this.emit(Web3Contract.UPDATE_DATA);
    // });
  }
}
