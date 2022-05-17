import React from 'react';
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import Tabs from 'components/antd/tabs';
import ExternalLink from 'components/custom/externalLink';
import Grid from 'components/custom/grid';
import Icon from 'components/custom/icon';
import { Text } from 'components/custom/typography';
import { useWallet } from 'wallets/wallet';

import DAOProvider from './components/dao-provider';
import VotingHeader from './components/voting-header';
import OverviewView from './views/overview-view';
import ProposalCreateView from './views/proposal-create-view';
import ProposalDetailView from './views/proposal-detail-view';
import ProposalsView from './views/proposals-view';
import TreasuryView from './views/treasury-view';
import WalletView from './views/wallets-view';

import s from './s.module.scss';
import { useWarning } from 'components/providers/warning-provider';
import { isMobile } from 'react-device-detect';

type SenatusViewParams = {
  vt: string;
};

const SenatusViewInternal: React.FC = () => {
  const history = useHistory();
  const warning = useWarning();

  // React.useEffect(() => {
  //   const warningDestructor = warning.addWarn({
  //     text: 'Please note that we’re currently transitioning to a new rewards period - you will not need to restake.',
  //     closable: true,
  //     storageIdentity: 'bb_restake_warn',
  //   });
  //
  //   return () => {
  //     warningDestructor?.();
  //   };
  // }, [isMobile]);

  const {
    params: { vt = 'overview' },
  } = useRouteMatch<SenatusViewParams>();

  const wallet = useWallet();

  const [activeTab, setActiveTab] = React.useState<string>(vt);

  function handleTabChange(tabKey: string) {
    if (tabKey) {
      setActiveTab(tabKey);
      history.push(`/senatus/${tabKey}`);
    }
  }

  React.useEffect(() => {
    if (vt !== activeTab) {
      setActiveTab(vt);
    }
  }, [vt]);

  return (
    <Grid flow="row">
      {wallet.account && <VotingHeader />}

      <Tabs className={s.tabs} activeKey={activeTab} onChange={handleTabChange}>
        <Tabs.Tab
          key="overview"
          tab={
            <>
              <Icon name="bar-charts-outlined" /> Overview
            </>
          }
        />
        <Tabs.Tab
          key="wallet"
          disabled={!wallet.account}
          tab={
            <>
              <Icon name="wallet-outlined" /> Wallet
            </>
          }
        />
        <Tabs.Tab
          key="proposals"
          tab={
            <>
              <Icon name="proposal-outlined" /> Proposals
            </>
          }
        />
        {/*<Tabs.Tab*/}
        {/*  key="treasury"*/}
        {/*  tab={*/}
        {/*    <>*/}
        {/*      <Icon name="treasury-outlined" /> Treasury*/}
        {/*    </>*/}
        {/*  }*/}
        {/*/>*/}
        {/*<Tabs.Tab*/}
        {/*  key="signal"*/}
        {/*  tab={*/}
        {/*    <ExternalLink href="" style={{ color: 'inherit', position: 'relative' }}>*/}
        {/*      <Grid flow="col" gap={8} align="center">*/}
        {/*        <Icon name="chats-outlined" />*/}
        {/*        <Text type="p1" weight="semibold">*/}
        {/*          Signal*/}
        {/*        </Text>*/}
        {/*        <Icon*/}
        {/*          name="arrow-top-right"*/}
        {/*          width={8}*/}
        {/*          height={8}*/}
        {/*          style={{ position: 'absolute', top: 0, right: -12 }}*/}
        {/*        />*/}
        {/*      </Grid>*/}
        {/*    </ExternalLink>*/}
        {/*  }*/}
        {/*/>*/}
      </Tabs>

      <div className="content-container-fix content-container">
        <Switch>
          <Route path="/senatus/overview" exact component={OverviewView} />
          <Route path="/senatus/wallet/:action(\w+)" component={WalletView} />
          <Redirect from="/senatus/wallet" to="/senatus/wallet/deposit" />
          <Route path="/senatus/treasury/:tab(\w+)" exact component={TreasuryView} />
          <Redirect from="/senatus/treasury" to="/senatus/treasury/holdings" />
          <Route path="/senatus/proposals/create" exact component={ProposalCreateView} />
          <Route path="/senatus/proposals/:id(\d+)" exact component={ProposalDetailView} />
          <Route path="/senatus/proposals" exact component={ProposalsView} />
          <Redirect from="/senatus" to="/senatus/overview" />
        </Switch>
      </div>
    </Grid>
  );
};

const SenatusView: React.FC = props => {
  return (
    <DAOProvider>
      <SenatusViewInternal>{props.children}</SenatusViewInternal>
    </DAOProvider>
  );
};

export default SenatusView;
