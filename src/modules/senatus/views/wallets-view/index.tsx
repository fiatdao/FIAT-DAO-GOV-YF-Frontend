import React from 'react';
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import Tabs from 'components/antd/tabs';
import Grid from 'components/custom/grid';
import { Text } from 'components/custom/typography';
import WalletDelegateView from 'modules/senatus/views/wallet-delegate-view';
import WalletDepositView from 'modules/senatus/views/wallet-deposit-view';
import WalletLockView from 'modules/senatus/views/wallet-lock-view';
import WalletWithdrawView from 'modules/senatus/views/wallet-withdraw-view';
import { useWallet } from 'wallets/wallet';

type WalletViewRouteParams = {
  action: string;
};

const WalletView: React.FC = () => {
  const history = useHistory();
  const wallet = useWallet();
  const {
    params: { action = 'deposit' },
  } = useRouteMatch<WalletViewRouteParams>();
  const [activeTab, setActiveTab] = React.useState<string>(action);

  function handleTabChange(tabKey: string) {
    setActiveTab(tabKey);
    history.push(`/senatus/wallet/${tabKey}`);
  }

  React.useEffect(() => {
    if (action !== activeTab) {
      setActiveTab(action);
    }
  }, [action]);

  if (!wallet.initialized) {
    return null;
  }

  if (!wallet.isActive) {
    return <Redirect to="/senatus/overview" />;
  }

  return (
    <Grid flow="row" gap={32}>
      <Text type="h2" weight="bold" color="primary" font="secondary">
        Wallet
      </Text>
      <Tabs activeKey={activeTab} simple onChange={handleTabChange}>
        <Tabs.Tab key="deposit" tab="Deposit" />
        <Tabs.Tab key="lock" tab="Lock" />
        <Tabs.Tab key="delegate" tab="Delegate" />
        <Tabs.Tab key="withdraw" tab="Withdraw" />
      </Tabs>
      <Switch>
        <Route path="/senatus/wallet/deposit" exact component={WalletDepositView} />
        <Route path="/senatus/wallet/lock" exact component={WalletLockView} />
        <Route path="/senatus/wallet/delegate" exact component={WalletDelegateView} />
        <Route path="/senatus/wallet/withdraw" exact component={WalletWithdrawView} />
        <Redirect from="/senatus/wallet" to="/senatus/wallet/deposit" />
      </Switch>
    </Grid>
  );
};

export default WalletView;
