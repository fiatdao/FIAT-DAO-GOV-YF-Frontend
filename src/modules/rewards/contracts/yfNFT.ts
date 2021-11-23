import BigNumber from 'bignumber.js';
import { AbiItem } from 'web3-utils';
import Web3Contract, { createAbiItem } from 'web3/web3Contract';

import config from 'config';

const ABI: AbiItem[] = [
  createAbiItem('balanceOf', ['address', 'uint256'], ['uint256']),
  createAbiItem('isApprovedForAll', ['address', 'address'], ['bool']),
  createAbiItem('setApprovalForAll', ['address', 'bool'], []),
];

export class YfNFTContract extends Web3Contract {
  constructor(nftAddress: string) {
    super(ABI, nftAddress, 'YF NFT');

    this.balanceOfAmphora = null
    this.balanceOfKithara = null
    this.balanceOfGalea = null
    this.balanceOfGladius = null
    this.balanceOfCorona = null
    this.isApproved = null

    this.on(Web3Contract.UPDATE_ACCOUNT, () => {
      this.balanceOfAmphora = null
      this.balanceOfKithara = null
      this.balanceOfGalea = null
      this.balanceOfGladius = null
      this.balanceOfCorona = null
      this.isApproved = null;
      this.emit(Web3Contract.UPDATE_DATA);
    });
  }

  balanceOfAmphora: BigNumber | null;
  balanceOfKithara: BigNumber | null;
  balanceOfGalea: BigNumber | null;
  balanceOfGladius: BigNumber | null;
  balanceOfCorona: BigNumber | null;
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

    this.balanceOfAmphora = new BigNumber(balanceOfAmphora);
    this.balanceOfKithara = new BigNumber(balanceOfKithara);
    this.balanceOfGalea = new BigNumber(balanceOfGalea);
    this.balanceOfGladius = new BigNumber(balanceOfGladius);
    this.balanceOfCorona = new BigNumber(balanceOfCorona);
    this.isApproved = isApproved;

    this.emit(Web3Contract.UPDATE_DATA);
  }

  async approve(gasPrice: number): Promise<BigNumber> {
    return this.send('setApprovalForAll', [config.contracts.yf.stakingNFT, true], {}, gasPrice);
  }
}
