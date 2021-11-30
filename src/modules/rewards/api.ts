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


export type APIAirdropTotal = {
  totalFDTAirdropClaimed: string;
  totalFDTAirdropRedistributed: string;
};

export function fetchAirdropTotal(
  first = 1,
): Promise<APIAirdropTotal> {
  return GraphClient.get({
    query: gql`
      query($first: Int){
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
  .then(({ data }) => {
    return {
      totalFDTAirdropClaimed: data.overviews.length ? data.overviews[0].totalFDTAirdropClaimed : '0',
      totalFDTAirdropRedistributed: data.overviews.length ? data.overviews[0].totalFDTAirdropRedistributed: '0',
    }
  })
  .catch(e => {
    console.log(e)
    return {
      totalFDTAirdropClaimed: '0',
      totalFDTAirdropRedistributed: '0',
    }
  })
}

export type APIAirdropClaims = {
  adjustedAmount: string;
  redistributedAmount: string;
};

export function fetchAirdropClaims(
  first = 100,
): Promise<APIAirdropClaims> {
  return GraphClient.get({
    query: gql`
      query($first: Int){
        claims(first: $first) {
          adjustedAmount
          redistributedAmount
        }
      }
    `,
    variables: {
      first: first,
    },
  })
  .then(({ data }) => {
    return {
      adjustedAmount: data.claims.length ? data.claims[0].adjustedAmount : '0',
      redistributedAmount: data.claims.length ? data.claims[0].redistributedAmount: '0',
    }
  })
  .catch(e => {
    console.log(e)
    return {
      adjustedAmount: '0',
      redistributedAmount: '0',
    }
  })
}
