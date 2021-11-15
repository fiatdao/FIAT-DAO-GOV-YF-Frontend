import React from 'react';
import { isMobile } from 'react-device-detect';

import { Text } from 'components/custom/typography';
import DaoCard from 'modules/senatus/components/dao-card';
import DAOProvider from 'modules/senatus/components/dao-provider';
import PoolCard from 'modules/rewards/components/pool-card';
import { useWallet } from 'wallets/wallet';

import PoolRewards from '../../components/pool-rewards';
import PoolStats from '../../components/pool-stats';
import PoolTransactions from '../../components/pool-transactions';
import { YFPoolID } from '../../providers/pools-provider';

import s from './s.module.scss';

const PoolsView: React.FC = () => {
  const walletCtx = useWallet();

  return (
    <>
      {walletCtx.isActive && <PoolRewards />}
      <div className="content-container-fix content-container">
        <PoolStats className="mb-64 sm-mb-24" />
        <Text type="h1" weight="bold" color="primary" className="mb-16 sm-mb-4" font="secondary">
          Pools
        </Text>
        <Text type="p1" weight="semibold" color="secondary" className="mb-32 sm-mb-24">
          Overview
        </Text>
        <div className={s.poolCards}>
          <DAOProvider>
            <DaoCard />
          </DAOProvider>
          {/*<PoolCard poolId={YFPoolID.ETH_FDT_SLP} />*/}
          <PoolCard poolId={YFPoolID.sOHM_FDT_SLP} />
          <PoolCard poolId={YFPoolID.BOND} />
          <PoolCard poolId={YFPoolID.UMA} />
          <PoolCard poolId={YFPoolID.MKR} />
          <PoolCard poolId={YFPoolID.YFI} />
          <PoolCard poolId={YFPoolID.RGT} />
          <PoolCard poolId={YFPoolID.wsOHM} />
        </div>
        <PoolTransactions />
      </div>
    </>
  );
};

export default PoolsView;
