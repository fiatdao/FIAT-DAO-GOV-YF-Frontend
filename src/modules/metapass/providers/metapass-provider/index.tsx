import React, { FC, createContext, useContext, useEffect, useMemo } from 'react';
import ContractListener from 'web3/components/contract-listener';
import Web3Contract from 'web3/web3Contract';

import config from 'config';
import { useReload } from 'hooks/useReload';
import { useWallet } from 'wallets/wallet';

import MetapassErc721Contract from '../../contracts/MetapassErc721Contract';

export type MetapassType = {
  metapassContract?: MetapassErc721Contract;
};

const MetapassContext = createContext<MetapassType>({
  metapassContract: undefined,
});

export function useMetapass(): MetapassType {
  return useContext(MetapassContext);
}

const MetapassProvider: FC = props => {
  const { children } = props;

  const walletCtx = useWallet();
  const [reload] = useReload();

  const metapassContract = useMemo(() => {
    const metapasContract = new MetapassErc721Contract([], config.contracts.metapassContract);
    metapasContract.on(Web3Contract.UPDATE_DATA, reload);
    return metapasContract;
  }, []);

  useEffect(() => {
    metapassContract.setProvider(walletCtx.provider);
    console.log(metapassContract);
  }, [walletCtx.provider]);

  useEffect(() => {
    metapassContract.setAccount(walletCtx.account);
    metapassContract.loadCommon().catch(Error);
  }, [walletCtx.account]);

  const value: MetapassType = {
    metapassContract,
  };

  return (
    <MetapassContext.Provider value={value}>
      {children}
      <ContractListener contract={metapassContract} />
    </MetapassContext.Provider>
  );
};

export default MetapassProvider;
