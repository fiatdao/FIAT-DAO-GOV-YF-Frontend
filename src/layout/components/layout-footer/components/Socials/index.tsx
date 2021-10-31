import s from '../../s.module.scss';
import ExternalLink from '../../../../../components/custom/externalLink';
import Icon from '../../../../../components/custom/icon';
import React from 'react';

const Socials = () => {
  return (
    <div className={s.sLinksWrap}>
      <ExternalLink href="#" className={s.sLink}>
        <Icon name="twitter" width="15" />
      </ExternalLink>
      <ExternalLink href="#" className={s.sLink}>
        <Icon name="discord" width="15" />
      </ExternalLink>
      <ExternalLink href="#" className={s.sLink}>
        <Icon name="medium" width="15" />
      </ExternalLink>
      {/*<ExternalLink href="#" className={s.sLink}>*/}
      {/*  <Icon name="youtube" width="15" />*/}
      {/*</ExternalLink>*/}
      <ExternalLink href="#" className={s.sLink}>
        <Icon name="git" width="15" />
      </ExternalLink>
      {/*<ExternalLink href="#" className={s.sLink}>*/}
      {/*  <Icon name="coingecko" width="15" />*/}
      {/*</ExternalLink>*/}
    </div>
  )
}

export default Socials;
