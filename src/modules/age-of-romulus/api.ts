import BigNumber from 'bignumber.js';
import {getHumanValue} from 'web3/utils';

import { gql } from "@apollo/client";
import { GraphClient } from "../../web3/graph/client";

type PaginatedResult<T extends Record<string, any>> = {
  data: T[];
  meta: {
    count: number;
  };
};

export type APIVoterEntity = {
  address: string;
  tokensStaked: BigNumber;
  lockedUntil: number;
  delegatedPower: BigNumber;
  votes: number;
  proposals: number;
  votingPower: BigNumber;
  hasActiveDelegation: boolean;
};

export function fetchVoters(page = 1, limit = 10): Promise<PaginatedResult<APIVoterEntity>> {
  return GraphClient.get({
    query: gql`
      query GetVoters ($limit: Int, $offset: Int) {
        voters (first: $limit, skip: $offset, orderBy: votingPower, orderDirection: desc, where:{isComitiumUser:true}){
          id
          votingPower
        }
        overview (id: "OVERVIEW") {
          comitiumUsers
        }
      }
    `,
    variables: {
      offset: limit * (page - 1),
      limit: limit
    },
  })
  .then((result => {
    console.log(result)

    return {
      ...result,
      data: (result.data.voters ?? []).map((voter: any, index: number) => {
        return ({
          rank: index + 1,
          address: voter.id,
          votingPower: getHumanValue(new BigNumber(voter.votingPower), 18)
        })
      }),
      meta: {count: result.data.overview.comitiumUsers, block: 0}
    };
  }))
  .catch(e => {
    console.log(e)
    return { data: [], meta: { count: 0, block: 0 } }
  })
}

export function fetchCountAllUsers(): Promise<number> {
  return GraphClient.get({
    query: gql`
      query GetCountAllUsers {
        overview (id: "OVERVIEW") {
          comitiumUsers
        }
      }
    `,
  })
  .then((result => {
    console.log(result)

    return result.data.overview.comitiumUsers;
  }))
  .catch(e => {
    console.log(e)
    return 0
  })
}
