import { BigNumber, FixedNumber } from 'ethers';
import { AbiItem } from 'web3-utils';
import Web3Contract, { createAbiItem } from 'web3/web3Contract';

import prizeList from 'modules/age-of-romulus/prize';

const ABI: AbiItem[] = [
  createAbiItem('isClaimed', ['uint256'], ['bool']),
  createAbiItem('claim', ['uint256', 'address', 'uint256', 'bytes32[]']),
];

export default class ClaimAgeOfRomulus extends Web3Contract {
  isAirdropClaimed?: boolean;
  claimIndex?: number;
  claimAmount?: string;

  constructor(abi: AbiItem[], address: string, weekKey: string) {
    super([...ABI, ...abi], address, '');

    this.on(Web3Contract.UPDATE_ACCOUNT, () => {
      if (!this.account) {
        this.isAirdropClaimed = false;
        this.claimIndex = -1;
        this.claimAmount = undefined;
        this.emit(Web3Contract.UPDATE_DATA);
      }
      // @ts-ignore
      const airdropData = prizeList[weekKey];
      const airdropAccounts = airdropData.map((drop: { address: any; earnings: any }) => ({
        account: drop.address,
        amount: BigNumber.from(FixedNumber.from(drop.earnings)),
      }));
      this.claimIndex = airdropAccounts.findIndex((o: { account: string | undefined }) => o.account === this.account?.toLowerCase());

      this.claimAmount = this.claimIndex !== -1 ? this.getClaimAmount(this.account || '', airdropData) : undefined;
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
      const isClaimed = await this.call('isClaimed',[this.account]);

      console.log('isClaimed====', isClaimed);
      this.isAirdropClaimed = isClaimed;
      this.emit(Web3Contract.UPDATE_DATA);
    }
  }

  async claim(index: number | BigNumber, address: string, merkleProof: string[]): Promise<void> {
    return this.send('claim', [index, address, BigNumber.from(1), merkleProof], {
      from: this.account,
    }).then(() => {
      this.isAirdropClaimed = true;
      this.claimIndex = -1;
      this.claimAmount = undefined;
      this.emit(Web3Contract.UPDATE_DATA);
    });
  }
}
