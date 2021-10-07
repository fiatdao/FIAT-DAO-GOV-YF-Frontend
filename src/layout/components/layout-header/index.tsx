import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import ReactDOM from 'react-dom';
import { usePopper } from 'react-popper';
import { Link, useRouteMatch } from 'react-router-dom';
import cn from 'classnames';

import Button from 'components/antd/button';
import Divider from 'components/antd/divider';
import Popover from 'components/antd/popover';
import Tooltip from 'components/antd/tooltip';
import ExternalLink from 'components/custom/externalLink';
import Grid from 'components/custom/grid';
import Icon from 'components/custom/icon';
import { Text } from 'components/custom/typography';
import { useGeneral } from 'components/providers/general-provider';
import { EnterToken } from 'components/providers/known-tokens-provider';
import { useWarning } from 'components/providers/warning-provider';
import ConnectedWallet from 'wallets/components/connected-wallet';
import { MetamaskConnector } from 'wallets/connectors/metamask';
import { useWallet } from 'wallets/wallet';

import s from './s.module.scss';

const modalRoot = document.getElementById('modal-root') || document.body;

const LayoutHeader: React.FC = () => {
  const { navOpen, setNavOpen, toggleDarkTheme, isDarkTheme } = useGeneral();
  const [referenceElement, setReferenceElement] = useState<any>();
  const [popperElement, setPopperElement] = useState<any>();
  const [popper1visible, setPopper1visible] = useState<boolean>(false);
  const [popper2visible, setPopper2visible] = useState<boolean>(false);
  const [popper3visible, setPopper3visible] = useState<boolean>(false);
  const [popper4visible, setPopper4visible] = useState<boolean>(false);
  const [popper5visible, setPopper5visible] = useState<boolean>(false);
  const wallet = useWallet();
  const { warns } = useWarning();

  const { styles, attributes, forceUpdate, state } = usePopper(referenceElement, popperElement, {
    placement: 'bottom',
    strategy: 'absolute',
  });

  useEffect(() => {
    forceUpdate?.();
  }, [warns.length]);

  useEffect(() => {
    if (navOpen && window.innerWidth > 768) {
      setNavOpen(false);
    }
  }, [window.innerWidth]);

  const isGovernancePage = useRouteMatch('/governance');

  async function handleAddProjectToken() {
    if (wallet.connector?.id === 'metamask') {
      try {
        const connector = new MetamaskConnector({ supportedChainIds: [] });
        await connector.addToken({
          type: 'ERC20',
          options: {
            address: EnterToken.address,
            symbol: EnterToken.symbol,
            decimals: EnterToken.decimals,
            image: `${window.location.origin}/enterdao.png`,
          },
        });
      } catch (e) {
        console.error(e);
      }
    }
  }

  return (
    <div className={s.component} ref={setReferenceElement}>
      <ExternalLink href="https://enterdao.xyz/" target="_self">
        <Icon name="png/enterdao" width="auto" height="auto" className={s.logo} />
      </ExternalLink>
      <div className={s.titleDelimiter} />
      <h1 className={s.title}>{isGovernancePage ? 'Governance' : 'Yield Farming'}</h1>

      <nav className={s.nav}>
        <Popover
          noPadding
          visible={popper5visible}
          trigger={['click', 'hover']}
          onVisibleChange={setPopper5visible}
          content={
            <div className={cn('card', s.dropdown)}>
              <Link to="/metapass" className={s.dropdownLink} onClick={() => setPopper5visible(false)}>
                <span>MetaPass</span>
              </Link>
            </div>
          }>
          <Button type="link" className={s.navLink}>
            <Grid flow="col" align="center">
              <Text type="p1" weight="500" color="primary" className="mr-4">
                NFT Drops
              </Text>
              <Icon name="dropdown-arrow" width={12} height={12} className={s.dropdownArrow} />
            </Grid>
          </Button>
        </Popover>
        <Popover
          visible={popper2visible}
          onVisibleChange={setPopper2visible}
          trigger={['click', 'hover']}
          noPadding
          content={
            <div className={cn('card', s.dropdown)}>
              <ExternalLink
                href="https://medium.com/enterdao/enterdao-whitepaper-27447f7400c8"
                className={s.dropdownLink}
                onClick={() => setPopper2visible(false)}>
                <Icon name="whitepaper" width={20} height={20} className={s.dropdownIcon} />
                <span>Whitepaper</span>
              </ExternalLink>
              <ExternalLink
                href="https://enterdao.xyz/team"
                className={s.dropdownLink}
                onClick={() => setPopper2visible(false)}>
                <Icon name="team" width={20} height={20} className={s.dropdownIcon} />
                <span>Team</span>
              </ExternalLink>
              <ExternalLink
                href="https://docs.enterdao.xyz/"
                className={s.dropdownLink}
                onClick={() => setPopper3visible(false)}>
                <Icon name="docs" width={20} height={20} className={s.dropdownIcon} />
                <span>Docs</span>
              </ExternalLink>
            </div>
          }>
          <Button type="link" className={s.navLink}>
            <Grid flow="col" align="center">
              <Text type="p1" weight="500" color="primary" className="mr-4">
                Info
              </Text>
              <Icon name="dropdown-arrow" width={12} height={12} className={s.dropdownArrow} />
            </Grid>
          </Button>
        </Popover>
        <Popover
          noPadding
          visible={popper3visible}
          trigger={['click', 'hover']}
          onVisibleChange={setPopper3visible}
          content={
            <div className={cn('card', s.dropdown)}>
              <Link to="/governance" className={s.dropdownLink} onClick={() => setPopper3visible(false)}>
                <Icon name="governance" width={20} height={20} className={s.dropdownIcon} />
                <span>Governance</span>
              </Link>
              <Link to="/yield-farming" className={s.dropdownLink} onClick={() => setPopper3visible(false)}>
                <Icon name="yield-farming" width={20} height={20} className={s.dropdownIcon} />
                <span>Yield farming</span>
              </Link>
            </div>
          }>
          <Button type="link" className={s.navLink}>
            <Grid flow="col" align="center">
              <Text type="p1" weight="500" color="primary" className="mr-4">
                DAO
              </Text>
              <Icon name="dropdown-arrow" width={12} height={12} className={s.dropdownArrow} />
            </Grid>
          </Button>
        </Popover>
      </nav>
      {!isMobile && wallet.isActive && wallet.connector?.id === 'metamask' && (
        <div className={s.addTokenWrapper}>
          <button type="button" onClick={handleAddProjectToken} className={s.addTokenButton}>
            <Icon name="png/add-enter" width={32} height={32} />
          </button>
        </div>
      )}
      <ConnectedWallet />
      <Button type="link" className={s.burger} onClick={() => setNavOpen(prevState => !prevState)}>
        <Icon name={navOpen ? 'burger-close' : 'burger'} style={{ color: 'var(--theme-primary-color)' }} />
      </Button>
      {navOpen &&
        ReactDOM.createPortal(
          <div
            ref={setPopperElement}
            className={cn(s.mobileMenu, { [s.open]: navOpen })}
            style={
              {
                ...styles.popper,
                bottom: 0,
                right: 0,
                '--top': `${state?.modifiersData?.popperOffsets?.y || 0}px`,
              } as React.CSSProperties
            }
            {...attributes.popper}>
            <div className={s.mobileInner}>
              <div className={s.mobileMenuInner}>
                <div className={s.mobileMenuBlock}>
                  <h3>Info</h3>
                  <ExternalLink
                    href="https://medium.com/enterdao/enterdao-whitepaper-27447f7400c8"
                    className={s.dropdownLink}
                    onClick={() => setNavOpen(false)}>
                    <Icon name="whitepaper" width={20} height={20} className={s.dropdownIcon} />
                    <span>Whitepaper</span>
                  </ExternalLink>
                  <ExternalLink
                    href="https://enterdao.xyz/team"
                    className={s.dropdownLink}
                    onClick={() => setNavOpen(false)}>
                    <Icon name="team" width={20} height={20} className={s.dropdownIcon} />
                    <span>Team</span>
                  </ExternalLink>
                  <ExternalLink
                    href="https://docs.enterdao.xyz/"
                    className={s.dropdownLink}
                    onClick={() => setNavOpen(false)}>
                    <Icon name="docs" width={20} height={20} className={s.dropdownIcon} />
                    <span>Docs</span>
                  </ExternalLink>
                </div>
                <div className={s.mobileMenuBlock}>
                  <h3>DAO</h3>
                  <Link to="/governance" className={s.dropdownLink} onClick={() => setNavOpen(false)}>
                    <Icon name="governance" width={20} height={20} className={s.dropdownIcon} />
                    <span>Governance</span>
                  </Link>
                  <Link to="/yield-farming" className={s.dropdownLink} onClick={() => setNavOpen(false)}>
                    <Icon name="yield-farming" width={20} height={20} className={s.dropdownIcon} />
                    <span>Yield farming</span>
                  </Link>
                </div>
                {!wallet.isActive && !isMobile ? (
                  <div style={{ textAlign: 'center', padding: '0 20px', width: '100%' }}>
                    <Divider />
                    <button
                      type="button"
                      className="button-ghost"
                      onClick={() => {
                        setNavOpen(false);
                        wallet.showWalletsModal();
                      }}
                      style={{ margin: '20px auto 0' }}>
                      <span>Sign in</span>
                    </button>
                  </div>
                ) : null}
              </div>
              <button type="button" className={s.themeSwitcher} onClick={toggleDarkTheme}>
                <Icon name={isDarkTheme ? 'theme-switcher-sun' : 'theme-switcher-moon'} width={24} height={24} />
                <span>{isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'}</span>
              </button>
            </div>
          </div>,
          modalRoot,
        )}
    </div>
  );
};

export default LayoutHeader;
