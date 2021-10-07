import BigNumber from 'bignumber.js';
import { AbiItem } from 'web3-utils';
import Web3Contract, { createAbiItem } from 'web3/web3Contract';

const ABI: AbiItem[] = [
  createAbiItem('name', [], ['string']),
  createAbiItem('symbol', [], ['string']),
  createAbiItem('tokenURI', ['uint256'], ['string']),
  createAbiItem('tokenOfOwnerByIndex', ['address', 'uint256'], ['uint256']),
  createAbiItem('tokenByIndex', ['uint256'], ['uint256']),
  createAbiItem('ownerOf', ['uint256'], ['address']),
  createAbiItem('totalSupply', [], ['uint256']),
  createAbiItem('maxSupply', [], ['uint256']),
  createAbiItem('balanceOf', ['address'], ['uint256']),
  createAbiItem('approve', ['address', 'uint256'], ['bool']),
  createAbiItem('mint', [], []),
  createAbiItem('bulkBuy', ['uint256'], []),
  createAbiItem('metapassPrice', [], ['uint256']),
];

export default class MetapassErc721Contract extends Web3Contract {
  symbol?: string;

  totalSupply?: BigNumber;

  maxSupply?: BigNumber;

  metapassPrice?: BigNumber;

  constructor(abi: AbiItem[], address: string) {
    super([...ABI, ...abi], address, '');

    this.on(Web3Contract.UPDATE_ACCOUNT, () => {
      if (!this.account) {
        this.emit(Web3Contract.UPDATE_DATA);
      }
    });
  }

  loadCommon(): Promise<void> {
    return this.batch([
      {
        method: 'name',
      },
      {
        method: 'symbol',
      },
      {
        method: 'totalSupply',
        transform: value => new BigNumber(value),
      },
      {
        method: 'maxSupply',
        transform: value => new BigNumber(value),
      },
      {
        method: 'metapassPrice',
        transform: value => new BigNumber(value),
      },
    ]).then(([name, symbol, totalSupply, maxSupply, metapassPrice]) => {
      this.name = name;
      this.symbol = symbol;
      this.maxSupply = maxSupply;
      this.totalSupply = totalSupply;
      this.metapassPrice = metapassPrice;
      this.emit(Web3Contract.UPDATE_DATA);
    });
  }

  mint(): Promise<void> {
    if (!this.account) {
      return Promise.reject();
    }
    return this.send('mint', [], {
      from: this.account,
      value: this.metapassPrice,
    }).then();
  }

  bulkBuy(amount: Number): Promise<void> {
    if (!this.account) {
      return Promise.reject();
    }
    return this.send('mint', [amount], {
      from: this.account,
      value: this.metapassPrice,
    }).then();
  }
}
