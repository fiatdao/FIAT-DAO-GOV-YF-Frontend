import { isMobile, isTablet } from 'react-device-detect';
import Icon from 'components/custom/icon';

import styles from './PlugPage.module.scss';
import React from 'react';

const PlugPage = () => {

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.page__block}>
          <div>
            <Icon name="png/logo-dark-text" width={200} height={80} />
          </div>
          <h1>Coming soon...</h1>
          <ul className={styles.page__socials}>
            <li>
              <a href="https://twitter.com/fiatdao" target="_blank" rel="noreferrer">
                <Icon name="twitter" width="15" />
              </a>
            </li>
            <li>
              <a href="https://discord.gg/K2PcFZUdBR" target="_blank" rel="noreferrer">
                <Icon name="discord" width="15" />
              </a>
            </li>
            <li>
              <a href="https://medium.com/fiat-dao" target="_blank" rel="noreferrer">
                <Icon name="medium" width="15" />
              </a>
            </li>
            <li>
              <a href="https://github.com/fiatdao/" target="_blank" rel="noreferrer">
                <Icon name="git" width="15" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.page__blockImg}>
        <div className={styles.img}>
          {isMobile ? (
              <Icon name="png/plug-bg-mobile" width={576} height={1000} />
          ) : isTablet ? (
              <Icon name="png/plug-bg-tablet" width={900} height={1000}  />
          ) : (
            <Icon name="png/plug-bg" width={1440} height={900} />
          )}
        </div>
      </div>
    </section>
  );
};

export default PlugPage;
