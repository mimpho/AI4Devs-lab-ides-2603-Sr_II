import { Request, Response } from 'express';
import { CandidateService, IFile } from '../application/CandidateService';
import { CandidateValidationError } from '../domain/Candidate';
import { DuplicateEmailError } from '../infrastructure/CandidateRepository';

export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  public addCandidate = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;
      let cvFile: IFile | undefined = undefined;

      if (req.file) {
        cvFile = {
          filename: req.file.filename,
          path: req.file.path,
          mimetype: req.file.mimetype,
          size: req.file.size,
        };
      }

      const newCandidate = await this.candidateService.createCandidate(data, cvFile);

      res.status(201).json({
        message: 'Candidate created successfully',
        data: newCandidate,
      });
    } catch (error: any) {
      if (error.name === 'CandidateValidationError') {
        res.status(400).json({ error: 'Validation_Error', message: error.message });
      } else if (error.name === 'DuplicateEmailError' || error.message.includes('already exists')) {
        res.status(409).json({ error: 'Conflict', message: error.message });
      } else {
        console.error('Unexpected error creating candidate:', error);
        res.status(500).json({ error: 'Internal_Server_Error', message: 'An unexpected error occurred' });
      }
    }
  };
}
