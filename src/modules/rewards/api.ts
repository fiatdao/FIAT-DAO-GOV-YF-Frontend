import { gql } from '@apollo/client';
import BigNumber from 'bignumber.js';

import { PaginatedResult } from 'utils/fetch';
import {GraphClient} from "../../web3/graph/client";

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
  return GraphClient.get({
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


export type APIAirdropInfo = {
  totalFDTAirdropClaimed: string;
  totalFDTAirdropRedistributed: string;
};

export function fetchAirdropInfo(
  first = 1000,
): Promise<APIAirdropInfo> {
  return GraphClient.get({
    query: gql`
      query($first: Int,){
        overviews(first: $first) {
          totalFDTAirdropClaimed
          totalFDTAirdropRedistributed
        }
      }
    `,
    variables: {
      first: first,
    },
  })
  .catch(e => {
    console.log(e)
    return { data: [] }
  })
  .then(result => {
    console.log(result)
    return {
      totalFDTAirdropClaimed: '1',
      totalFDTAirdropRedistributed: '1',
    }
    // return { data: result.data.transactions.slice(limit * (page - 1), limit * page), meta: { count: result.data.transactions.length, block: page } }
  })
}
