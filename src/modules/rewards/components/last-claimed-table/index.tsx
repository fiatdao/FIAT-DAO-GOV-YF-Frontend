import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';

import { Table } from 'components/antd';
import { ExternalLink, Icon, Text } from 'components/custom';
import { FDTToken } from 'components/providers/known-tokens-provider';


import { formatToken, getEtherscanAddressUrl, shortenAddr } from '../../../../web3/utils';
import { APIAirdropClaims, fetchAirdropClaims } from '../../api';


type State = {
  claims: APIAirdropClaims[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
};


const InitialState: State = {
  claims: [],
  total: 0,
  page: 1,
  pageSize: 8,
  loading: false,
};

const columns = [
  {
    dataIndex: 'claimer',
    key: 'claimer',
    render: (text: string) => (
      <ExternalLink href={getEtherscanAddressUrl(text)} className="link-blue mb-4">
        <Text type="p1" weight="semibold" color="var(--gradient-blue-safe)" textGradient="var(--gradient-blue)">
          {shortenAddr(text)}
        </Text>
      </ExternalLink>
    ),
  },
  {
    dataIndex: 'adjustedAmount',
    key: 'adjustedAmount',
    render: (amount: string) => (
      <div className="flex flow-col align-center justify-end">
        <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
        <Text type="p2" weight="bold" color="primary">
          {formatToken(new BigNumber(amount).unscaleBy(FDTToken.decimals))}
        </Text>
      </div>
    )
  },
];

const LastClaimed = () => {

  const [state, setState] = useState<State>(InitialState);

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      loading: true,
      total: 0,
    }));

    (async () => {
      try {
        const {
          data: claims,
          meta: { count },
        } = await fetchAirdropClaims(
          state.page,
          state.pageSize,
        );

        setState(prevState => ({
          ...prevState,
          loading: false,
          claims,
          total: count,
        }));
      } catch {
        setState(prevState => ({
          ...prevState,
          loading: false,
          claims: [],
        }));
      }
    })();
  }, [state.page, state.pageSize]);

  function handlePageChange(page: number) {
    setState(prevState => ({
      ...prevState,
      page,
    }));
  }

  return (
    <Table
      showHeader={false}
      dataSource={state.claims}
      loading={state.loading}
      rowKey="claimer"
      pagination={{
        total: state.total,
        current: state.page,
        pageSize: state.pageSize, position: ['bottomCenter'],
        onChange: handlePageChange, }}
      columns={columns}
    />
  );
};

export default LastClaimed;
