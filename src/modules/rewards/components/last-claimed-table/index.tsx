import React from 'react';

import { Table } from 'components/antd';
import { ExternalLink, Icon, Text } from 'components/custom';

import { getEtherscanTxUrl, shortenAddr } from '../../../../web3/utils';

const columns = [
  {
    dataIndex: 'claimer',
    key: 'claimer',
    render: (text: string) => (
      <ExternalLink href={getEtherscanTxUrl(text)} className="link-blue mb-4">
        <Text type="p1" weight="semibold" color="var(--gradient-blue-safe)" textGradient="var(--gradient-blue)">
          {shortenAddr(text)}
        </Text>
      </ExternalLink>
    ),
  },
  {
    dataIndex: 'claimAmount',
    key: 'claimAmount',
    render: (amount: string) => (
      <div className="flex flow-col align-center justify-end">
        <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
        <Text type="p2" weight="bold" color="primary">
          {amount}
        </Text>
      </div>
    )
  },
];

const data = [
  {
    claimer: "0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF",
    claimAmount: '100.000',
  },
  {
    claimer: "0x22A674F22Dafc25a16A29aD5c2a7710ceE1071FF",
    claimAmount: "100,000",
  },
  {
    claimer: "0x22A674F22Dafc25a16329aD5c2a7710ceE1076FF",
    claimAmount: "100,000",
  },
];

const LastClaimed = () => {

  const handlePageChange =(page: number) => {
    console.log({page})
  }

  return (
    <Table
      showHeader={false}
      rowKey="claimer"
      pagination={{ pageSize: 8, position: ['bottomCenter'], defaultPageSize: 8, pageSizeOptions: ['8'], onChange: handlePageChange, }}
      columns={columns}
      dataSource={data}
    />
  );
};

export default LastClaimed;
