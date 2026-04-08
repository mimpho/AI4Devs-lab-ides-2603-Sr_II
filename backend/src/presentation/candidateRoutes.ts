import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { CandidateController } from './CandidateController';
import { CandidateService } from '../application/CandidateService';
import { CandidateRepository } from '../infrastructure/CandidateRepository';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
    'application/msword' // sometimes DOC files arrive if older
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and DOCX are allowed.'));
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const repository = new CandidateRepository();
const service = new CandidateService(repository);
const controller = new CandidateController(service);

const candidateRoutes = Router();

// Handle multer error explicitly in a wrapper or middleware if desired, 
// here we let the controller handle business logic. Express error handlers can pick up Multer errors.
// Route to get autocompletion suggestions
candidateRoutes.get('/suggestions', controller.getSuggestions);

// Handle candidate registration with file upload
candidateRoutes.post('/', upload.single('cvFile'), controller.addCandidate);

export { candidateRoutes };
