import React from 'react';
import { isMobile } from 'react-device-detect';

import { Text } from 'components/custom/typography';
import DaoCard from 'modules/governance/components/dao-card';
import DAOProvider from 'modules/governance/components/dao-provider';
import PoolCard from 'modules/yield-farming/components/pool-card';
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
      {!isMobile && walletCtx.isActive && <PoolRewards />}
      <div className="content-container-fix content-container">
        <PoolStats className="mb-64" />
        <Text type="h1" weight="bold" color="primary" className="mb-16" font="secondary">
          Pools
        </Text>
        <Text type="p1" weight="semibold" color="secondary" className="mb-32">
          Overview
        </Text>
        <div className={s.poolCards}>
          <DAOProvider>
            <DaoCard />
          </DAOProvider>
          <PoolCard poolId={YFPoolID.USDC_XYZ_SLP} />
          <PoolCard poolId={YFPoolID.XYZ} />
          <PoolCard poolId={YFPoolID.MANA} />
          <PoolCard poolId={YFPoolID.SAND} />
          {/* <PoolCard poolId={YFPoolID.SUSHI} /> */}
          <PoolCard poolId={YFPoolID.ILV} />
          <PoolCard poolId={YFPoolID.AXS} />
          <PoolCard poolId={YFPoolID.BOND} />
          <PoolCard poolId={YFPoolID.SNX} />
        </div>
        <PoolTransactions />
      </div>
    </>
  );
};

export default PoolsView;
