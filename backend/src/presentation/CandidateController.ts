import { Request, Response } from 'express';
import { CandidateService, IFile } from '../application/CandidateService';
import { CandidateValidationError } from '../domain/Candidate';
import { DuplicateEmailError } from '../infrastructure/CandidateRepository';
import fs from 'fs';

/**
 * Express controller for handling HTTP requests related to Candidates.
 */
export class CandidateController {
  /**
   * Initializes the controller with a CandidateService.
   * @param candidateService The application service for candidate logic.
   */
  constructor(private readonly candidateService: CandidateService) {}

  /**
   * Registers a new candidate. Handles file upload metadata and returns the created record.
   * @param req Express request object containing body and file.
   * @param res Express response object.
   */
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
      // Clean up uploaded file if creation failed (e.g. duplicate email, validation error)
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error(`Failed to delete orphaned file: ${req.file?.path}`, err);
        });
      }

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

  /**
   * Retrieves unique education and experience strings for autocompletion.
   * @param _req Express request object.
   * @param res Express response object.
   */
  public getSuggestions = async (_req: Request, res: Response): Promise<void> => {
    try {
      const suggestions = await this.candidateService.getCandidateSuggestions();
      res.status(200).json(suggestions);
    } catch (error: any) {
      console.error('Error fetching suggestions:', error);
      res.status(500).json({ error: 'Internal_Server_Error', message: 'Unable to fetch suggestions' });
    }
  };
}
