const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010/api';

export interface CandidateData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education?: string;
  experience?: string;
  cvFile?: File;
}

/**
 * Sends a candidate's data and CV file to the backend API.
 * @param candidateData An object containing all candidate fields and the optional File object.
 * @returns A Promise resolving to the created candidate data from the server.
 * @throws An error if the server response is not OK or if communication fails.
 */
export const addCandidate = async (candidateData: CandidateData): Promise<any> => {
  const formData = new FormData();

  // Append all text fields
  Object.keys(candidateData).forEach((key) => {
    const value = (candidateData as any)[key];
    if (value !== undefined && key !== 'cvFile') {
      formData.append(key, value);
    }
  });

  // Append file if exists
  if (candidateData.cvFile) {
    formData.append('cvFile', candidateData.cvFile);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/candidates`, {
      method: 'POST',
      body: formData,
      // Note: No need to set 'Content-Type': 'multipart/form-data'. 
      // Fetch does this automatically when body is a FormData object.
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error creating candidate');
      }
      throw new Error(`Server returned error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('API Error in addCandidate:', error.message);
    throw error;
  }
};

/**
 * Fetches lists of unique education and experience strings from the server.
 * Used for autocompletion suggestions in the UI.
 * @returns A Promise resolving to an object with education and experience arrays.
 */
export const getSuggestions = async (): Promise<{ education: string[]; experience: string[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/candidates/suggestions`);
    if (!response.ok) {
      throw new Error(`Failed to fetch suggestions: ${response.status} ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    throw new Error('Server returned non-JSON response for suggestions');
  } catch (error: any) {
    console.error('API Error in getSuggestions:', error.message);
    return { education: [], experience: [] }; // Fallback to empty if fails
  }
};
