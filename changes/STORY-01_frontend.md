# Frontend Implementation Plan: STORY-01 Añadir Candidato al Sistema

## 2. **Overview**
Implement the user interface for recruiters to add candidates to the ATS. This includes a form with validation, file upload support for CVs, and integration with the backend API. The architecture follows a component-based approach with a dedicated service layer for API communication, using React (TypeScript).

## 3. **Architecture Context**
- **Service Layer**: `src/services/candidateService.ts` for abstraction of API calls.
- **Components**: 
  - `src/components/CandidateForm.tsx`: Core form component.
  - `src/components/Dashboard.tsx` (if needed) or main page container.
- **Routing**: `src/App.tsx` will be updated to include the routing to the add-candidate page.
- **State Management**: Local React state (`useState`) for form handling and loading/error states.

## 4. **Implementation Steps**

#### **Step 0: Create Feature Branch**
- **Action**: Create and switch to a new feature branch for frontend development.
- **Branch Naming**: `feature/STORY-01-frontend`
- **Implementation Steps**:
  1. Ensure you're on the latest `main`.
  2. Pull latest changes: `git pull origin main`
  3. Create new branch: `git checkout -b feature/STORY-01-frontend`
- **Notes**: Mandatory first step.

#### **Step 1: Create API Service**
- **File**: `src/services/candidateService.ts`
- **Action**: Create a service to handle the multipart/form-data request.
- **Implementation Steps**:
  1. Define a function `addCandidate(formData: FormData): Promise<any>`.
  2. Use `fetch` or `axios` to send the `POST /api/candidates` request.
  3. Ensure proper error handling by checking response status.

#### **Step 2: Implement UI Components**
- **File**: `src/components/CandidateForm.tsx` & `src/App.tsx`
- **Action**: Create the recruitment form and update the main layout.
- **Implementation Steps**:
  1. Create `CandidateForm` with fields: `firstName`, `lastName`, `email`, `phone`, `address`, `education`, `experience`, and `cvFile` (input type file).
  2. Implement local validation (regex for email, required fields).
  3. Use `FormData` to package the text fields and the file for the service.
  4. Display success/error messages based on the API response.
  5. Add a button in `App.tsx` or a navigation link to access the form.

#### **Step 3: Styling and Responsiveness**
- **File**: `src/components/CandidateForm.css` (or using existing styles)
- **Action**: Ensure the form is intuitive and responsive.
- **Implementation Steps**:
  1. Apply responsive layouts for mobile/desktop.
  2. Style input states (hover, focus, error).

#### **Step 4: Update Technical Documentation**
- **Action**: Update `specs/frontend-standards.mdc` if new patterns are established.
- **Implementation Steps**:
  1. Review changes.
  2. Update documentation files in English.

## 5. **Implementation Order**
1. Step 0: Create Feature Branch
2. Step 1: Create API Service
3. Step 2: Implement UI Components
4. Step 3: Styling and Responsiveness
5. Step 4: Update Technical Documentation

## 6. **Testing Checklist**
- [ ] Form validates empty required fields before submission.
- [ ] Email format is checked on the client side.
- [ ] File input only accepts PDF/DOCX where possible (accept attribute).
- [ ] Success message appears after a `201` response.
- [ ] Backend errors (like duplicate email) are displayed clearly to the user.

## 7. **Error Handling Patterns**
- Form errors: Red border on inputs + helper text.
- API errors: Toast notification or alert box at the top of the form.

## 8. **UI/UX Considerations**
- Use clear labels and placeholders.
- Add a loading spinner on the submit button while the API request is in progress.

## 9. **Dependencies**
- None (Base React + Fetch API).

## 10. **Notes**
- All code/comments must be in English.
- Ensure the `FormData` keys match the backend expectations (`firstName`, `lastName`, `email`, `cvFile`, etc.).

## 11. **Next Steps After Implementation**
- Final E2E testing of the full recruiter flow.
- Integration into the main dashboard.
