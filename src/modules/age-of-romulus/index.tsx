import React, { Suspense, lazy } from 'react';
import { isMobile } from 'react-device-detect';
import { Redirect, Route, Switch } from 'react-router-dom';
import AntdSpin from 'antd/lib/spin';

import { useWarning } from 'components/providers/warning-provider';

import AgeOfRomulusProvider from './providers/age-of-romulus-providers';

const AgeOfRomulusView = lazy(() => import('./views/age-of-romulus'));

const AgeOfRomulusViewPage: React.FC = () => {
  const warning = useWarning();

  React.useEffect(() => {
    const warningDestructor = warning.addWarn({
      text: 'Please note that we’re currently transitioning to a new rewards period - you will not need to restake.',
      closable: true,
      storageIdentity: 'bb_restake_warn',
    });

    return () => {
      warningDestructor?.();
    };
  }, [isMobile]);

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
