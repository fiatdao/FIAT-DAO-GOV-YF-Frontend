import {APIProposalHistoryEntity, APIProposalState} from "./api";
import {getProposalStateCall, ProposalState} from "./contracts/daoGovernance";

export namespace ProposalHistory {

  /**
   * Builds the Proposal History events based on the proposal
   * @param proposal
   */
  export async function build(proposal: any): Promise<APIProposalHistoryEntity[]> {
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

  /**
   * Computes the time until a given state will end
   * @param state
   * @param proposal
   */
  export function computeTimeLeft(state: string, proposal: any): number {
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
  history.push({
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

  const proposalState = await getProposalStateCall(proposal.id)
  history.push({
    name: proposalState === ProposalState.Failed ? APIProposalState.FAILED : APIProposalState.ACCEPTED,
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

  if (proposalState == ProposalState.Abrogated) {
    history.push({
      name: APIProposalState.ABROGATED,
      startTimestamp: nextDeadline,
      endTimestamp: 0,
      txHash: ""
    });
    return history;
  }

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

function shouldStopBuilding(nextDeadline: number) {
  return nextDeadline >= Math.floor(Date.now() / 1000);
}

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

