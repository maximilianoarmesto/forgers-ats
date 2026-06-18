import { Email } from '../value-objects/Email';
import { CandidateStage, Stage } from '../value-objects/CandidateStage';
import { InvalidCandidateNameError } from '../errors/DomainError';

export interface CandidateProps {
  id: string;
  fullName: string;
  email: Email;
  stage: CandidateStage;
  jobTitle: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Candidate — an Entity with identity (id) and a lifecycle.
 * It protects its own invariants and owns the rules for advancing
 * through the hiring pipeline.
 */
export class Candidate {
  private constructor(private props: CandidateProps) {}

  /**
   * Factory for creating a brand-new candidate entering the pipeline.
   */
  static create(params: {
    id: string;
    fullName: string;
    email: string;
    jobTitle: string;
    now?: Date;
  }): Candidate {
    const fullName = Candidate.validateName(params.fullName);
    const jobTitle = Candidate.validateName(params.jobTitle);
    const now = params.now ?? new Date();

    return new Candidate({
      id: params.id,
      fullName,
      email: Email.create(params.email),
      stage: CandidateStage.initial(),
      jobTitle,
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Rehydrate an existing candidate from persistence.
   */
  static rehydrate(props: {
    id: string;
    fullName: string;
    email: string;
    stage: Stage;
    jobTitle: string;
    createdAt: Date;
    updatedAt: Date;
  }): Candidate {
    return new Candidate({
      id: props.id,
      fullName: props.fullName,
      email: Email.create(props.email),
      stage: CandidateStage.from(props.stage),
      jobTitle: props.jobTitle,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  private static validateName(raw: string): string {
    const trimmed = raw.trim();
    if (trimmed.length < 2) {
      throw new InvalidCandidateNameError(raw);
    }
    return trimmed;
  }

  /**
   * Advance (or reject) a candidate to a new pipeline stage.
   * Delegates the legality of the transition to the CandidateStage VO.
   */
  moveToStage(target: Stage, now: Date = new Date()): void {
    this.props.stage = this.props.stage.transitionTo(target);
    this.props.updatedAt = now;
  }

  get id(): string {
    return this.props.id;
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get email(): Email {
    return this.props.email;
  }

  get stage(): CandidateStage {
    return this.props.stage;
  }

  get jobTitle(): string {
    return this.props.jobTitle;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
