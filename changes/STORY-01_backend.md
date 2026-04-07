# Backend Implementation Plan: STORY-01 Añadir Candidato al Sistema

## 2. **Overview**
This feature allows a recruiter to add a new candidate to the ATS system. It includes managing the candidate's personal data, education, experience, and handling file uploads for CVs (PDF/DOCX). Following Domain-Driven Design (DDD) principles and clean architecture, the implementation will strictly separate concerns into Domain, Infrastructure, Application, and Presentation layers, ensuring complete testability and maintainability.

## 3. **Architecture Context**
- **Domain Layer**: 
  - `src/domain/Candidate.ts`: Candidate entity capturing core data and business logic.
  - `src/domain/ICandidateRepository.ts`: Interface outlining the contract for data access.
- **Application Layer**: 
  - `src/application/CandidateService.ts`: Application logic for processing raw incoming requests to proper Domain objects and handling storage logic.
  - `src/application/validator.ts` (or similar utility): For strict input validation (e.g. Zod/Joi or custom logic).
- **Infrastructure Layer**: 
  - `prisma/schema.prisma`: Defines the new `Candidate` model.
  - `src/infrastructure/CandidateRepository.ts`: Prisma implementation of `ICandidateRepository`.
  - File Storage mechanism (e.g. Multer local storage on `uploads/` folder or S3 abstraction).
- **Presentation Layer**: 
  - `src/presentation/CandidateController.ts`: Express controller delegating HTTP requests to `CandidateService`.
  - `src/presentation/candidateRoutes.ts`: Route definitions and `multer` middleware integration.

## 4. **Implementation Steps**

#### **Step 0: Create Feature Branch**
- **Action**: Create and switch to a new feature branch following the development workflow.
- **Branch Naming**: `feature/STORY-01-backend`
- **Implementation Steps**:
  1. Ensure you're on the latest `main` or `develop` branch.
  2. Pull latest changes: `git pull origin main`
  3. Create new branch: `git checkout -b feature/STORY-01-backend`
  4. Verify branch creation: `git branch`
- **Notes**: This must be the FIRST step before any code changes. Refer to `specs/backend-standards.mdc`.

#### **Step 1: Update Prisma Schema**
- **File**: `prisma/schema.prisma`
- **Action**: Add `Candidate` model.
- **Implementation Steps**:
  1. Add `Candidate` model with fields: `id` (autoincrement), `firstName` (String), `lastName` (String), `email` (String, unique), `phone` (String?), `address` (String?), `education` (String? or JSON), `experience` (String? or JSON), `cvUrl` (String?), and timestamps (`createdAt`, `updatedAt`).
  2. Run `npx prisma format` and `npm run prisma:generate`.
  3. Run Prisma migration to apply changes to the DB.

#### **Step 2: Domain Entity and Repository Interface**
- **File**: `src/domain/Candidate.ts` & `src/domain/ICandidateRepository.ts`
- **Action**: Define domain concepts.
- **Implementation Steps**:
  1. Create `Candidate` class representing the entity, ensuring invariants (valid email format, required fields exist).
  2. Create `ICandidateRepository` interface with `save(candidate: Candidate): Promise<Candidate>` and `findByEmail(email: string): Promise<Candidate | null>`.
- **Dependencies**: None.

#### **Step 3: Prisma Repository Implementation**
- **File**: `src/infrastructure/CandidateRepository.ts`
- **Action**: Implement persistence.
- **Implementation Steps**:
  1. Create `CandidateRepository` class implementing `ICandidateRepository`.
  2. Use PrismaClient directly to map domain entities to/from the database.
  3. Catch Prisma-specific errors (e.g., `P2002` for unique constraint) and throw meaningful Domain errors (e.g., `DuplicateEmailError`).
- **Dependencies**: `@prisma/client`

#### **Step 4: Application Service and Validation**
- **File**: `src/application/CandidateService.ts`
- **Action**: Implement `CandidateService`.
- **Implementation Steps**:
  1. Inject `ICandidateRepository` into `CandidateService`.
  2. Add `createCandidate(data: CreateCandidateDTO, cvFile?: Express.Multer.File)` method.
  3. Validate input (ensure email, firstName, lastName are present and valid).
  4. Ensure a candidate with the same email doesn't already exist.
  5. Handle the `cvFile` (e.g., define where it gets stored and generate the `cvUrl`).
  6. Call `Candidate` constructor to instantiate the entity.
  7. Persist via repository `save()` method.
- **Dependencies**: DTO definitions, Domain Entity, Repository Interface.

#### **Step 5: Express Controller and File Upload Middleware**
- **File**: `src/presentation/CandidateController.ts` & `src/presentation/candidateRoutes.ts`
- **Action**: Define routes and HTTP handling.
- **Implementation Steps**:
  1. Setup `multer` configured to accept `.pdf` and `.docx` inside `candidateRoutes.ts`.
  2. Create `CandidateController` taking `CandidateService` as dependency.
  3. Implement `addCandidate` method catching Domain errors and converting them to valid HTTP codes (400 for bad input, 409 for duplicate email, 500 for server err).
  4. Map route `POST /api/candidates` to `CandidateController`.
  5. Mount `candidateRoutes` on `src/index.ts` Express application.
- **Dependencies**: `express`, `multer`

#### **Step 6: Write Unit Tests**
- **File**: `src/tests/candidate.test.ts` (or placed alongside files depending on conventions).
- **Action**: Full test coverage of feature.
- **Implementation Steps**:
  1. **Successful Cases**: Create candidate successfully, generating appropriate standard entity and return value.
  2. **Validation Errors**: Empty payload, invalid email, missing require field (returns 400).
  3. **Edge Cases**: Duplicate email (returns 409).
  4. **Server Errors**: Ensure any uncontrolled exception resolves to 500.
  5. Mock Prisma client to isolate testing to the domain & app logic.
- **Dependencies**: `jest`, test utilities.

#### **Step N+1: Update Technical Documentation**
- **Action**: Review and update technical documentation according to changes made.
- **Implementation Steps**:
  1. **Identify Documentation Files**: `specs/data-model.md` (for the new Candidate model), `specs/api-spec.yml` (for the new `/api/candidates` endpoint).
  2. **Update Documentation**: Note the new endpoints, input DTO structure, and database model.
  3. **Verify Documentation**: Ensure formatting and structure in English.
- **Notes**: This step is MANDATORY.

## 5. **Implementation Order**
1. Step 0: Create Feature Branch
2. Step 1: Update Prisma Schema
3. Step 2: Domain Entity and Repository Interface
4. Step 3: Prisma Repository Implementation
5. Step 4: Application Service and Validation
6. Step 5: Express Controller and File Upload Middleware
7. Step 6: Write Unit Tests
8. Step N+1: Update Technical Documentation

## 6. **Testing Checklist**
- [ ] Express endpoints validate correctly and properly handle form-data.
- [ ] `multer` successfully uploads PDF/DOCX and rejects invalid formats.
- [ ] Unique constraint checks handle duplicate records gracefully.
- [ ] Prisma stores new rows matching the domain properties properly.
- [ ] All Unit tests pass with >= 90% coverage for the new feature.

## 7. **Error Response Format**
```json
{
  "message": "Error description",
  "error": "Validation_Error",
  "details": ["email is invalid", "firstName is required"]
}
```
**Mappings**: 
- `400 Bad Request`: Validation failure (zod/joi validation, multer incorrect format)
- `409 Conflict`: Business validation (Email exists)
- `500 Internal Server Error`: Unknown backend issues

## 8. **Partial Update Support**
Not applicable for this ticket (this ticket is limited to adding new candidates, not updating them).

## 9. **Dependencies**
- Existing: `@prisma/client`, `express`.
- New (likely required): `multer` (for handling `multipart/form-data` and CV attachments), `@types/multer`. 
- Optional: validation library like `zod`.

## 10. **Notes**
- Remember to configure an `uploads/` directory that is `.gitignore`d if storing files locally, and serve it statically if links are supposed to be downloadable.
- Ensure that the endpoints correctly handle JSON fields or string interpretations of `education` and `experience` as sent from the frontend `FormData`.
- All text in PRs, Commits, and code must be in English.

## 11. **Next Steps After Implementation**
- Define storage long-term abstractions (S3) if local storage causes container volume constraints down the line. 
- Develop the Frontend components to digest `/api/candidates`.

## 12. **Implementation Verification**
- Code Quality: Adherence to DDD, DRY, clear file organization.
- Functionality: End-to-end recruiter can effectively upload a full candidate profile and CV.
- Testing: Comprehensive test suite executed properly.
- Integration: Formats align correctly with expectations.
- Documentation updates completed.
