import React, { CSSProperties } from 'react';
import cn from 'classnames';

import aaveSrc from 'resources/png/token-aave.png';
import ilvSrc from 'resources/png/token-ilv.png';
import linkSrc from 'resources/png/token-link.png';
import sushiSrc from 'resources/png/token-sushi.png';
import uslpSrc from 'resources/png/token-uslp.png';
import eslpSrc from 'resources/png/token-eslp.png';
import universeSrc from 'resources/png/universe.png';
// import enterdaoSrc from 'resources/png/enterdao.png';
import manaSrc from 'resources/png/mana.png';
import sandSrc from 'resources/png/sandbox.png';
import axsSrc from 'resources/png/axie.png';
import emptyTable from 'resources/png/empty-table.png';
import addEnterSrc from 'resources/png/add-enter.png';
import enterStarSrc from 'resources/png/enter-star.png';
import logoDarkSrc from 'resources/png/logo_dark.png';
import logoLightSrc from 'resources/png/logo_light.png';
import telegramSrc from 'resources/png/telegram.png';
import Sprite from 'resources/svg/icons-sprite.svg';
import MKRSrc from 'resources/png/MKR.png';
import RGTSrc from 'resources/png/RGT.png';
import UMASrc from 'resources/png/UMA.png';
import wsOHMSrc from 'resources/png/wsOHM.png';
import YFISrc from 'resources/png/YFI.png';
import accountImg from 'resources/png/account_img.png';
import ETH_FDT_SLPImg from 'resources/png/ETH_FDT_SLP.png';
import sOHM_FDT_SUSHI_LPImg from 'resources/png/sOHM_FDT_SUSHI_LP.png';
import logoTextLImg from 'resources/png/logo_light_text.png';
import logoTextDImg from 'resources/png/logo_dark_text.png';
import fdIconDImg from 'resources/png/fd_icon.png';
import txProgressImg from 'resources/png/tx-progress.png';
import txFailureImg from 'resources/png/tx-failure.png';
import txSuccessImg from 'resources/png/tx-success.png';
import plugBgMobileImg from 'resources/png/plug-bg-mobile.png';
import plugBgTabletImg from 'resources/png/plug-bg-tablet.png';
import plugBgImg from 'resources/png/plug-bg.png';
import circlePlusOutlinedImg from 'resources/png/circle-plus-outlined.png';

import s from './s.module.scss';

export type LogoIconNames = 'png/fiat-dao';

export type TokenIconNames =
  | 'bond-circle-token'
  | 'bond-square-token'
  | 'token-unknown'
  | 'static/token-bond'
  | 'static/token-uniswap'
  | 'static/tx-progress'
  | 'token-eth'
  | 'token-btc'
  | 'token-weth'
  | 'token-wbtc'
  | 'token-renbtc'
  | 'token-bond'
  | 'token-usdc'
  | 'token-dai'
  | 'token-susd'
  | 'token-uniswap'
  | 'token-usdt'
  | 'token-sushi'
  | 'compound'
  | 'png/enter-star'
  | 'png/universe'
  | 'png/mana'
  | 'png/sandbox'
  | 'png/axie'
  | 'png/aave'
  | 'png/sushi'
  | 'png/link'
  | 'png/ilv'
  | 'png/uslp'
  | 'png/eslp'
  | 'cream_finance'
  | 'png/mkr'
  | 'png/rgt'
  | 'png/uma'
  | 'png/wsOHM'
  | 'png/YFI'
  | 'png/ETH_FDT_SLP'
  | 'png/sOHM_FDT_SUSHI_LP'
  | 'yearn_finance';

export type NavIconNames =
  | 'paper-bill-outlined'
  | 'paper-alpha-outlined'
  | 'chats-outlined'
  | 'forum-outlined'
  | 'bar-charts-outlined'
  | 'savings-outlined'
  | 'proposal-outlined'
  | 'treasury-outlined'
  | 'bank-outlined'
  | 'tractor-outlined'
  | 'wallet-outlined'
  | 'docs-outlined';

export type ThemeIconNames = 'moon' | 'sun';

export type IconNames =
  | LogoIconNames
  | TokenIconNames
  | NavIconNames
  | ThemeIconNames
  | 'static/uStar'
  | 'right-arrow-circle-outlined'
  | 'arrow-back'
  | 'down-arrow-circle'
  | 'refresh'
  | 'notification'
  | 'chevron-right'
  | 'close-circle-outlined'
  | 'check-circle-outlined'
  | 'history-circle-outlined'
  | 'close'
  | 'close-tiny'
  | 'dropdown-arrow'
  | 'warning-outlined'
  | 'warning-circle-outlined'
  | 'gear'
  | 'node-status'
  | 'info-outlined'
  | 'network'
  | 'pencil-outlined'
  | 'rate-outlined'
  | 'plus-circle-outlined'
  | 'plus-square-outlined'
  | 'ribbon-outlined'
  | 'bin-outlined'
  | 'add-user'
  | 'search-outlined'
  | 'link-outlined'
  | 'arrow-top-right'
  | 'handshake-outlined'
  | 'stamp-outlined'
  | 'circle-plus-outlined'
  | 'png/circle-plus-outlined'
  | 'circle-minus-outlined'
  | 'senior_tranche'
  | 'junior_tranche'
  | 'senior_tranche_simplified'
  | 'junior_tranche_simplified'
  | 'withdrawal_regular'
  | 'withdrawal_instant'
  | 'statistics'
  | 'filter'
  | 'tx-progress'
  | 'tx-success'
  | 'tx-failure'
  | 'burger'
  | 'burger-close'
  | 'hourglass'
  | 'history'
  | 'piggybank'
  | 'file'
  | 'add-file'
  | 'file-added'
  | 'file-deleted'
  | 'file-clock'
  | 'file-times'
  | 'wallet'
  | 'handshake'
  | 'padlock-unlock'
  | 'stopwatch'
  | 'judge'
  | 'certificate'
  | 'chart-up'
  | 'apy-up'
  | 'chart'
  | 'queue'
  | 'stake'
  | 'auction'
  | 'marketplace'
  | 'social-media'
  | 'about'
  | 'whitepaper'
  | 'team'
  | 'governance'
  | 'yield-farming'
  | 'docs'
  | 'twitter'
  | 'discord'
  | 'dropdown'
  | 'theme-switcher-sun'
  | 'theme-switcher-moon'
  | 'coingecko'
  | 'youtube'
  | 'git'
  | 'medium'
  | 'polymorphs'
  | 'core-drops'
  | 'png/add-enter'
  | 'png/logo-dark'
  | 'png/logo-light'
  | 'png/logo-light-text'
  | 'png/logo-dark-text'
  | 'png/telegram'
  | 'png/empty-table'
  | 'png/account'
  | 'png/tx-progress'
  | 'png/tx-success'
  | 'png/tx-failure'
  | 'png/plug-bg-mobile'
  | 'png/plug-bg-tablet'
  | 'png/plug-bg'
  | 'static/add-token';

export type IconProps = {
  name: IconNames;
  width?: number | string;
  height?: number | string;
  color?: 'primary' | 'secondary' | 'red' | 'green' | 'blue' | 'inherit';
  rotate?: 0 | 90 | 180 | 270;
  className?: string;
  style?: CSSProperties;
  src?: string;
};


const Icon: React.FC<IconProps> = props => {
  const { name, width = 24, height = 24, rotate, color, className, style, src, ...rest } = props;

  const isStatic = (name ?? '').indexOf('static/') === 0;
  const isPng = (name ?? '').indexOf('png/') === 0;

  if (isPng) {
    const getSrc = () => {
      switch (name) {
        case 'png/plug-bg-mobile':
          return plugBgMobileImg;
        case 'png/circle-plus-outlined':
          return circlePlusOutlinedImg;
        case 'png/plug-bg-tablet':
          return plugBgTabletImg;
        case 'png/plug-bg':
          return plugBgImg;
        case 'png/tx-progress':
          return txProgressImg;
        case 'png/tx-success':
          return txSuccessImg;
        case 'png/tx-failure':
          return txFailureImg;
        case 'png/fiat-dao':
          return fdIconDImg;
        case 'png/ETH_FDT_SLP':
          return ETH_FDT_SLPImg;
        case 'png/sOHM_FDT_SUSHI_LP':
          return sOHM_FDT_SUSHI_LPImg;
        case 'png/mkr':
          return MKRSrc;
        case 'png/rgt':
          return RGTSrc;
        case 'png/uma':
          return UMASrc;
        case 'png/wsOHM':
          return wsOHMSrc;
        case 'png/YFI':
          return YFISrc;
        case 'png/empty-table':
          return emptyTable;
        case 'png/universe':
          return universeSrc;
        case 'png/mana':
          return manaSrc;
        case 'png/sandbox':
          return sandSrc;
        case 'png/axie':
          return axsSrc;
        case 'png/aave':
          return aaveSrc;
        case 'png/ilv':
          return ilvSrc;
        case 'png/link':
          return linkSrc;
        case 'png/sushi':
          return sushiSrc;
        case 'png/uslp':
          return uslpSrc;
        case 'png/eslp':
          return eslpSrc;
        case 'png/add-enter':
          return addEnterSrc;
        case 'png/enter-star':
          return enterStarSrc;
        case 'png/logo-dark':
          return logoDarkSrc;
        case 'png/logo-light-text':
          return logoTextLImg;
        case 'png/logo-dark-text':
          return logoTextDImg;
        case 'png/logo-light':
          return logoLightSrc;
        case 'png/telegram':
          return telegramSrc;
        case 'png/account':
          return accountImg;
        default:
          return '';
      }
    };
    return (
      <img
        className={cn(s.component, className, rotate && `rotate-${rotate}`, color && s[`${color}-color`])}
        width={width}
        alt=""
        height={height ?? width}
        style={style}
        src={src || getSrc()}
        {...rest}
      />
    );
  }

  return (
    <svg
      className={cn(s.component, className, rotate && `rotate-${rotate}`, color && s[`${color}-color`])}
      width={width}
      height={height ?? width}
      style={style}
      {...rest}>
      {!isStatic ? <use xlinkHref={`${Sprite}#icon__${name}`} /> : <use xlinkHref={`#icon__${name}`} />}
    </svg>
  );
};

export default Icon;
