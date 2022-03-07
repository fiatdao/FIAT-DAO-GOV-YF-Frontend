import React, { Suspense, lazy } from 'react';
import { isMobile } from 'react-device-detect';
import { Redirect, Route, Switch } from 'react-router-dom';
import AntdSpin from 'antd/lib/spin';

import { useWarning } from 'components/providers/warning-provider';

import YFPoolsProvider from './providers/pools-provider';

const PoolsView = lazy(() => import('./views/pools-view'));
const PoolView = lazy(() => import('./views/pool-view'));

const RewardsView: React.FC = () => {
  const warning = useWarning();

  React.useEffect(() => {
    let warningDestructor: () => void;

    if (isMobile) {
      // warningDestructor = warning.addWarn({
      //   text: 'Transactions can only be made from the desktop version using Metamask',
      //   closable: true,
      //   storageIdentity: 'bb_desktop_metamask_tx_warn',
      // });
    } else {
      warningDestructor = warning.addWarn({
        text: 'Please note that we’re currently transitioning to a new rewards period - you will not need to restake.',
        closable: true,
        storageIdentity: 'bb_restake_warn',
      });
    }

    return () => {
      warningDestructor?.();
    };
  }, [isMobile]);

  return (
    <YFPoolsProvider>
      <Suspense fallback={<AntdSpin />}>
        <Switch>
          <Route path="/rewards" exact component={PoolsView} />
          <Route path="/rewards/:poolId" exact component={PoolView} />
          <Redirect to="/rewards" />
        </Switch>
      </Suspense>
    </YFPoolsProvider>
  );
};

export default RewardsView;
