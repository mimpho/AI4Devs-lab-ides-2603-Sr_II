import { Candidate, CandidateValidationError } from '../domain/Candidate';
import { ICandidateRepository } from '../domain/ICandidateRepository';

export interface CreateCandidateDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education?: string;
  experience?: string;
}

export interface IFile {
  filename: string;
  path: string;
  mimetype: string;
  size: number;
}

export class CandidateService {
  constructor(private readonly candidateRepository: ICandidateRepository) {}

  async createCandidate(data: CreateCandidateDTO, cvFile?: IFile): Promise<Candidate> {
    // Fail fast if main data is empty representing a bad request schema
    if (!data || !data.email || !data.firstName || !data.lastName) {
      throw new CandidateValidationError('Required fields are missing: firstName, lastName, or email.');
    }

    // Checking for existing email allows to gracefully reject duplicates before processing images
    const existingCandidate = await this.candidateRepository.findByEmail(data.email);
    if (existingCandidate) {
      throw new Error(`A candidate with the email ${data.email} already exists.`);
    }

    let cvUrl: string | null = null;
    
    // Abstracting file storage logic. Assuming the presentation layer (Express/Multer)
    // wrote the file to disk and provided us with the metadata. 
    if (cvFile) {
      cvUrl = `/uploads/${cvFile.filename}`;
    }

    // 1. Domain Object Instantiation 
    // This executes business invariant checks defined internally in Candidate.
    const candidateDomainEntity = new Candidate({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      education: data.education,
      experience: data.experience,
      cvUrl: cvUrl,
    });

    // 2. Persist Entity via Repository Interface
    return await this.candidateRepository.save(candidateDomainEntity);
  }

  async getCandidateSuggestions(): Promise<{ education: string[]; experience: string[] }> {
    return await this.candidateRepository.getSuggestions();
  }
}
