import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import BigNumber from 'bignumber.js';

import config from 'config';
import { PaginatedResult } from 'utils/fetch';

export enum APIYFPoolActionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
}

export type APIYFPoolTransaction = {
  userAddress: string;
  tokenAddress: string;
  amount: BigNumber;
  transactionHash: string;
  actionType: APIYFPoolActionType;
  blockTimestamp: number;
};

export function fetchYFPoolTransactions(
  page = 1,
  limit = 10,
  tokenAddress: string,
  userAddress: string = 'all',
  actionType: string = 'all',
): Promise<PaginatedResult<APIYFPoolTransaction>> {
  const client = new ApolloClient({
    uri: config.graph.graphUrl,
    cache: new InMemoryCache(),
  });

  return client
    .query({

      query: gql`
      query($actionType: String, $tokenAddress: String, $userAddress: String){
        transactions(first: 1000, orderBy: blockTimestamp, orderDirection: desc, where: {${(actionType != "all") ? "actionType: $actionType," : ""}${(tokenAddress != "all") ? "tokenAddress: $tokenAddress," : ""}${(userAddress != "all") ? "userAddress: $userAddress," : ""}}){
          actionType,
          tokenAddress,
          userAddress,
          amount,
          transactionHash,
          blockTimestamp
        }
      }
    `,
      variables: {
        actionType: actionType,
        tokenAddress: (tokenAddress != "all") ? tokenAddress : undefined,
        userAddress: (userAddress != "all") ? userAddress : undefined,
      },
    })
    .catch(e => {
      console.log(e)
      return { data: [], meta: { count: 0, block: 0 } }
    })
    .then(result => {
      console.log(result)

      return { data: result.data.transactions.slice(limit * (page - 1), limit * page), meta: { count: result.data.transactions.length, block: page } }
    })
    .then((result: PaginatedResult<APIYFPoolTransaction>) => {
      return {
        ...result,
        data: (result.data ?? []).map((item: APIYFPoolTransaction) => ({
          ...item,
          amount: new BigNumber(item.amount),
        })),
      };
    });
}
