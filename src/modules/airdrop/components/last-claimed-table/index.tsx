import React from 'react';

import { Table } from 'components/antd';
import { ExternalLink, Icon, Text } from 'components/custom';

import { getEtherscanTxUrl, shortenAddr } from '../../../../web3/utils';

const columns = [
  {
    dataIndex: 'address',
    key: 'address',
    render: (text: any) => text,
  },
  {
    dataIndex: 'amount',
    key: 'amount',
  },
];

const data = [
  {
    key: '1',
    address: (
      <ExternalLink href={getEtherscanTxUrl('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')} className="link-blue mb-4">
        <Text type="p1" weight="semibold" color="var(--gradient-blue-safe)" textGradient="var(--gradient-blue)">
          {shortenAddr('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')}
        </Text>
      </ExternalLink>
    ),
    amount: (
      <div className="flex flow-col align-center justify-end">
        <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
        <Text type="p2" weight="700" color="primary">
          100,000
        </Text>
      </div>
    ),
  },
  {
    key: '2',
    address: (
      <ExternalLink href={getEtherscanTxUrl('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')} className="link-blue mb-4">
        <Text type="p1" weight="semibold" color="var(--gradient-blue-safe)" textGradient="var(--gradient-blue)">
          {shortenAddr('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')}
        </Text>
      </ExternalLink>
    ),
    amount: (
      <div className="flex flow-col align-center justify-end">
        <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
        <Text type="p2" weight="700" color="primary">
          100,000
        </Text>
      </div>
    ),
  },
  {
    key: '3',
    address: (
      <ExternalLink href={getEtherscanTxUrl('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')} className="link-blue mb-4">
        <Text type="p1" weight="semibold" color="var(--gradient-blue-safe)" textGradient="var(--gradient-blue)">
          {shortenAddr('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')}
        </Text>
      </ExternalLink>
    ),
    amount: (
      <div className="flex flow-col align-center justify-end">
        <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
        <Text type="p2" weight="700" color="primary">
          100,000
        </Text>
      </div>
    ),
  },
  {
    key: '4',
    address: (
      <ExternalLink href={getEtherscanTxUrl('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')} className="link-blue mb-4">
        <Text type="p1" weight="semibold" color="var(--gradient-blue-safe)" textGradient="var(--gradient-blue)">
          {shortenAddr('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')}
        </Text>
      </ExternalLink>
    ),
    amount: (
      <div className="flex flow-col align-center justify-end">
        <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
        <Text type="p2" weight="700" color="primary">
          100,000
        </Text>
      </div>
    ),
  },
  {
    key: '5',
    address: (
      <ExternalLink href={getEtherscanTxUrl('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')} className="link-blue mb-4">
        <Text type="p1" weight="semibold" color="var(--gradient-blue-safe)" textGradient="var(--gradient-blue)">
          {shortenAddr('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')}
        </Text>
      </ExternalLink>
    ),
    amount: (
      <div className="flex flow-col align-center justify-end">
        <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
        <Text type="p2" weight="700" color="primary">
          100,000
        </Text>
      </div>
    ),
  },
  {
    key: '5',
    address: (
      <ExternalLink href={getEtherscanTxUrl('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')} className="link-blue mb-4">
        <Text type="p1" weight="semibold" color="var(--gradient-blue-safe)" textGradient="var(--gradient-blue)">
          {shortenAddr('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')}
        </Text>
      </ExternalLink>
    ),
    amount: (
      <div className="flex flow-col align-center justify-end">
        <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
        <Text type="p2" weight="700" color="primary">
          100,000
        </Text>
      </div>
    ),
  },
  {
    key: '6',
    address: (
      <ExternalLink href={getEtherscanTxUrl('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')} className="link-blue mb-4">
        <Text type="p1" weight="semibold" color="var(--gradient-blue-safe)" textGradient="var(--gradient-blue)">
          {shortenAddr('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')}
        </Text>
      </ExternalLink>
    ),
    amount: (
      <div className="flex flow-col align-center justify-end">
        <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
        <Text type="p2" weight="700" color="primary">
          100,000
        </Text>
      </div>
    ),
  },
  {
    key: '7',
    address: (
      <ExternalLink href={getEtherscanTxUrl('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')} className="link-blue mb-4">
        <Text type="p1" weight="semibold" color="var(--gradient-blue-safe)" textGradient="var(--gradient-blue)">
          {shortenAddr('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')}
        </Text>
      </ExternalLink>
    ),
    amount: (
      <div className="flex flow-col align-center justify-end">
        <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
        <Text type="p2" weight="700" color="primary">
          100,000
        </Text>
      </div>
    ),
  },
  {
    key: '8',
    address: (
      <ExternalLink href={getEtherscanTxUrl('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')} className="link-blue mb-4">
        <Text type="p1" weight="semibold" color="var(--gradient-blue-safe)" textGradient="var(--gradient-blue)">
          {shortenAddr('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')}
        </Text>
      </ExternalLink>
    ),
    amount: (
      <div className="flex flow-col align-center justify-end">
        <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
        <Text type="p2" weight="700" color="primary">
          100,000
        </Text>
      </div>
    ),
  },
  {
    key: '9',
    address: (
      <ExternalLink href={getEtherscanTxUrl('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')} className="link-blue mb-4">
        <Text type="p1" weight="semibold" color="var(--gradient-blue-safe)" textGradient="var(--gradient-blue)">
          {shortenAddr('0x22A674F22Dafc25a16A29aD5c2a7710ceE1076FF')}
        </Text>
      </ExternalLink>
    ),
    amount: (
      <div className="flex flow-col align-center justify-end">
        <Icon width={19} height={19} name="png/fiat-dao" className="mr-4" />
        <Text type="p2" weight="700" color="primary">
          100,000
        </Text>
      </div>
    ),
  },
];

const LastClaimed = () => {
  return (
    <Table
      showHeader={false}
      pagination={{ pageSize: 8, position: ['bottomCenter'], defaultPageSize: 8, pageSizeOptions: ['8'] }}
      columns={columns}
      dataSource={data}
    />
  );
};

export default LastClaimed;
