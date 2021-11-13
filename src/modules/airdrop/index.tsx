import React from 'react';

import Grid from 'components/custom/grid';

import { Text } from '../../components/custom/typography';

import styles from './AirDropPage.module.scss';

const AirDropPage = () => {
  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <Text type="h2" weight="bold" color="primary" className="mb-8">
          Airdrop reward
        </Text>
        <Text type="p3" color="secondary">
          You may have received claimable token rewards from the $FDT BarnBridge Community Airdrop. Claiming your
          airdrop before a year has passed will forfeit a portion of your balance. Your total claimable amount will rise
          whenever someone forfeits a portion of their reward.
        </Text>
        <Grid flow="col" colsTemplate="1fr 350px" gap={30} className="mb-12">
          <div>Left</div>
          <div>Right</div>
        </Grid>
      </div>
    </section>
  );
};

export default AirDropPage;
