import { InvalidStageTransitionError } from '../errors/DomainError';

/**
 * CandidateStage — the lifecycle stages a candidate moves through in the
 * hiring pipeline. Modeled as a value object that also enforces the legal
 * transitions between stages (a core business rule of an ATS).
 */
export enum Stage {
  Applied = 'APPLIED',
  Screening = 'SCREENING',
  Interview = 'INTERVIEW',
  Offer = 'OFFER',
  Hired = 'HIRED',
  Rejected = 'REJECTED',
}

/**
 * Legal forward transitions. A candidate can be rejected from any
 * non-terminal stage. Terminal stages (HIRED, REJECTED) allow no transitions.
 */
const ALLOWED_TRANSITIONS: Readonly<Record<Stage, readonly Stage[]>> = {
  [Stage.Applied]: [Stage.Screening, Stage.Rejected],
  [Stage.Screening]: [Stage.Interview, Stage.Rejected],
  [Stage.Interview]: [Stage.Offer, Stage.Rejected],
  [Stage.Offer]: [Stage.Hired, Stage.Rejected],
  [Stage.Hired]: [],
  [Stage.Rejected]: [],
};

export class CandidateStage {
  private constructor(private readonly value: Stage) {}

  static from(value: Stage): CandidateStage {
    return new CandidateStage(value);
  }

  static initial(): CandidateStage {
    return new CandidateStage(Stage.Applied);
  }

  get stage(): Stage {
    return this.value;
  }

  isTerminal(): boolean {
    return ALLOWED_TRANSITIONS[this.value].length === 0;
  }

  canTransitionTo(target: Stage): boolean {
    return ALLOWED_TRANSITIONS[this.value].includes(target);
  }

  transitionTo(target: Stage): CandidateStage {
    if (!this.canTransitionTo(target)) {
      throw new InvalidStageTransitionError(this.value, target);
    }
    return new CandidateStage(target);
  }

  toString(): string {
    return this.value;
  }

  equals(other: CandidateStage): boolean {
    return this.value === other.value;
  }
}
