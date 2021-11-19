import React, { useState } from 'react';
import { ColumnsType } from 'antd/lib/table/interface';
import BigNumber from 'bignumber.js';
import cn from 'classnames';
import { formatBigValue, getEtherscanAddressUrl, shortenAddr } from 'web3/utils';

import Table from 'components/antd/table';
import ExternalLink from 'components/custom/externalLink';
import Icon from 'components/custom/icon';
import Identicon from 'components/custom/identicon';
import { Text } from 'components/custom/typography';
import { APIVoterEntity, fetchVoters } from 'modules/age-of-romulus/api';
import AmphoraList from 'modules/age-of-romulus/prize/amphora.json';
import CoronaList from 'modules/age-of-romulus/prize/corona.json';
import GaleaList from 'modules/age-of-romulus/prize/galea.json';
import GladiusList from 'modules/age-of-romulus/prize/gladius.json';
import KitharaList from 'modules/age-of-romulus/prize/kithara.json';

interface IJsonItem {
  [key: string]: unknown;
  address: string;
}

const Columns: ColumnsType<APIVoterEntity> = [
  {
    title: 'Rank',
    dataIndex: 'rank',
    render: (value: string) => <div className="flex  align-center">{value}</div>,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    render: (value: string) => (
      <div className="flex col-gap-16 align-center">
        <Identicon address={value} width={32} height={32} />
        <ExternalLink href={getEtherscanAddressUrl(value)} className="link-blue">
          <Text type="p1" weight="semibold" ellipsis className="hidden-mobile hidden-tablet" color="primary">
            {value}
          </Text>
          <Text type="p1" weight="semibold" wrap={false} color="primary" className="hidden-desktop">
            {shortenAddr(value)}
          </Text>
        </ExternalLink>
      </div>
    ),
  },
  {
    title: 'vFDT',
    dataIndex: 'votingPower',
    align: 'right',
    render: (value: BigNumber) => (
      <Text type="p1" weight="semibold" className="ml-auto">
        {formatBigValue(value, 2, '-', 2)}
      </Text>
    ),
  },

  {
    title: 'Prize',
    dataIndex: 'prize',
    width: 266,
    align: 'right',
    render: (value: number, { address }) => {
      return (
        <div className="flex col-gap-16 align-center">
          {AmphoraList.find((i: IJsonItem) => i?.address === address) && <Icon name="png/roman-amphora" />}
          {KitharaList.find((i: IJsonItem) => i?.address === address) && <Icon name="png/roman-kithara" />}
          {GaleaList.find((i: IJsonItem) => i?.address === address) && <Icon name="png/roman-galea" />}
          {GladiusList.find((i: IJsonItem) => i?.address === address) && <Icon name="png/roman-gladius" />}
          {CoronaList.find((i: IJsonItem) => i?.address === address) && <Icon name="png/roman-corona" />}
        </div>
      );
    },
  },
];

export type VotersTableProps = {
  className?: string;
};

const AgeOfRomulusTable: React.FC<VotersTableProps> = props => {
  const { className } = props;

  const [loading, setLoading] = useState<boolean>(false);
  const [voters, setVoters] = useState<APIVoterEntity[]>([]);
  const [totalVoters, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  React.useEffect(() => {
    setLoading(true);

    fetchVoters(page, pageSize)
      .then(data => {
        setVoters(data.data);
        setTotal(data.meta.count);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [page, pageSize]);

  return (
    <div className={cn('card', className)}>
      <div className="card-header">
        <Text type="p1" weight="semibold" color="primary" font="secondary">
          Leaderboard
        </Text>
      </div>
      <Table<APIVoterEntity>
        inCard
        columns={Columns}
        dataSource={voters}
        rowKey="address"
        loading={loading}
        pagination={{
          total: totalVoters,
          pageSize,
          current: page,
          position: ['bottomRight'],
          showTotal: (total: number, [from, to]: [number, number]) => (
            <>
              <Text type="p2" weight="semibold" color="secondary" className="hidden-mobile">
                Showing {from} to {to} out of {total} stakers
              </Text>
              <Text type="p2" weight="semibold" color="secondary" className="hidden-tablet hidden-desktop">
                {from}..{to} of {total}
              </Text>
            </>
          ),
          onChange: setPage,
        }}
        scroll={{
          x: true,
        }}
      />
    </div>
  );
};

export default AgeOfRomulusTable;
