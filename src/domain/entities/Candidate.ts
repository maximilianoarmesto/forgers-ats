import { Email } from '../value-objects/Email';
import { CandidateStage, Stage } from '../value-objects/CandidateStage';
import { LinkedInUrl } from '../value-objects/LinkedInUrl';
import { InvalidCandidateNameError } from '../errors/DomainError';

/**
 * A stored reference to an uploaded résumé: the opaque storage key plus the
 * original file name (kept for display/download).
 */
export interface ResumeReference {
  key: string;
  fileName: string;
}

export interface CandidateProps {
  id: string;
  fullName: string;
  email: Email;
  stage: CandidateStage;
  jobTitle: string;
  linkedInUrl: LinkedInUrl | null;
  resume: ResumeReference | null;
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
    linkedInUrl?: string | null;
    resume?: ResumeReference | null;
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
      linkedInUrl: params.linkedInUrl ? LinkedInUrl.create(params.linkedInUrl) : null,
      resume: params.resume ?? null,
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
    linkedInUrl?: string | null;
    resumeKey?: string | null;
    resumeFileName?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Candidate {
    return new Candidate({
      id: props.id,
      fullName: props.fullName,
      email: Email.create(props.email),
      stage: CandidateStage.from(props.stage),
      jobTitle: props.jobTitle,
      linkedInUrl: props.linkedInUrl ? LinkedInUrl.create(props.linkedInUrl) : null,
      resume:
        props.resumeKey && props.resumeFileName
          ? { key: props.resumeKey, fileName: props.resumeFileName }
          : null,
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

  /**
   * Update the candidate's full name, re-validating the invariant.
   */
  rename(fullName: string, now: Date = new Date()): void {
    this.props.fullName = Candidate.validateName(fullName);
    this.props.updatedAt = now;
  }

  /**
   * Update the candidate's job title, re-validating the invariant.
   */
  changeJobTitle(jobTitle: string, now: Date = new Date()): void {
    this.props.jobTitle = Candidate.validateName(jobTitle);
    this.props.updatedAt = now;
  }

  /**
   * Update the candidate's email. The Email VO enforces its own format
   * invariant; uniqueness across candidates is an application-level concern.
   */
  changeEmail(email: string, now: Date = new Date()): void {
    this.props.email = Email.create(email);
    this.props.updatedAt = now;
  }

  /**
   * Set or clear the candidate's LinkedIn profile link. Passing null/empty
   * removes it; the LinkedInUrl VO enforces the format invariant.
   */
  changeLinkedInUrl(url: string | null, now: Date = new Date()): void {
    const trimmed = url?.trim() ?? '';
    this.props.linkedInUrl = trimmed.length > 0 ? LinkedInUrl.create(trimmed) : null;
    this.props.updatedAt = now;
  }

  /**
   * Attach (or replace) the candidate's résumé reference.
   */
  attachResume(resume: ResumeReference, now: Date = new Date()): void {
    this.props.resume = resume;
    this.props.updatedAt = now;
  }

  /**
   * Remove the candidate's résumé reference, if any.
   */
  removeResume(now: Date = new Date()): void {
    this.props.resume = null;
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

  get linkedInUrl(): LinkedInUrl | null {
    return this.props.linkedInUrl;
  }

  get resume(): ResumeReference | null {
    return this.props.resume;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
