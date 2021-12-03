import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import AntdSpin from 'antd/lib/spin';
import cn from 'classnames';

import ErrorBoundary from 'components/custom/error-boundary';
import { useGeneral } from 'components/providers/general-provider';
import WarningProvider from 'components/providers/warning-provider';
import LayoutFooter from 'layout/components/layout-footer';
import LayoutHeader from 'layout/components/layout-header';

import YFPoolsProvider from 'modules/rewards/providers/pools-provider';

import ThemeSwitcher from './components/theme-switcher';

import s from './s.module.scss';

// const PlugView = lazy(() => import('modules/plug'));
const RewardsView = lazy(() => import('modules/rewards'));
const AirdropView = lazy(() => import('modules/rewards/views/airdrop'));
const SenatusView = lazy(() => import('modules/senatus'));
const AgeOfRomulusView = lazy(() => import('modules/age-of-romulus'));

const AirdropPage = () => (
  <YFPoolsProvider>
    <AirdropView />
  </YFPoolsProvider>
)

const LayoutView: React.FC = () => {
  const { isDarkTheme } = useGeneral();
  return (
    <div className={s.layout}>
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <div className={s.bg}>
         <div className={cn(s.bg__gradient, { [s.bg__gradient__light]: !isDarkTheme, [s.bg__gradient__dark]: isDarkTheme  })} />
        </div>
        <div className={s.wrapper}>
          <WarningProvider>
            <LayoutHeader />
            <main className={cn(s.main)}>
              <ErrorBoundary>
                <Suspense fallback={<AntdSpin className="pv-24 ph-64" style={{ width: '100%' }} />}>
                  <Switch>

                    {/*<Route path="/" component={PlugView} />*/}
                    <Route path="/airdrop" component={AirdropPage} />
                    <Route path="/rewards" component={RewardsView} />
                    <Route path="/senatus/:vt(\w+)" component={SenatusView} />
                    <Route path="/senatus" component={SenatusView} />
                    <Route path="/age-of-romulus" component={AgeOfRomulusView} />
                    {/*<Redirect from="/airdrop" to="/rewards" />*/}
                    <Redirect from="/" to="/rewards" />
                  </Switch>
                </Suspense>
              </ErrorBoundary>
            </main>
            <LayoutFooter />
            <ThemeSwitcher />
          </WarningProvider>
        </div>
      </div>
    </div>
  );
};

export default LayoutView;
