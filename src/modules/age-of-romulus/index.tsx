import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import AntdSpin from 'antd/lib/spin';

import AgeOfRomulusProvider from './providers/age-of-romulus-providers';

const AgeOfRomulusView = lazy(() => import('./views/age-of-romulus'));

const AgeOfRomulusViewPage: React.FC = () => {
  return (
    <AgeOfRomulusProvider>
      <Suspense fallback={<AntdSpin />}>
        <Switch>
          <Route path="/age-of-romulus" exact component={AgeOfRomulusView} />
          <Redirect to="/age-of-romulus" />
        </Switch>
      </Suspense>
    </AgeOfRomulusProvider>
  );
};

export default AgeOfRomulusViewPage;
