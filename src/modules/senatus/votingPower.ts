import BigNumber from 'bignumber.js';

import { APIVoterEntity } from './api';

const BASE_MULTIPLIER = new BigNumber(10).pow(18);
const ONE_YEAR = new BigNumber(31556926); // 365 days, 5 hours, 48 minutes and 46 seconds

export namespace VotingPower {
  /**
   * Calculates the voting power of the Voter based on the staked tokens, delegations and locking timestamp
   * @param voter
   */
  export function calculate(voter: APIVoterEntity): BigNumber {
    let now = Math.floor(Date.now() / 1000);
    let ownVotingPower: BigNumber;
    if (voter.hasActiveDelegation) {
      ownVotingPower = BigNumber.ZERO;
    } else {
      const multiplier = computeMultiplier(voter.lockedUntil, now);
      ownVotingPower = new BigNumber(voter.tokensStaked).multipliedBy(multiplier).dividedBy(BASE_MULTIPLIER);
    }
    return ownVotingPower.plus(voter.delegatedPower);
  }
}

function computeMultiplier(lockedUntil: number, now: number) {
  if (now >= lockedUntil) {
    return BASE_MULTIPLIER;
  }

  let diff = new BigNumber(lockedUntil - now);
  if (diff.gte(ONE_YEAR)) {
    return BASE_MULTIPLIER.multipliedBy(new BigNumber(2));
  }
  return BASE_MULTIPLIER.plus(diff.multipliedBy(BASE_MULTIPLIER).dividedBy(ONE_YEAR));
}
