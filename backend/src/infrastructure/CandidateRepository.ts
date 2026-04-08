import { PrismaClient } from '@prisma/client';
import { Candidate } from '../domain/Candidate';
import { ICandidateRepository } from '../domain/ICandidateRepository';

export class DuplicateEmailError extends Error {
  constructor(email: string) {
    super(`A candidate with the email ${email} already exists.`);
    this.name = 'DuplicateEmailError';
  }
}

/**
 * Implementation of ICandidateRepository using Prisma as the data provider.
 */
export class CandidateRepository implements ICandidateRepository {
  private prisma: PrismaClient;

  /**
   * Initializes the repository with a PrismaClient.
   * @param prismaClient Optional PrismaClient instance for dependency injection.
   */
  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
  }

  /**
   * Persists a candidate in the database.
   * @param candidate The candidate domain entity to save.
   * @returns The saved candidate entity with its generated ID.
   * @throws {DuplicateEmailError} if the candidate's email already exists in the system.
   */
  async save(candidate: Candidate): Promise<Candidate> {
    try {
      const data = {
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.email,
        phone: candidate.phone,
        address: candidate.address,
        education: candidate.education,
        experience: candidate.experience,
        cvUrl: candidate.cvUrl,
      };

      let savedRecord;

      if (candidate.id) {
        savedRecord = await this.prisma.candidate.update({
          where: { id: candidate.id },
          data,
        });
      } else {
        savedRecord = await this.prisma.candidate.create({
          data,
        });
      }

      return new Candidate({
        ...savedRecord,
        phone: savedRecord.phone,
        address: savedRecord.address,
        education: savedRecord.education,
        experience: savedRecord.experience,
        cvUrl: savedRecord.cvUrl,
      });
    } catch (error: any) {
      // Prisma error code P2002 corresponds to Unique Constraint Violation
      if (error.code === 'P2002') {
        throw new DuplicateEmailError(candidate.email);
      }
      throw error;
    }
  }

  /**
   * Finds a candidate by their unique email address.
   * @param email The email address to search for.
   * @returns The candidate if found, or null otherwise.
   */
  async findByEmail(email: string): Promise<Candidate | null> {
    const record = await this.prisma.candidate.findUnique({
      where: { email },
    });

    if (!record) {
      return null;
    }

    return new Candidate({
      ...record,
      phone: record.phone,
      address: record.address,
      education: record.education,
      experience: record.experience,
      cvUrl: record.cvUrl,
    });
  }

  /**
   * Retrieves unique strings for education and experience across all candidates.
   * @returns A Promise resolving to an object with arrays of unique strings.
   */
  async getSuggestions(): Promise<{ education: string[]; experience: string[] }> {
    const candidates = await this.prisma.candidate.findMany({
      select: {
        education: true,
        experience: true,
      },
    });

    const education = Array.from(new Set(candidates.map((c: any) => c.education).filter(Boolean)));
    const experience = Array.from(new Set(candidates.map((c: any) => c.experience).filter(Boolean)));

    return {
      education: education as string[],
      experience: experience as string[],
    };
  }
}
