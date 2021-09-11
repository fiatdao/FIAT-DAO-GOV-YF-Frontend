import BigNumber from 'bignumber.js';
import QueryString from 'query-string';
import {getHumanValue} from 'web3/utils';

import config from 'config';
import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import {getProposalStateCall, ProposalState} from "./contracts/daoGovernance";

const API_URL = config.api.baseUrl;

type PaginatedResult<T extends Record<string, any>> = {
  data: T[];
  meta: {
    count: number;
  };
};

export type APIOverviewData = {
  avgLockTimeSeconds: number;
  totalDelegatedPower: BigNumber;
  TotalVKek: BigNumber;
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
        totalDelegatedPower: getHumanValue(new BigNumber(result.data.overview.totalDelegatedPower), 18),
        TotalVKek: BigNumber.ZERO, //TODO not supported
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

  // TODO GraphQL sorting does not work since tokensStaked is String!
  // TODO VotingPower is not accounted yet
  return client
    .query({

      query: gql`
      query GetVoters ($limit: Int, $offset: Int) {
        voters (first: $limit, skip: $offset){
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
        data: (result.data.voters ?? []).map((item: any) => ({
          address: item.id,
          tokensStaked: getHumanValue(new BigNumber(item.tokensStaked), 18),
          lockedUntil: item.lockedUntil,
          delegatedPower: getHumanValue(new BigNumber(item.delegatedPower), 18),
          votes: item.votes,
          proposals: item.proposals,
          votingPower: getHumanValue(new BigNumber(item.tokensStaked), 18) // TODO - voting power not calculated yet
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

function getTimeLeft(state: string, proposal: any): number {
  const now = Math.floor(Date.now() / 1000);
  switch (state) {
    case APIProposalState.WARMUP:
      return proposal.createTime + proposal.warmUpDuration - now;
    case APIProposalState.ACTIVE:
      return proposal.createTime + proposal.warmUpDuration + proposal.activeDuration - now;
    case APIProposalState.QUEUED:
      return proposal.createTime + proposal.warmUpDuration + proposal.activeDuration + proposal.queueDuration - now;
    case APIProposalState.GRACE:
      return proposal.createTime + proposal.warmUpDuration + proposal.queueDuration + proposal.gracePeriodDuration - now;
    default:
      return 0;
  }
}

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
        const history = await buildProposalHistory(graphProposal);
        liteProposal.proposalId = Number.parseInt(graphProposal.id);
        liteProposal.forVotes = getHumanValue(new BigNumber(graphProposal.forVotes), 18)!;
        liteProposal.againstVotes = getHumanValue(new BigNumber(graphProposal.againstVotes), 18)!
        liteProposal.stateTimeLeft = getTimeLeft(state, graphProposal);
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

function checkForCancelledEvent(eventsCopy: Array<any>, nextDeadline: number, history: APIProposalHistoryEntity[]) {
  if (eventsCopy.length > 0 && eventsCopy[0].createTime < nextDeadline && eventsCopy[0].eventType == "CANCELED") {
    history.push({
      name: APIProposalState.CANCELED,
      startTimestamp: eventsCopy[0].createTime,
      endTimestamp: 0,
      txHash: eventsCopy[0].txHash
    })
  }
}

function shouldStopBuilding(nextDeadline: number) {
  return nextDeadline >= Math.floor(Date.now() / 1000);
}

async function isFailedProposal(proposal: any): Promise<boolean> {
  const state = await getProposalStateCall(proposal.id)
  return state == ProposalState.Failed;
}

async function calculateEvents(proposal: any) {
  let history = new Array<APIProposalHistoryEntity>();
  let eventsCopy = JSON.parse(JSON.stringify(proposal.events)) as Array<any>;
  eventsCopy.sort((a: any, b: any) => {
    return a.createTime - b.createTime;
  });

  history.push({
    name: APIProposalState.CREATED,
    startTimestamp: proposal.createTime,
    endTimestamp: 0,
    txHash: eventsCopy[0].txHash
  });
  // Remove Created event
  eventsCopy = eventsCopy.slice(1);
  let warmUpEvent = history.push({
    name: APIProposalState.WARMUP,
    startTimestamp: proposal.createTime,
    endTimestamp: 0, //proposal.createTime+ proposal.warmUpDuration,
    txHash: ""
  });

  let nextDeadline = proposal.createTime + proposal.warmUpDuration;
  // at this point, only a CANCELED event can occur that would be final for this history
  // so we check the list of events to see if there's any CANCELED event that occurred before the WARMUP period ended
  checkForCancelledEvent(eventsCopy, nextDeadline, history);

  if (shouldStopBuilding(nextDeadline)) {
    return history;
  }

  // if the proposal was not canceled in the WARMUP period, then it means we reached ACTIVE state so we add that to
  // the history
  history.push({
    name: APIProposalState.ACTIVE,
    startTimestamp: nextDeadline + 1,
    endTimestamp: 0,
    txHash: ""
  });

  // just like in WARMUP period, the only final event that could occur in this case is CANCELED
  nextDeadline = proposal.createTime + proposal.warmUpDuration + proposal.activeDuration;
  checkForCancelledEvent(eventsCopy, nextDeadline, history);

  if (shouldStopBuilding(nextDeadline)) {
    return history;
  }

  history.push({
    name: (await isFailedProposal(proposal)) ? APIProposalState.FAILED : APIProposalState.ACCEPTED,
    startTimestamp: nextDeadline + 1,
    endTimestamp: 0,
    txHash: ""
  });

  // after the proposal reached accepted state, nothing else can happen unless somebody calls the queue function
  // which emits a QUEUED event
  if(eventsCopy.length == 0) {
    return history;
  }

  if (eventsCopy[0].eventType == APIProposalState.QUEUED) {
    history.push({
      name: APIProposalState.QUEUED,
      startTimestamp: proposal.createTime + proposal.warmUpDuration + proposal.activeDuration + 1,
      endTimestamp: 0,
      txHash: eventsCopy[0].txHash,
    })
  }
  eventsCopy = eventsCopy.slice(1);

  nextDeadline = proposal.createTime + proposal.warmUpDuration + proposal.activeDuration + proposal.queueDuration;
  if (shouldStopBuilding(nextDeadline)) {
    return history;
  }

  // TODO add logic for abrogation proposals

  // No abrogation proposal or did not pass
  history.push({
    name: APIProposalState.GRACE,
    startTimestamp: nextDeadline,
    endTimestamp: 0,
    txHash: ""
  });

  nextDeadline += proposal.gracePeriodDuration;
  if (eventsCopy.length > 0 && eventsCopy[0].createTime <= nextDeadline
    && eventsCopy[0].eventType == APIProposalState.EXECUTED) {
    history.push({
      name: APIProposalState.EXECUTED,
      startTimestamp: eventsCopy[0].createTime,
      endTimestamp: 0,
      txHash: eventsCopy[0].txHash
    });
    return history;
  }

  if (shouldStopBuilding(nextDeadline)) {
    return history;
  }

  history.push({
    name: APIProposalState.EXPIRED,
    startTimestamp: nextDeadline,
    endTimestamp: 0,
    txHash: ""
  });

  return history;
}

async function buildProposalHistory(proposal: any): Promise<APIProposalHistoryEntity[]> {
  let history = await calculateEvents(proposal);

  // Sort and Populate Timestamps
  history.sort((e1, e2) => {
    if (e1.name == APIProposalState.CREATED && e2.name == APIProposalState.WARMUP) {
      return 1;
    } else if (e2.name == APIProposalState.CREATED && e1.name == APIProposalState.WARMUP) {
      return -1;
    }

    if (e1.name == APIProposalState.ACCEPTED && e2.name == APIProposalState.QUEUED) {
      return 1;
    } else if (e2.name == APIProposalState.ACCEPTED && e1.name == APIProposalState.QUEUED) {
      return -1;
    }

    return  e2.startTimestamp - e1.startTimestamp;
  });

  for (let i = 1; i <= history.length-1; i++) {
    history[i].endTimestamp = history[i-1].startTimestamp -1;
  }
  history[0].endTimestamp = lastEventEndAt(proposal, history[0]);

  return history;
}

function lastEventEndAt(proposal: any, event: APIProposalHistoryEntity): number {
  switch (event.name) {
    case APIProposalState.WARMUP:
      return event.startTimestamp + proposal.warmUpDuration;
    case APIProposalState.ACTIVE:
      return event.startTimestamp + proposal.activeDuration;
    case APIProposalState.QUEUED:
      return event.startTimestamp + proposal.queueDuration;
    case APIProposalState.GRACE:
      return event.startTimestamp + proposal.gracePeriodDuration;
    default:
      return 0
  }
}

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
      const history = await buildProposalHistory(result.data.proposal);
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
        query GetVotes ($proposalId: String, $limit: Int, $offset: Int, $support: Boolean) {
          votes (proposalId: $proposalId, first: $limit, skip: $offset, where: {${(support != undefined) ? "support: $support" : ""}}) {
            address
            support
            blockTimestamp
            power
          }
          proposal (id: $proposalId) {
            votesCount
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
        data: (result.data.votes ?? []).map((item: any) => ({
          ...item,
          power: getHumanValue(new BigNumber(item.power), 18)!
        })),
        meta: {count: result.data.proposal.votesCount, block: 0}
      }
    })
    .catch(e => {
      console.log(e)
      return { data: [], meta: {count:0, block: 0}};
    })
}

export type APIAbrogationEntity = {
  proposalId: number;
  caller: string;
  createTime: number;
  description: string;
  forVotes: BigNumber;
  againstVotes: BigNumber;
};

export function fetchAbrogation(proposalId: number): Promise<APIAbrogationEntity> {
  const url = new URL(`/api/governance/abrogation-proposals/${proposalId}`, API_URL);

  return fetch(url.toString())
    .then(result => result.json())
    .then(({ data, status }) => {
      if (status !== 200) {
        return Promise.reject(status);
      }
      return data;
    })
    .then((data: APIAbrogationEntity) => ({
      ...data,
      forVotes: getHumanValue(new BigNumber(data.forVotes), 18)!,
      againstVotes: getHumanValue(new BigNumber(data.againstVotes), 18)!,
    }));
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
  const query = QueryString.stringify(
    {
      page: String(page),
      limit: String(limit),
      support,
    },
    {
      skipNull: true,
      skipEmptyString: true,
      encode: true,
    },
  );

  const url = new URL(`/api/governance/abrogation-proposals/${proposalId}/votes?${query}`, API_URL);

  return fetch(url.toString())
    .then(result => result.json())
    .then(({ status, ...data }) => {
      if (status !== 200) {
        return Promise.reject(status);
      }

      return data;
    })
    .then((result: PaginatedResult<APIVoteEntity>) => ({
      ...result,
      data: (result.data ?? []).map(vote => ({
        ...vote,
        power: getHumanValue(new BigNumber(vote.power), 18)!,
      })),
    }));
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
