import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import cn from 'classnames';

import Icon from 'components/custom/icon';

import { useGeneral } from '../../../components/providers/general-provider';
import { FDT_MARKET_LINK, FDT_MARKET_LIQUIDITY_LINK } from '../../../config';
import useMediaQuery from '../../../hooks/useMediaQuery';
import Socials from './components/Socials';

import s from './s.module.scss';

const LayoutFooter: React.FC = () => {
  const { isDarkTheme } = useGeneral();
  const isMobile = useMediaQuery(992);

  const location = useLocation();

  const getYear = () => {
    return new Date().getFullYear();
  };

  return (
    <footer className={s.footer}>
      <div className="container-limit">
        <div className={s.row}>
          {!isMobile ? (
            <>
              <div>
                <Link to="/">
                  <Icon
                    name={isDarkTheme ? 'png/logo-dark-text' : 'png/logo-light-text'}
                    width="auto"
                    className={s.logo}
                  />
                </Link>
              </div>
              <div className={s.nav}>
                <a href="https://fiatdao.com/" className={cn(s.dropdownLink)}>
                  <span>Home</span>
                </a>
                <Link
                  to="/senatus"
                  className={cn(s.dropdownLink, {
                    [s.dropdownLink_active]: location.pathname.split('/')[1] === 'senatus',
                  })}>
                  <span>Senatus</span>
                </Link>
                <Link
                  to="/rewards"
                  className={cn(s.dropdownLink, {
                    [s.dropdownLink_active]: location.pathname.split('/')[1] === 'rewards',
                  })}>
                  <span>Rewards</span>
                </Link>
                <Link
                  to="/age-of-romulus"
                  className={cn(s.dropdownLink, {
                    [s.dropdownLink_active]: location.pathname.split('/')[1] === 'age-of-romulus',
                  })}>
                  <span>Age of Romulus</span>
                </Link>
                <Link
                  to="/airdrop"
                  className={cn(s.dropdownLink, {
                    [s.dropdownLink_active]: location.pathname.split('/')[1] === 'airdrop',
                  })}>
                  <span>Airdrop</span>
                </Link>
                {/*<Link to="/fiat-dao" className={s.dropdownLink}>*/}
                {/*  <span>FIAT DAO</span>*/}
                {/*</Link>*/}
              </div>
              <div className={s.socialTop}>
                <Socials />
              </div>
            </>
          ) : (
            <Socials />
          )}
        </div>
      </div>
      <div className={cn(s.row, s.copyrightsBlock)}>
        <div className="container-limit">
          <div className={s.copyrightsBlock__row}>
            {isMobile && (
              <>
                <div className={s.nav}>
                  <a href="https://fiatdao.com/" className={cn(s.dropdownLink)}>
                    <span>Home</span>
                  </a>
                  <Link to="/senatus" className={s.dropdownLink}>
                    <span>Senatus</span>
                  </Link>
                  <Link to="/rewards" className={s.dropdownLink}>
                    <span>Rewards</span>
                  </Link>
                  <Link to="/age-of-romulus" className={s.dropdownLink}>
                    <span>Age of Romulus</span>
                  </Link>
                  <Link to="/airdrop" className={s.dropdownLink}>
                    <span>Airdrop</span>
                  </Link>
                  {/*<Link to="/fiat-dao" className={s.dropdownLink}>*/}
                  {/*  <span>FIAT DAO</span>*/}
                  {/*</Link>*/}
                </div>
                <Link to="/">
                  <Icon
                    name={isDarkTheme ? 'png/logo-dark-text' : 'png/logo-light-text'}
                    width="auto"
                    className={s.logo}
                  />
                </Link>
              </>
            )}
            {!isMobile && (
              <div className={s.copyrightLinks}>
                <div className={s.poweredBy}>
                  <a href={FDT_MARKET_LIQUIDITY_LINK} target="_blank" rel="noopener noreferrer">
                    Add liquidity to SushiSwap gOHM/FDT pool
                  </a>
                  <a href={FDT_MARKET_LINK} target="_blank" rel="noopener noreferrer">
                    SushiSwap gOHM/FDT market
                  </a>
                  {/*<Link to="/airdrop">*/}
                  {/*  AirDrop*/}
                  {/*</Link>*/}
                </div>
              </div>
            )}
            <div className={s.copyrightLink}>
              <a href="https://fiatdao.com/" target="_blank" rel="noopener noreferrer">
                <span>fiatdao.com </span>
              </a>
              © {getYear()}. Open-sourced.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LayoutFooter;
