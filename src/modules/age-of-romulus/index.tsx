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
    let warningDestructor: () => void;

    if (isMobile) {
      // warningDestructor = warning.addWarn({
      //   text: 'Transactions can only be made from the desktop version using Metamask',
      //   closable: true,
      //   storageIdentity: 'bb_desktop_metamask_tx_warn',
      // });
    } else {
      warningDestructor = warning.addWarn({
        text: 'Do not send funds directly to the contract!',
        closable: true,
        storageIdentity: 'bb_send_funds_warn',
      });
    }

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
