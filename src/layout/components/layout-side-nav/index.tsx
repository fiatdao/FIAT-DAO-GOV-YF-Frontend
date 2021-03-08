import React from 'react';
import { isMobile } from 'react-device-detect';
import { NavLink, useLocation } from 'react-router-dom';
import cn from 'classnames';

import Tooltip from 'components/antd/tooltip';
import Icons from 'components/custom/icon';
import { Text } from 'components/custom/typography';
import { useGeneral } from 'components/providers/general-provider';
import { useTheme } from 'components/providers/theme-provider';

import s from './styles.module.scss';

const LayoutSideNav: React.FC = () => {
  const { toggleDarkTheme, isDarkTheme } = useTheme();
  const { navOpen, setNavOpen } = useGeneral();
  const location = useLocation();
  const [expanded, setExpanded] = React.useState<boolean>(false);

  React.useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  React.useEffect(() => {
    if (navOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [navOpen]);

  function handleExpand() {
    setExpanded(prevState => !prevState);
  }

  function handleThemeToggle() {
    toggleDarkTheme();
  }

  const displayTooltip = !isMobile && !expanded;

  return (
    <>
      <div className={cn(s.mask, { [s.open]: navOpen })} />
      <aside className={cn(s.aside, { [s.expanded]: expanded, [s.open]: navOpen })}>
        <div className={s.logoContainer}>
          <button type="button" className={s.closeButton} onClick={() => setNavOpen(false)}>
            <Icons name="close-circle-outlined" />
          </button>
          <Icons name="bond-square-token" className={s.logo} />
          <Icons name="barnbridge" width="113" color="primary" className={s.logoLabel} />
        </div>
        <nav className={s.top}>
          <Tooltip title={displayTooltip && 'Yield Farming'} placement="right">
            <NavLink to="/yield-farming" className={s.button} activeClassName={s.active}>
              <Icons name="savings-outlined" />
              <Text type="p2" weight="semibold" className={s.buttonLabel}>
                Yield Farming
              </Text>
            </NavLink>
          </Tooltip>
          <Tooltip title={displayTooltip && 'Governance'} placement="right">
            <NavLink to="/governance" className={s.button} activeClassName={s.active}>
              <Icons name="bank-outlined" />
              <Text type="p2" weight="semibold" className={s.buttonLabel}>
                Governance
              </Text>
            </NavLink>
          </Tooltip>
          <Tooltip title={displayTooltip && 'Smart Yield'} placement="right">
            <NavLink to="/smart-yield" className={s.button} activeClassName={s.active}>
              <Icons name="paper-bill-outlined" />
              <Text type="p2" weight="semibold" className={s.buttonLabel}>
                Smart Yield
              </Text>
            </NavLink>
          </Tooltip>
        </nav>
        <div className={s.bottom}>
          <Tooltip title={displayTooltip && 'Docs'} placement="right">
            <a rel="noopener noreferrer" target="_blank" href="https://docs.barnbridge.com/" className={s.button}>
              <Icons name="docs-outlined" />
              <Text type="p2" weight="semibold" className={s.buttonLabel}>
                Docs
              </Text>
            </a>
          </Tooltip>
          <Tooltip title={displayTooltip && (isDarkTheme ? 'Light Theme' : 'Dark Theme')} placement="right">
            <button type="button" onClick={handleThemeToggle} className={s.button}>
              <Icons name={isDarkTheme ? 'sun' : 'moon'} />
              <Text type="p2" weight="semibold" className={s.buttonLabel}>
                {isDarkTheme ? 'Light Theme' : 'Dark Theme'}
              </Text>
            </button>
          </Tooltip>
          <Tooltip title={displayTooltip && (expanded ? 'Hide menu' : 'Show menu')} placement="right">
            <button type="button" onClick={handleExpand} className={cn(s.button, 'hidden-mobile hidden-tablet')}>
              <Icons name="right-arrow-circle-outlined" style={{ transform: expanded ? 'rotate(-180deg)' : 'none' }} />
              <Text type="p2" weight="semibold" className={s.buttonLabel}>
                Hide menu
              </Text>
            </button>
          </Tooltip>
        </div>
      </aside>
    </>
  );
};

export default LayoutSideNav;
