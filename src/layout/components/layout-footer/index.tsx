import React, { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Antd from 'antd';
import AntdSpin from 'antd/lib/spin';
import cn from 'classnames';

import Tooltip from 'components/antd/tooltip';
import ExternalLink from 'components/custom/externalLink';
import Icon from 'components/custom/icon';
import { Text } from 'components/custom/typography';
import config, { XYZ_MARKET_LINK, XYZ_MARKET_LIQUIDITY_LINK } from 'config';

import s from './s.module.scss';

const LayoutFooter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handlerSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setEmail('');
    Antd.notification.success({
      message: 'Thank you for subscribing!',
    });

    setLoading(false);
  };

  const getYear = () => {
    return new Date().getFullYear();
  }

  return (
    <footer className={s.footer}>
      <div className="container-limit">
        <div className={s.row}>
          <div className={s.subscribeBlock}>
            <Text type="p1" weight="bold" color="white" font="secondary">
              Stay up to date with our newsletter
            </Text>
            <form className={s.subscribeWrap}  action={config.mailchimp.url} method="POST" noValidate target="_blank">
                <input type="hidden" name="u" value={config.mailchimp.u}/>
                <input type="hidden" name="id" value={config.mailchimp.id}/>
                <input
                    className={s.subscribeInput}
                    placeholder="Enter your email"
                    type="email"
                    name="EMAIL"
                    id="MERGE0"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoCapitalize="off"
                    autoCorrect="off"
                  />
                <button type="submit" className={cn(s.subscribeButton, 'button-primary')} disabled={loading}>
                {loading && <AntdSpin style={{ marginRight: 8 }} spinning />}
                Subscribe
              </button>
              <div style={{position: 'absolute', left: '-5000px'}} aria-hidden='true' aria-label="Please leave the following three fields empty">
                  <label htmlFor="b_email">Email: </label>
                  <input type="email" name="b_email" tabIndex={-1} value="" placeholder="youremail@gmail.com" id="b_email"/>
              </div>
            </form>
          </div>
          <div className={s.sBlock}>
            <Text type="p1" weight="bold" color="white" font="secondary">
              Join the community
            </Text>
            <div className={s.sLinksWrap}>
              <ExternalLink href="https://twitter.com/universe_xyz" className={s.sLink}>
                <Icon name="twitter" width="20" height="20" />
              </ExternalLink>
              <ExternalLink href="https://discord.com/invite/vau77wXCD3" className={s.sLink}>
                <Icon name="discord" width="20" height="20" />
              </ExternalLink>
              <ExternalLink href="https://www.coingecko.com/en/coins/universe-xyz" className={s.sLink}>
                <Icon name="coingecko" width="20" height="20" />
              </ExternalLink>
              <ExternalLink
                href="https://www.youtube.com/channel/UCWt00md9T2b4iTsHWp_Fapw?sub_confirmation=1"
                className={s.sLink}>
                <Icon name="youtube" width="20" height="20" />
              </ExternalLink>
              <ExternalLink href="https://medium.com/universe-xyz" className={s.sLink}>
                <Icon name="medium" width="20" height="20" />
              </ExternalLink>
            </div>
          </div>
        </div>
        <div className={cn(s.row, s.navWrap)}>
          <div className={s.logoWrap}>
            <Link to="/" className={s.logoLink}>
              <Icon name="png/enterdao" width="auto" height="auto" className={s.logo} />
            </Link>
            <Text type="p1" color="white">
              EnterDAO is a decentralized autonomous organization (DAO) living on the Ethereum blockchain - governed by the ENTR token.
            </Text>
          </div>
          <div className={s.navBlocksWrap}>
            <nav className={s.navBlock}>
              <Text type="p1" color="white" font="secondary" className={s.navTitle}>
                Info
              </Text>
              <ExternalLink href="https://universe.xyz/about" className={s.link}>
                About
              </ExternalLink>
              <ExternalLink href="https://github.com/UniverseXYZ/UniverseXYZ-Whitepaper" className={s.link}>
                Whitepaper
              </ExternalLink>
              <ExternalLink href="https://universe.xyz/team" className={s.link}>
                Team
              </ExternalLink>
              <ExternalLink href="https://docs.universe.xyz/" className={s.link}>
                Docs
              </ExternalLink>
            </nav>
            <nav className={s.navBlock}>
              <Text type="p1" color="white" font="secondary" className={s.navTitle}>
                DAO
              </Text>
              <Link to="/governance" className={s.link}>
                Governance
              </Link>
              <Link to="/yield-farming" className={s.link}>
                Yield farming
              </Link>
            </nav>
          </div>
        </div>
        <div className={cn(s.row, s.copyrightsBlock)}>
          <div className={s.copyrightLink}>Enterdao.xyz © {getYear()}. Open-sourced.</div>
        </div>
      </div>
    </footer>
  );
};

export default LayoutFooter;
