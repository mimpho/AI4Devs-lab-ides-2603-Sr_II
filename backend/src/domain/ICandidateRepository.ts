import { Candidate } from './Candidate';

export interface ICandidateRepository {
  save(candidate: Candidate): Promise<Candidate>;
  findByEmail(email: string): Promise<Candidate | null>;
}
