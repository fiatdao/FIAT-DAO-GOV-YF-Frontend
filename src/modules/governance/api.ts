import BigNumber from 'bignumber.js';
import QueryString from 'query-string';
import {getHumanValue} from 'web3/utils';

import config from 'config';
import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import {VotingPower} from "./votingPower";
import {ProposalHistory} from "./stateHistory";

type PaginatedResult<T extends Record<string, any>> = {
  data: T[];
  meta: {
    count: number;
  };
};

export type APIOverviewData = {
  avgLockTimeSeconds: number;
  totalDelegatedPower: BigNumber;
  holders: number;
  holdersStakingExcluded: number;
  voters: number;
  kernelUsers: number;
};

export function fetchOverviewData(): Promise<APIOverviewData> {
  const client = new ApolloClient({
    uri: config.graph.graphUrl,
    cache: new InMemoryCache(),
  });

  return client
    .query({
      query: gql`
      query GetOverview {
        overview(id: "OVERVIEW") {
          avgLockTimeSeconds
          totalDelegatedPower
          voters
          kernelUsers
          holders
        }
      }
    `})
    .then(result => {
      console.log(result);
      return {
        ...result.data.overview,
        totalDelegatedPower: getHumanValue(new BigNumber(result.data.overview.totalDelegatedPower), 18)
      }
    })
    .catch(e => {
      console.log(e)
      return { data: {}};
    })
}

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
  const client = new ApolloClient({
    uri: config.graph.graphUrl,
    cache: new InMemoryCache(),
  });

  return client
    .query({

      query: gql`
      query GetVoters ($limit: Int, $offset: Int) {
        voters (first: $limit, skip: $offset, orderBy: _tokensStakedWithoutDecimals, orderDirection: desc, where:{isKernelUser:true}){
          id
          tokensStaked
          lockedUntil
          delegatedPower
          votes
          proposals
          hasActiveDelegation
        }
        overview (id: "OVERVIEW") {
          kernelUsers
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
        data: (result.data.voters ?? []).map((voter: any) => ({
          address: voter.id,
          tokensStaked: getHumanValue(new BigNumber(voter.tokensStaked), 18),
          lockedUntil: voter.lockedUntil,
          delegatedPower: getHumanValue(new BigNumber(voter.delegatedPower), 18),
          votes: voter.votes,
          proposals: voter.proposals,
          votingPower: getHumanValue(VotingPower.calculate(voter), 18)
        })),
        meta: {count: result.data.overview.kernelUsers, block: 0}
      };
    }))
    .catch(e => {
      console.log(e)
      return { data: [], meta: { count: 0, block: 0 } }
    })
}

export enum APIProposalState {
  CREATED = 'CREATED',
  WARMUP = 'WARMUP',
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  FAILED = 'FAILED',
  ACCEPTED = 'ACCEPTED',
  QUEUED = 'QUEUED',
  GRACE = 'GRACE',
  EXPIRED = 'EXPIRED',
  EXECUTED = 'EXECUTED',
  ABROGATED = 'ABROGATED',
}

export enum APIProposalStateId {
  WARMUP = 0,
  ACTIVE,
  CANCELED,
  FAILED,
  ACCEPTED,
  QUEUED,
  GRACE,
  EXPIRED,
  EXECUTED,
  ABROGATED,
}

export const APIProposalStateMap = new Map<APIProposalState, string>([
  [APIProposalState.CREATED, 'Created'],
  [APIProposalState.WARMUP, 'Warm-Up'],
  [APIProposalState.ACTIVE, 'Voting'],
  [APIProposalState.CANCELED, 'Canceled'],
  [APIProposalState.FAILED, 'Failed'],
  [APIProposalState.ACCEPTED, 'Accepted'],
  [APIProposalState.QUEUED, 'Queued for execution'],
  [APIProposalState.GRACE, 'Pending execution'],
  [APIProposalState.EXPIRED, 'Expired'],
  [APIProposalState.EXECUTED, 'Executed'],
  [APIProposalState.ABROGATED, 'Abrogated'],
]);

export type APILiteProposalEntity = {
  proposalId: number;
  proposer: string;
  title: string;
  description: string;
  createTime: number;
  state: APIProposalState;
  stateTimeLeft: number | null;
  forVotes: BigNumber;
  againstVotes: BigNumber;
};

function buildStateFilter(state: string) {
  if (state == "ALL") {
    return [];
  }

  let filter = [];
  switch (state) {
    case APIProposalState.ACTIVE:
      filter.push(APIProposalState.WARMUP, APIProposalState.ACTIVE, APIProposalState.ACCEPTED, APIProposalState.QUEUED, APIProposalState.GRACE)
      break;
    case APIProposalState.FAILED:
      filter.push(APIProposalState.CANCELED, APIProposalState.FAILED, APIProposalState.ABROGATED, APIProposalState.EXPIRED);
      break;
    default:
      filter.push(state)
      break;
  }
  return filter;
}

export function fetchProposals(
  page = 1,
  limit = 10,
  state: string = 'ALL',
): Promise<PaginatedResult<APILiteProposalEntity>> {
  const client = new ApolloClient({
    uri: config.graph.graphUrl,
    cache: new InMemoryCache(),
  });
  let stateFilter = buildStateFilter(state.toUpperCase());
  return client
    .query({

    query: gql`
      query GetProposals {
        proposals (first: 1000) {
          id
          proposer
          title
          description
          createTime
          state
          forVotes
          againstVotes
          warmUpDuration
          activeDuration
          queueDuration
          gracePeriodDuration
          events(orderBy:createTime, orderDirection: desc) {
            proposalId
            caller
            eventType
            createTime
            txHash
            eta
          }
        }
        overview (id: "OVERVIEW") {
          proposals
        }
      }
    `,
    })
    .then((async response => {
      let result: PaginatedResult<APILiteProposalEntity> = {
        data: [],
        meta: {count: response.data.overview.proposals.length}
      };

      for (let i = 0; i < response.data.proposals.length; i++) {
        const graphProposal = response.data.proposals[i];
        const liteProposal: APILiteProposalEntity = {...graphProposal};
        const history = await ProposalHistory.build(graphProposal);
        liteProposal.proposalId = Number.parseInt(graphProposal.id);
        liteProposal.forVotes = getHumanValue(new BigNumber(graphProposal.forVotes), 18)!;
        liteProposal.againstVotes = getHumanValue(new BigNumber(graphProposal.againstVotes), 18)!
        liteProposal.stateTimeLeft = ProposalHistory.computeTimeLeft(state, graphProposal);
        liteProposal.state = history[0].name as APIProposalState;
        result.data.push(liteProposal);
      }

      // Apply filter based on the proposal state
      result.data = result.data.filter((p: APILiteProposalEntity) => {
        return stateFilter.length == 0 || stateFilter.indexOf(p.state) != -1;
      });
      // Sort based on Proposal Id
      result.data = result.data.sort((a:APILiteProposalEntity, b:APILiteProposalEntity) => b.proposalId - a.proposalId );
      // Paginate the result
      result.data = result.data.slice(limit * (page - 1), limit * page);
      return result;
    }))
    .catch(e => {
      console.log(e)
      return { data: [], meta: {count: 0, block: 0}}
    });
}

export type APIProposalHistoryEntity = {
  name: string;
  startTimestamp: number;
  endTimestamp: number;
  txHash: string;
};

export type APIProposalEntity = APILiteProposalEntity & {
  blockTimestamp: number;
  warmUpDuration: number;
  activeDuration: number;
  queueDuration: number;
  gracePeriodDuration: number;
  minQuorum: number;
  acceptanceThreshold: number;
  targets: string[];
  values: string[];
  signatures: string[];
  calldatas: string[];
  history: APIProposalHistoryEntity[];
};

export function fetchProposal(proposalId: number): Promise<APIProposalEntity> {
  const client = new ApolloClient({
    uri: config.graph.graphUrl,
    cache: new InMemoryCache(),
  });

  return client
    .query({

      query: gql`
      query GetProposal($proposalId:String) {
        proposal (id: $proposalId) {
          id
          proposer
          description
          title
          createTime
          targets
          values
          signatures
          calldatas
          blockTimestamp
          warmUpDuration
          activeDuration
          queueDuration
          gracePeriodDuration
          acceptanceThreshold
          minQuorum
          state
          forVotes
          againstVotes
          eta
          forVotes
          againstVotes
          events(orderBy:createTime, orderDirection: desc) {
            proposalId
            caller
            eventType
            createTime
            txHash
            eta
          }
        }
      }
      `,
      variables: {
        proposalId: proposalId.toString()
      }
    })
    .then(async result => {
      console.log(result);
      const history = await ProposalHistory.build(result.data.proposal);
      return {
        ...result.data.proposal,
        proposalId: result.data.proposal.id,
        forVotes: getHumanValue(new BigNumber(result.data.proposal.forVotes), 18)!,
        againstVotes: getHumanValue(new BigNumber(result.data.proposal.againstVotes), 18)!,
        history: history,
        state: history[0].name
      }
    })
    .catch(e => {
      console.log(e)
      return { data: {}};
    })
}

export type APIVoteEntity = {
  address: string;
  power: BigNumber;
  support: boolean;
  blockTimestamp: number;
};

function computeCountBasedOnFilter(support: boolean | undefined, proposal: any) {
  if (support == undefined) {
    // No Filter applied
    return proposal.votesCount
  } else if (support) {
    // Filter for "For Votes"
    return proposal.forVotesCount;
  } else {
    // Filter for "Against Votes"
    return proposal.againstVotesCount;
  }
}

export function fetchProposalVoters(
  proposalId: number,
  page = 1,
  limit = 10,
  support?: boolean,
): Promise<PaginatedResult<APIVoteEntity>> {
  const client = new ApolloClient({
    uri: config.graph.graphUrl,
    cache: new InMemoryCache(),
  });
  return client
    .query({
      query: gql`
        query GetProposalVotes ($proposalId: String, $limit: Int, $offset: Int, $support: Boolean) {
          proposal (id: $proposalId) {
            votesCount
            forVotesCount
            againstVotesCount
            votingHistory (first: $limit, skip: $offset, orderBy: _powerWithoutDecimals, orderDirection: desc where: {${(support != undefined) ? "support: $support" : ""}}) {
              address
              support
              blockTimestamp
              power
            }
          }
        }
      `,
      variables: {
        proposalId: proposalId.toString(),
        offset: limit * (page -1 ),
        limit: limit,
        support: support
      },
    })
    .then(result => {
    return {
        data: (result.data.proposal.votingHistory ?? []).map((item: any) => ({
          ...item,
          power: getHumanValue(new BigNumber(item.power), 18)!
        })),
        meta: {count: computeCountBasedOnFilter(support, result.data.proposal), block: 0}
      }
    })
    .catch(e => {
      console.log(e)
      return { data: [], meta: {count:0, block: 0}};
    })
}

export type APIAbrogationEntity = {
  proposalId: number;
  creator: string;
  createTime: number;
  description: string;
  forVotes: BigNumber;
  againstVotes: BigNumber;
};

export function fetchAbrogation(proposalId: number): Promise<APIAbrogationEntity> {
  const client = new ApolloClient({
    uri: config.graph.graphUrl,
    cache: new InMemoryCache(),
  });
  let apId = `${proposalId.toString()}-AP`;
  return client
    .query({
      query: gql`
      query GetAbrogation ($apId: String) {
        abrogationProposal (id: $apId) {
          id
          creator
          createTime
          description
          forVotes
          againstVotes
        }
      }
      `,
      variables: {
        apId: apId
      }
    })
  .then(result => {
    console.log(result);
    let abrogationProposal = result.data.abrogationProposal;
    return {
      ...abrogationProposal,
      proposalId: proposalId,
      forVotes: getHumanValue(new BigNumber(abrogationProposal.forVotes), 18)!,
      againstVotes: getHumanValue(new BigNumber(abrogationProposal.againstVotes), 18)!
    }
  })
  .catch(res => {
    console.log(res);
    return { data: {}}
  })
}

export type APIAbrogationVoteEntity = {
  address: string;
  power: BigNumber;
  support: boolean;
  blockTimestamp: number;
};

export function fetchAbrogationVoters(
  proposalId: number,
  page = 1,
  limit = 10,
  support?: boolean,
): Promise<PaginatedResult<APIAbrogationVoteEntity>> {
  const client = new ApolloClient({
    uri: config.graph.graphUrl,
    cache: new InMemoryCache(),
  });
  let apId = `${proposalId.toString()}-AP`;
  return client
  .query({
    query: gql`
      query GetAbrogationVotes ($apId: String, $limit: Int, $offset: Int, $support: Boolean) {
        abrogationProposal (id: $apId) {
          votesCount
          forVotesCount
          againstVotesCount
          votingHistory (first: $limit, skip: $offset, orderBy: _powerWithoutDecimals, orderDirection: desc where: {${(support != undefined) ? "support: $support" : ""}}) {
            address
            support
            blockTimestamp
            power
          }
        }
      }
    `,
    variables: {
      apId: apId,
      offset: limit * (page -1 ),
      limit: limit,
      support: support
    },
  })
  .then(result => {
    console.log(result);
    return {
      data: (result.data.abrogationProposal.votingHistory ?? []).map((item: any) => ({
        ...item,
        power: getHumanValue(new BigNumber(item.power), 18)!
      })),
      meta: {count: computeCountBasedOnFilter(support, result.data.abrogationProposal), block: 0}
    }
  })
  .catch(e => {
    console.log(e)
    return { data: [], meta: {count:0, block: 0}};
  });
}

export type APITreasuryToken = {
  tokenAddress: string;
  tokenSymbol: string;
  tokenDecimals: number;
};

export function fetchTreasuryTokens(): Promise<APITreasuryToken[]> {
  const url = new URL(`/v1/protocols/tokens/balances?addresses%5B%5D=${config.contracts.dao.governance}&network=ethereum&api_key=${config.zapper.apiKey}`, config.zapper.baseUrl);

  return fetch(url.toString())
    .then(result => result.json())
    .then((res) => {
      const assets = res[`${config.contracts.dao.governance}`].products[0].assets
      return assets.filter((t: { symbol: string; }) => t.symbol != 'ETH').map((m: { address: any; symbol: any; decimals: any; }) => {
        return {
          tokenAddress: m.address,
          tokenSymbol: m.symbol,
          tokenDecimals: m.decimals
        }
      });
    });
}

export type APITreasuryHistory = {
  accountAddress: string;
  accountLabel: string;
  counterpartyAddress: string;
  counterpartyLabel: string;
  amount: string;
  transactionDirection: string;
  tokenAddress: string;
  tokenSymbol: string;
  transactionHash: string;
  blockTimestamp: number;
  blockNumber: number;
};

type ZapperTransactionHistory = {
  hash: string;
  blockNumber: number;
  timeStamp: string;
  symbol: string;
  address: string;
  direction: string;
  from: string;
  amount: string;
  destination: string;
}

export function fetchTreasuryHistory(): Promise<PaginatedResult<APITreasuryHistory>> {

  const url = new URL(`/v1/transactions?address=${config.contracts.dao.governance}&addresses%5B%5D=${config.contracts.dao.governance}&network=ethereum&api_key=${config.zapper.apiKey}`, config.zapper.baseUrl);

  return fetch(url.toString())
    .then(result => result.json())
    .then((res) => {

      const data = res.data.map((m: ZapperTransactionHistory) => {
        return {
          accountAddress: (m.direction == 'incoming') ? m.destination : m.from,
          accountLabel: 'DAO',
          counterpartyAddress: (m.direction == 'incoming') ? m.from : m.destination,
          counterpartyLabel: "",
          amount: m.amount,
          transactionDirection: (m.direction == 'incoming') ? 'IN' : 'OUT',
          tokenAddress: m.address,
          tokenSymbol: m.symbol,
          transactionHash: m.hash,
          blockTimestamp: Number.parseInt(m.timeStamp),
          blockNumber: m.blockNumber
        }
      })

      return { data, meta: { count: data.length } };
    });
}
