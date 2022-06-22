import BigNumber from 'bignumber.js';
import { AbiItem } from 'web3-utils';
import Web3Contract, { createAbiItem } from 'web3/web3Contract';
import { MaxUint256 } from '@ethersproject/constants'

const ABI: AbiItem[] = [
  createAbiItem('name', [], ['string']),
  createAbiItem('symbol', [], ['string']),
  createAbiItem('decimals', [], ['uint8']),
  createAbiItem('totalSupply', [], ['uint256']),
  createAbiItem('balanceOf', ['address'], ['uint256']),
  createAbiItem('allowance', ['address', 'address'], ['uint256']),
  createAbiItem('approve', ['address', 'uint256'], ['bool']),
];

export default class Erc20Contract extends Web3Contract {
  symbol?: string;

  decimals?: number;

  totalSupply?: BigNumber;

  private balances: Map<string, BigNumber>;

  private allowances: Map<string, BigNumber>;

  constructor(abi: AbiItem[], address: string) {
    super([...ABI, ...abi], address, '');

    this.balances = new Map<string, BigNumber>();
    this.allowances = new Map<string, BigNumber>();

    this.on(Web3Contract.UPDATE_ACCOUNT, () => {
      if (!this.account) {
        this.balances.clear();
        this.allowances.clear();
        this.emit(Web3Contract.UPDATE_DATA);
      }
    });
  }

  get balance(): BigNumber | undefined {
    if (!this.account) {
      return undefined;
    }

    return this.balances.get(this.account);
  }

  // get allowance(): BigNumber | undefined {
  //   if (!this.account) {
  //     return undefined;
  //   }
  //
  //   return this.allowances.get(this.account);
  // }

  // get isAllowed(): boolean | undefined {
  //   return this.allowance?.gt(BigNumber.ZERO);
  // }

  // get maxAllowed(): BigNumber | undefined {
  //   if (!this.balance || !this.allowance) {
  //     return undefined;
  //   }
  //
  //   return BigNumber.min(this.balance, this.allowance);
  // }

  getBalanceOf(address: string): BigNumber | undefined {
    return this.balances.get(address);
  }

  getAllowanceOf(address: string): BigNumber | undefined {
    return this.allowances.get(address);
  }

  isAllowedOf(address: string): boolean | undefined {
    return this.allowances.get(address)?.gt(BigNumber.ZERO);
  }

  maxAllowedOf(address: string): BigNumber | undefined {
    const balance = this.getBalanceOf(address);
    const allowance = this.getAllowanceOf(address);

    if (!balance || !allowance) {
      return undefined;
    }

    return BigNumber.min(balance, allowance);
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
        method: 'decimals',
        transform: value => Number(value),
      },
      {
        method: 'totalSupply',
        transform: value => new BigNumber(value),
      },
    ]).then(([name, symbol, decimals, totalSupply]) => {
      this.name = name;
      this.symbol = symbol;
      this.decimals = decimals;
      this.totalSupply = totalSupply;
      this.emit(Web3Contract.UPDATE_DATA);
    });
  }

  async loadBalance(address?: string): Promise<void> {
    const addr = address ?? this.account;

    if (!addr) {
      return;
    }

    return this.call('balanceOf', [addr]).then(value => {
      this.balances.set(addr, new BigNumber(value));
      this.emit(Web3Contract.UPDATE_DATA);
    });
  }

  async loadAllowance(spenderAddress: string, address?: string): Promise<void> {
    const addr = address ?? this.account;

    if (!addr) {
      return;
    }

    return this.call('allowance', [addr, spenderAddress]).then(value => {
      this.allowances.set(spenderAddress, new BigNumber(value));
      this.emit(Web3Contract.UPDATE_DATA);
    });
  }

  approve(enable: boolean, spenderAddress: string): Promise<void> {
    if (!this.account) {
      return Promise.reject();
    }

    const value = enable ? MaxUint256 : BigNumber.ZERO;

    return this.send('approve', [spenderAddress, value], {
      from: this.account,
    }).then(() => this.loadAllowance(spenderAddress));
  }
}
