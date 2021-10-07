import React, { FC, useEffect, useState } from 'react';

import Button from 'components/antd/button';
import Spin from 'components/antd/spin';
import Grid from 'components/custom/grid';

import { useMetapass } from '../../providers/metapass-provider';

const MintComponent: FC = () => {
  const metapassCtx = useMetapass();

  const { metapassContract } = metapassCtx;

  const [minting, setMinting] = useState(false);

  async function mintMetapass() {
    setMinting(true);
    try {
      await metapassContract?.mint();
    } catch (e) {}

    setMinting(false);
  }

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, []);

  if (!metapassContract) {
    return null;
  }

  return (
    <Grid flow="col" justify="space-between">
      <Spin spinning={minting === true}>
        <Button type="primary" onClick={() => mintMetapass()}>
          Mint Metapass
        </Button>
      </Spin>
    </Grid>
  );
};

export default MintComponent;
