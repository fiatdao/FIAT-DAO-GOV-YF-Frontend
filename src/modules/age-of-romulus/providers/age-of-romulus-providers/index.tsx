import React, { FC, createContext, useContext, useEffect, useMemo } from 'react';
import ContractListener from 'web3/components/contract-listener';

import Web3Contract from 'web3/web3Contract';

import config from 'config';
import { useReload } from 'hooks/useReload';
import { useWallet } from 'wallets/wallet';

import ClaimAgeOfRomulus from '../../cotracts/claimAgeOfRomulus';

export enum ActiveKeys {
  amphora = 'amphora',
  kithara = 'kithara',
  galea = 'galea',
  gladius = 'gladius',
  corona = 'corona',
}

export type AgeOfRomulusType = {
  ACTIVE_KEY: ActiveKeys;
  amphora?: ClaimAgeOfRomulus;
  kithara?: ClaimAgeOfRomulus;
  galea?: ClaimAgeOfRomulus;
  gladius?: ClaimAgeOfRomulus;
  corona?: ClaimAgeOfRomulus;
};

export const ACTIVE_KEY: ActiveKeys = ActiveKeys.kithara;

const AgeOfRomulusContext = createContext<AgeOfRomulusType>({
  ACTIVE_KEY,
  amphora: undefined,
  kithara: undefined,
  galea: undefined,
  gladius: undefined,
  corona: undefined,
});

export function useAgeOfRomulus(): AgeOfRomulusType {
  return useContext(AgeOfRomulusContext);
}


const AgeOfRomulusProvider: FC = props => {
  const { children } = props;

  const walletCtx = useWallet();
  const [reload] = useReload();

  const merkleDistributorAmphora = useMemo(() => {
    const merkleDistributorAmphora = new ClaimAgeOfRomulus([], config.contracts.merkleDistributorAmphora, ActiveKeys.amphora);
    merkleDistributorAmphora.on(Web3Contract.UPDATE_DATA, reload);

    return merkleDistributorAmphora;
  }, []);

  const merkleDistributorKithara = useMemo(() => {
    const merkleDistributorKithara = new ClaimAgeOfRomulus([], config.contracts.merkleDistributorKithara, ActiveKeys.kithara);
    merkleDistributorKithara.on(Web3Contract.UPDATE_DATA, reload);

    return merkleDistributorKithara;
  }, []);

  const merkleDistributorGalea = useMemo(() => {
    const merkleDistributorGalea = new ClaimAgeOfRomulus([], config.contracts.merkleDistributorGalea, ActiveKeys.galea);
    merkleDistributorGalea.on(Web3Contract.UPDATE_DATA, reload);

    return merkleDistributorGalea;
  }, []);

  const merkleDistributorGladius = useMemo(() => {
    const merkleDistributorGladius = new ClaimAgeOfRomulus([], config.contracts.merkleDistributorGladius, ActiveKeys.gladius);
    merkleDistributorGladius.on(Web3Contract.UPDATE_DATA, reload);

    return merkleDistributorGladius;
  }, []);

  const merkleDistributorCorona = useMemo(() => {
    const merkleDistributorCorona = new ClaimAgeOfRomulus([], config.contracts.merkleDistributorCorona, ActiveKeys.corona);
    merkleDistributorCorona.on(Web3Contract.UPDATE_DATA, reload);

    return merkleDistributorCorona;
  }, []);


  useEffect(() => {
    merkleDistributorAmphora.setProvider(walletCtx.provider);

    merkleDistributorKithara.setProvider(walletCtx.provider);

    merkleDistributorGalea.setProvider(walletCtx.provider);

    merkleDistributorGladius.setProvider(walletCtx.provider);

    merkleDistributorCorona.setProvider(walletCtx.provider);
  }, [walletCtx.provider]);

  useEffect(() => {
    merkleDistributorAmphora.setAccount(walletCtx.account);
    merkleDistributorAmphora.loadUserData().catch(Error);

    merkleDistributorKithara.setAccount(walletCtx.account);
    merkleDistributorKithara.loadUserData().catch(Error);

    merkleDistributorGalea.setAccount(walletCtx.account);
    merkleDistributorGalea.loadUserData().catch(Error);

    merkleDistributorGladius.setAccount(walletCtx.account);
    merkleDistributorGladius.loadUserData().catch(Error);

    merkleDistributorCorona.setAccount(walletCtx.account);
    merkleDistributorCorona.loadUserData().catch(Error);
  }, [walletCtx.account]);

  const value: AgeOfRomulusType = {
    ACTIVE_KEY,
    amphora:  merkleDistributorAmphora,
    kithara:  merkleDistributorKithara,
    galea:  merkleDistributorGalea,
    gladius:  merkleDistributorGladius,
    corona:  merkleDistributorCorona,
  };
  return (
    <AgeOfRomulusContext.Provider value={value}>
      {children}
      <ContractListener contract={merkleDistributorAmphora} />
    </AgeOfRomulusContext.Provider>
  );
};

export default AgeOfRomulusProvider;
