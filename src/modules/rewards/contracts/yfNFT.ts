import BigNumber from 'bignumber.js';
import { AbiItem } from 'web3-utils';
import Web3Contract, { createAbiItem } from 'web3/web3Contract';

import config from 'config';

import { YFPoolNFTID } from '../providers/pools-provider';

const ABI: AbiItem[] = [
  createAbiItem('balanceOf', ['address', 'uint256'], ['uint256']),
  createAbiItem('isApprovedForAll', ['address', 'address'], ['bool']),
  createAbiItem('setApprovalForAll', ['address', 'bool'], []),
];

export class YfNFTContract extends Web3Contract {
  constructor(nftAddress: string) {
    super(ABI, nftAddress, 'YF NFT');

    this.balanceOf = null
    this.isApproved = null

    this.on(Web3Contract.UPDATE_ACCOUNT, () => {
      this.balanceOf = null
      this.isApproved = null;
      this.emit(Web3Contract.UPDATE_DATA);
    });
  }

  balanceOf: { [key: string]: BigNumber; } | null

  isApproved: boolean | null;

  async loadUserDataFor(): Promise<void> {
    const account = this.account;

    this.assertAccount();

    const [balanceOfAmphora, balanceOfKithara, balanceOfGalea, balanceOfGladius,balanceOfCorona, isApproved] = await this.batch([
      { method: 'balanceOf', methodArgs: [account, 1] },
      { method: 'balanceOf', methodArgs: [account, 2] },
      { method: 'balanceOf', methodArgs: [account, 3] },
      { method: 'balanceOf', methodArgs: [account, 4] },
      { method: 'balanceOf', methodArgs: [account, 5] },
      { method: 'isApprovedForAll', methodArgs: [account, config.contracts.yf.stakingNFT] }
    ]);

    this.balanceOf = {
      [YFPoolNFTID.gOHM_FDT_SLP_Amphora]: new BigNumber(balanceOfAmphora),
      [YFPoolNFTID.gOHM_FDT_SLP_Kithara]: new BigNumber(balanceOfKithara),
      [YFPoolNFTID.gOHM_FDT_SLP_Galea]: new BigNumber(balanceOfGalea),
      [YFPoolNFTID.gOHM_FDT_SLP_Gladius]: new BigNumber(balanceOfGladius),
      [YFPoolNFTID.gOHM_FDT_SLP_Corona]: new BigNumber(balanceOfCorona),
    };

    this.isApproved = isApproved;

    this.emit(Web3Contract.UPDATE_DATA);
  }

  async approve(gasPrice?: number): Promise<BigNumber> {
    return this.send('setApprovalForAll', [config.contracts.yf.stakingNFT, true], {}, gasPrice);
  }
}
