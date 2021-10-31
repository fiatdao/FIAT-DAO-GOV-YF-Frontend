import React from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';

import Icon from 'components/custom/icon';

import s from './s.module.scss';
import { useGeneral } from '../../../components/providers/general-provider';
import useMediaQuery from '../../../hooks/useMediaQuery';
import Socials from './components/Socials';

const LayoutFooter: React.FC = () => {
  const { isDarkTheme } = useGeneral();
  const isMobile = useMediaQuery(992);

  const getYear = () => {
    return new Date().getFullYear();
  }

  return (
    <footer className={s.footer}>
      <div className="container-limit">
        <div className={s.row}>
          {!isMobile ? (
              <>
                <div><Icon name={isDarkTheme ? 'png/logo-dark-text' : 'png/logo-light-text'} width="auto" className={s.logo} /></div>
                <div className={s.nav}>
                  <Link to="/" className={s.dropdownLink}>
                    <span>Home</span>
                  </Link>
                  <Link to="/liquidity-mining" className={s.dropdownLink}>
                    <span>Liquidity mining</span>
                  </Link>
                  {/*<Link to="/fiat-dao" className={s.dropdownLink}>*/}
                  {/*  <span>FIAT DAO</span>*/}
                  {/*</Link>*/}
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
                  <Link to="/" className={s.dropdownLink}>
                    <span>Home</span>
                  </Link>
                  <Link to="/liquidity-mining" className={s.dropdownLink}>
                    <span>Liquidity mining</span>
                  </Link>
                  {/*<Link to="/fiat-dao" className={s.dropdownLink}>*/}
                  {/*  <span>FIAT DAO</span>*/}
                  {/*</Link>*/}
                </div>
                <Icon name={isDarkTheme ? 'png/logo-dark-text' : 'png/logo-light-text'} width="auto" className={s.logo} />
              </>
            )}
            <div className={s.copyrightLink}>fiatdao.com © {getYear()}. Open-sourced.</div>
            {!isMobile && (
            <div className={s.copyrightLinks}>
                <Socials />
            </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LayoutFooter;
