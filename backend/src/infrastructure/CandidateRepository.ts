import { PrismaClient } from '@prisma/client';
import { Candidate } from '../domain/Candidate';
import { ICandidateRepository } from '../domain/ICandidateRepository';

export class DuplicateEmailError extends Error {
  constructor(email: string) {
    super(`A candidate with the email ${email} already exists.`);
    this.name = 'DuplicateEmailError';
  }
}

export class CandidateRepository implements ICandidateRepository {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
  }

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
}
