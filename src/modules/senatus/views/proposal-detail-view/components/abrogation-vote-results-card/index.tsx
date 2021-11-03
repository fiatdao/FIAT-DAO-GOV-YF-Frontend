import React from 'react';

import Button from 'components/antd/button';
import Grid from 'components/custom/grid';
import ProgressNew from 'components/custom/progress';
import { Hint, Text } from 'components/custom/typography';

import { useAbrogation } from '../../providers/AbrogationProvider';
import AbrogationVotersModal from '../abrogation-voters-modal';

const AbrogationVoteResultsCard: React.FC = () => {
  const abrogationCtx = useAbrogation();
  const [votersModal, showVotersModal] = React.useState<boolean>(false);

  return (
    <>
      <div className="card">
        <div className="card-header flex justify-space-between">
          <Text type="p1" weight="semibold" color="primary">
            Vote results
          </Text>
          <Button type="link" onClick={() => showVotersModal(true)}>
            View voters
          </Button>
        </div>
        <Grid className="card-row p-24" flow="row">
          <Grid flow="col" justify="space-between">
            <Grid flow="row" gap={4}>
              <Text className="card-label" type="small" weight="semibold" color="secondary">
                For
              </Text>
              <Grid flow="col" gap={8}>
                <Text type="p1" weight="semibold" color="primary">
                  {abrogationCtx.abrogation?.forVotes.toFormat(2)}
                </Text>
                <Text type="p1" color="secondary">
                  ({abrogationCtx.forRate?.toFixed(2)}%)
                </Text>
              </Grid>
            </Grid>
            <Grid flow="row" gap={4} align="end">
              <Text className="card-label" type="small" weight="semibold" color="secondary" align="right">
                Against
              </Text>
              <Grid flow="col" gap={8}>
                <Text type="p1" weight="semibold" color="primary">
                  {abrogationCtx.abrogation?.againstVotes.toFormat(2)}
                </Text>
                <Text type="p1" color="secondary">
                  ({abrogationCtx.againstRate?.toFixed(2)}%)
                </Text>
              </Grid>
            </Grid>
          </Grid>
          <ProgressNew
            percent={abrogationCtx.forRate}
            colors={{ bg: 'var(--theme-red-color)', bar: 'var(--theme-green-color)' }}
            style={{ margin: '8px 0' }}
          />
        </Grid>
        <Grid className="card-row p-24" flow="row">
          <Grid flow="col" justify="space-between">
            <div />
            <Grid flow="row" gap={4} align="end">
              <Hint text="Approval is the percentage of votes on a proposal that the total support must be greater than for the proposal to be approved. For example, if “Approval” is set to 51%, then more than 51% of the votes on a proposal must vote “Yes” for the proposal to pass.">
                <Text type="small" weight="semibold" color="secondary" align="right">
                  Approval
                </Text>
              </Hint>
              <Grid flow="col" gap={8}>
                <Text type="p1" weight="semibold" color="primary">
                  {abrogationCtx.forRate?.toFixed(2)}%
                </Text>
                <Text type="p1" color="secondary">
                  (&gt; {abrogationCtx.acceptanceThreshold}% required)
                </Text>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
      {votersModal && <AbrogationVotersModal onCancel={() => showVotersModal(false)} />}
    </>
  );
};

export default AbrogationVoteResultsCard;
