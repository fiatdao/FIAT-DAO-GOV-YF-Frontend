import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import AntdSpin from 'antd/lib/spin';

import ErrorBoundary from 'components/custom/error-boundary';
import WarningProvider from 'components/providers/warning-provider';
import LayoutFooter from 'layout/components/layout-footer';
import LayoutHeader from 'layout/components/layout-header';

import ThemeSwitcher from './components/theme-switcher';

import s from './s.module.scss';

const PlugView = lazy(() => import('modules/plug'));
const RewardsView = lazy(() => import('modules/rewards'));
const SenatusView = lazy(() => import('modules/senatus'));

const LayoutView: React.FC = () => {
  return (
    <div className={s.layout}>
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <WarningProvider>
          <LayoutHeader />
          <main className={s.main}>
            <ErrorBoundary>
              <Suspense fallback={<AntdSpin className="pv-24 ph-64" style={{ width: '100%' }} />}>
                <Switch>
                  {/*<Route path="/" component={PlugView} />*/}
                  <Route path="/rewards" component={RewardsView} />
                  <Route path="/senatus/:vt(\w+)" component={SenatusView} />
                  <Route path="/senatus" component={SenatusView} />
                  <Redirect from="/" to="/liquidity-mining" />
                </Switch>
              </Suspense>
            </ErrorBoundary>
          </main>
          <LayoutFooter />
          <ThemeSwitcher />
        </WarningProvider>
      </div>
    </div>
  );
};

export default LayoutView;
