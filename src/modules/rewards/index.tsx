import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import AntdSpin from 'antd/lib/spin';

import YFPoolsProvider from './providers/pools-provider';

const PoolsView = lazy(() => import('./views/pools-view'));
const PoolView = lazy(() => import('./views/pool-view'));

const RewardsView: React.FC = () => {

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
