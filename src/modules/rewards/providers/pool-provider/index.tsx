import React, { useEffect } from 'react';
import BigNumber from 'bignumber.js';
import ContractListener from 'web3/components/contract-listener';
import Erc20Contract from 'web3/erc20Contract';

import config from 'config';
import { useReload } from 'hooks/useReload';
import { useWallet } from 'wallets/wallet';

import { YFPoolMeta, useYFPools } from '../pools-provider';

export type YFPoolType = {
  poolMeta?: YFPoolMeta;
  poolBalance?: BigNumber;
  effectivePoolBalance?: BigNumber;
};

const YFPoolContext = React.createContext<YFPoolType>({});

export function useYFPool(): YFPoolType {
  return React.useContext(YFPoolContext);
}

type Props = {
  poolId: string;
};

const YFPoolProvider: React.FC<Props> = props => {
  const { poolId, children } = props;

  const [reload] = useReload();
  const walletCtx = useWallet();
  const yfPoolsCtx = useYFPools();

  const pool = React.useMemo(() => yfPoolsCtx.getYFKnownPoolByName(poolId), [poolId]);

  const poolBalance = yfPoolsCtx.getPoolBalanceInUSD(poolId);
  const effectivePoolBalance = yfPoolsCtx.getPoolEffectiveBalanceInUSD(poolId);

  const value: YFPoolType = {
    poolMeta: pool,
    poolBalance,
    effectivePoolBalance,
  };

  useEffect(() => {
    if (walletCtx.account) {
      pool?.tokens.forEach(token => {
        const erc20Contract = token.contract as Erc20Contract;

        if (erc20Contract) {
          erc20Contract.setAccount(walletCtx.account);
          erc20Contract.loadBalance().then(reload).catch(Error);
          erc20Contract.loadAllowance(config.contracts.yf.staking).then(reload).catch(Error);
        }
      });
    }
  }, [pool, walletCtx.account]);

  return (
    <YFPoolContext.Provider value={value}>
      {children}
      <ContractListener contract={pool?.contract} />
    </YFPoolContext.Provider>
  );
};

export default YFPoolProvider;
