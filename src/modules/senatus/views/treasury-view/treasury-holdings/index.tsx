import React from 'react';
import { ColumnsType } from 'antd/lib/table/interface';
import BigNumber from 'bignumber.js';
import format from 'date-fns/format';
import Erc20Contract from 'web3/erc20Contract';
import { formatToken, formatUSD, getEtherscanAddressUrl, getEtherscanTxUrl, shortenAddr } from 'web3/utils';
import Web3Contract from 'web3/web3Contract';

import Select from 'components/antd/select';
import Table from 'components/antd/table';
import Tooltip from 'components/antd/tooltip';
import ExternalLink from 'components/custom/externalLink';
import Icon, { IconNames, TokenIconNames } from 'components/custom/icon';
import TableFilter, { TableFilterType } from 'components/custom/table-filter';
import { Text } from 'components/custom/typography';
import { DEFAULT_WEB3 } from 'components/providers/eth-web3-provider';
import {
  EthToken,
  KnownTokens,
  convertTokenIn,
  convertTokenInUSD,
  getTokenBySymbol,
  getTokenPrice,
  useKnownTokens,
} from 'components/providers/known-tokens-provider';
import config from 'config';
import { useReload } from 'hooks/useReload';
import { APITreasuryHistory, APITreasuryToken, fetchTreasuryHistory, fetchTreasuryTokens } from 'modules/senatus/api';

type APITreasuryTokenEntity = APITreasuryToken & {
  token: Erc20Contract;
};

type State = {
  tokens: {
    loading: boolean;
    items: APITreasuryTokenEntity[];
    ethBalance: BigNumber;
  };
  history: {
    items: APITreasuryHistory[];
    total: number;
    page: number;
    pageSize: number;
    loading: boolean;
    filters: {
      token: string;
      direction: string;
    };
  };
};

const InitialState: State = {
  tokens: {
    loading: false,
    items: [],
    ethBalance: BigNumber.ZERO,
  },
  history: {
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
    loading: false,
    filters: {
      token: 'all',
      direction: 'all',
    },
  },
};

const getPrice = (entity: APITreasuryHistory): string | undefined => {
  const price = getTokenPrice(entity.tokenSymbol);
  if (price == undefined) {
    return undefined;
  }
  return formatUSD(Number.parseFloat(entity.amount) * price.toNumber());
};

function handleFooter(currentPageData: any) {
  return '';
}

const Columns: ColumnsType<APITreasuryHistory> = [
  {
    title: 'Token Name',
    render: (_, entity) => {
      const tokenMeta = getTokenBySymbol(entity.tokenSymbol);

      return (
        <div className="flex flow-col align-center">
          <Icon name={(tokenMeta?.icon as TokenIconNames) ?? 'token-unknown'} className="mr-16" />
          <Text type="p1" weight="semibold" color="primary" className="mr-4">
            {entity.tokenSymbol}
          </Text>
        </div>
      );
    },
  },
  {
    title: 'Transaction Hash',
    render: (_, entity) => (
      <ExternalLink href={getEtherscanTxUrl(entity.transactionHash)}>
        <Text type="p1" weight="semibold" color="blue">
          {shortenAddr(entity.transactionHash)}
        </Text>
      </ExternalLink>
    ),
  },
  {
    title: 'Date',
    render: (_, entity) => (
      <>
        <Text type="p1" weight="semibold" color="primary" className="mb-4">
          {format(entity.blockTimestamp * 1_000, 'MM.dd.yyyy')}
        </Text>
        <Text type="small" weight="semibold">
          {format(entity.blockTimestamp * 1_000, 'HH:mm')}
        </Text>
      </>
    ),
  },
  {
    title: 'Amount',
    render: (_, entity) => (
      <Tooltip placement="bottomRight" title={`${entity.amount} ${entity.tokenSymbol}`}>
        <Text type="p1" weight="semibold" color={entity.transactionDirection === 'IN' ? 'green' : 'red'}>
          {entity.transactionDirection === 'IN' ? '+' : '-'}{' '}
          {Number.parseFloat(entity.amount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
        <Text type="small" weight="semibold">
          {getPrice(entity)}
        </Text>
      </Tooltip>
    ),
  },
  {
    title: 'From',
    render: (_, entity) => {
      let address = '';
      let label = '';

      if (entity.transactionDirection === 'IN') {
        address = entity.counterpartyAddress;
        label = entity.counterpartyLabel || shortenAddr(entity.counterpartyAddress) || '';
      } else {
        address = entity.accountAddress;
        label = entity.accountLabel || shortenAddr(entity.accountAddress) || '';
      }

      return (
        <ExternalLink href={getEtherscanAddressUrl(address)}>
          <Text type="p1" weight="semibold" color="blue">
            {label}
          </Text>
        </ExternalLink>
      );
    },
  },
  {
    title: 'To',
    render: (_, entity) => {
      let address = '';
      let label = '';

      if (entity.transactionDirection === 'OUT') {
        address = entity.counterpartyAddress;
        label = entity.counterpartyLabel || shortenAddr(entity.counterpartyAddress) || '';
      } else {
        address = entity.accountAddress;
        label = entity.accountLabel || shortenAddr(entity.accountAddress) || '';
      }

      return (
        <ExternalLink href={getEtherscanAddressUrl(address)}>
          <Text type="p1" weight="semibold" color="blue">
            {label}
          </Text>
        </ExternalLink>
      );
    },
  },
];

const TreasuryHoldings: React.FC = () => {
  const [reload, version] = useReload();
  const knownTokens = useKnownTokens();
  const [state, setState] = React.useState<State>(InitialState);

  function handlePaginationChange(page: number) {
    setState(prevState => ({
      ...prevState,
      history: {
        ...prevState.history,
        page,
      },
    }));
  }

  React.useEffect(() => {
    setState(prevState => ({
      ...prevState,
      tokens: {
        ...prevState.tokens,
        loading: true,
      },
    }));

    DEFAULT_WEB3.eth
      .getBalance(config.contracts.dao.governance)
      .then(value => {
        // eth value
        const amount = BigNumber.from(value)?.unscaleBy(18);

        setState(prevState => ({
          ...prevState,
          tokens: {
            ...prevState.tokens,
            ethBalance: amount ?? BigNumber.ZERO,
          },
        }));
      })
      .catch(Error);

    fetchTreasuryTokens()
      .then(data => {
        const items = data.filter(item => Boolean(getTokenBySymbol(item.tokenSymbol as KnownTokens)));

        const mappedItems = items.map(item => {
          const tokenContract = new Erc20Contract([], item.tokenAddress);
          tokenContract.on(Web3Contract.UPDATE_DATA, reload);
          tokenContract.loadCommon();
          tokenContract.loadBalance(config.contracts.dao.governance);

          return {
            ...item,
            token: tokenContract,
          };
        });

        mappedItems.sort((a, b) => (a.token.balance?.gt(b.token.balance ?? 0) ? 1 : -1));

        setState(prevState => ({
          ...prevState,
          tokens: {
            ...prevState.tokens,
            items: mappedItems,
            loading: false,
          },
        }));
      })
      .catch(() => {
        setState(prevState => ({
          ...prevState,
          tokens: {
            ...prevState.tokens,
            items: [],
            loading: false,
          },
        }));
      });
  }, []);

  React.useEffect(() => {
    setState(prevState => ({
      ...prevState,
      history: {
        ...prevState.history,
        loading: true,
      },
    }));

    fetchTreasuryHistory()
      .then(data => {
        setState(prevState => ({
          ...prevState,
          history: {
            ...prevState.history,
            items: data.data,
            total: data.meta.count,
            loading: false,
          },
        }));
      })
      .catch(() => {
        setState(prevState => ({
          ...prevState,
          history: {
            ...prevState.history,
            items: [],
            total: 0,
            loading: false,
          },
        }));
      });
  }, [state.history.page, state.history.filters]);

  const totalHoldings = React.useMemo(() => {
    if (state.tokens.loading) {
      return undefined;
    }

    let sum = BigNumber.ZERO;

    if (state.tokens.ethBalance) {
      const amountUSD = convertTokenInUSD(state.tokens.ethBalance, EthToken.symbol);
      sum = sum.plus(amountUSD ?? 0);
    }

    return state.tokens.items.reduce((a, item) => {
      const amount = item.token.getBalanceOf(config.contracts.dao.governance)?.unscaleBy(item.tokenDecimals);
      const amountUSD = convertTokenInUSD(amount, item.tokenSymbol);

      return a.plus(amountUSD ?? 0);
    }, sum);
  }, [state.tokens, version, knownTokens.version]);

  return (
    <>
      <Text type="p1" weight="semibold" color="secondary" className="mb-8">
        Total holdings balance
      </Text>
      <Text type="h2" weight="bold" color="primary" className="mb-40">
        {formatUSD(totalHoldings) ?? '-'}
      </Text>
      <div className="flexbox-list mb-32" style={{ '--gap': '32px' } as React.CSSProperties}>
        {state.tokens.ethBalance.gt(0) && (
          <div className="card p-24" style={{ minWidth: 195 }}>
            <div className="flex mb-16">
              <Icon name={(EthToken.icon as IconNames) ?? 'token-unknown'} className="mr-8" />
              <Text type="p1" weight="semibold" color="primary">
                {EthToken.symbol}
              </Text>
            </div>
            <Tooltip
              overlayStyle={{ maxWidth: 'inherit' }}
              title={formatToken(state.tokens.ethBalance, {
                decimals: EthToken.decimals,
                tokenName: EthToken.symbol,
              })}>
              <Text type="h3" weight="bold" color="primary" className="mb-4">
                {formatToken(state.tokens.ethBalance) ?? '-'}
              </Text>
            </Tooltip>
            <Text type="small" weight="semibold" color="secondary">
              {formatUSD(convertTokenInUSD(state.tokens.ethBalance, EthToken.symbol))}
            </Text>
          </div>
        )}
        {state.tokens.items.map(item => {
          const tokenMeta = getTokenBySymbol(item.tokenSymbol);
          const amount = item.token.getBalanceOf(config.contracts.dao.governance)?.unscaleBy(item.tokenDecimals);
          const amountUSD = convertTokenInUSD(amount, item.tokenSymbol);

          return (
            <div key={item.tokenAddress} className="card p-24" style={{ minWidth: 195 }}>
              <div className="flex mb-16">
                <Icon name={(tokenMeta?.icon as IconNames) ?? 'token-unknown'} className="mr-8" />
                <Text type="p1" weight="semibold" color="primary">
                  {item.tokenSymbol}
                </Text>
              </div>
              <Tooltip
                overlayStyle={{ maxWidth: 'inherit' }}
                title={formatToken(amount, {
                  decimals: item.tokenDecimals,
                  tokenName: item.tokenSymbol,
                })}>
                <Text type="h3" weight="bold" color="primary" className="mb-4">
                  {formatToken(amount, { minDecimals: 2 }) ?? '-'}
                </Text>
              </Tooltip>
              <Text type="small" weight="semibold" color="secondary">
                {formatUSD(amountUSD)}
              </Text>
            </div>
          );
        })}
      </div>
      <div className="card">
        <div className="card-header flex flow-col align-center justify-space-between pv-12">
          <Text type="p1" weight="semibold" color="primary">
            Transaction history
          </Text>
        </div>
        <Table<APITreasuryHistory>
          columns={Columns}
          dataSource={state.history.items}
          rowKey="transactionHash"
          loading={state.history.loading}
          locale={{
            emptyText: 'No fdies',
          }}
          scroll={{
            x: true,
          }}
        />
      </div>
    </>
  );
};

export default TreasuryHoldings;
