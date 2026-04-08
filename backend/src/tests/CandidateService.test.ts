import { Candidate, CandidateValidationError } from '../domain/Candidate';
import { ICandidateRepository } from '../domain/ICandidateRepository';
import { CandidateService, CreateCandidateDTO, IFile } from '../application/CandidateService';

describe('CandidateService', () => {
  let candidateRepositoryMock: jest.Mocked<ICandidateRepository>;
  let candidateService: CandidateService;

  beforeEach(() => {
    candidateRepositoryMock = {
      save: jest.fn(),
      findByEmail: jest.fn(),
      getSuggestions: jest.fn(),
    } as any;
    candidateService = new CandidateService(candidateRepositoryMock);
  });

  it('should successfully create a candidate', async () => {
    const dto: CreateCandidateDTO = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };
    const cvFile: IFile = {
      filename: 'cv-123.pdf',
      path: '/tmp/cv-123.pdf',
      mimetype: 'application/pdf',
      size: 1024,
    };

    candidateRepositoryMock.findByEmail.mockResolvedValue(null);
    candidateRepositoryMock.save.mockImplementation(async (candidate) => candidate);

    const result = await candidateService.createCandidate(dto, cvFile);

    expect(result.firstName).toBe('John');
    expect(result.email).toBe('john.doe@example.com');
    expect(result.cvUrl).toBe('/uploads/cv-123.pdf');
    expect(candidateRepositoryMock.save).toHaveBeenCalled();
  });

  it('should throw an error if required fields are missing', async () => {
    const incompleteDto = { firstName: 'John' } as any;

    try {
      await candidateService.createCandidate(incompleteDto);
      fail('Should have thrown an error');
    } catch (error: any) {
      expect(error.name).toBe('CandidateValidationError');
      expect(error.message).toContain('Required fields are missing');
    }
  });

  it('should throw an error if email already exists', async () => {
    const dto: CreateCandidateDTO = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'duplicate@example.com',
    };
    
    candidateRepositoryMock.findByEmail.mockResolvedValue(new Candidate(dto));

    await expect(candidateService.createCandidate(dto))
      .rejects.toThrow('already exists');
  });

  it('should throw validation error for invalid email format', async () => {
    const invalidDto: CreateCandidateDTO = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
    };

    candidateRepositoryMock.findByEmail.mockResolvedValue(null);

    try {
      await candidateService.createCandidate(invalidDto);
      fail('Should have thrown an error');
    } catch (error: any) {
      expect(error.name).toBe('CandidateValidationError');
      expect(error.message).toContain('Invalid email format');
    }
  });
});
