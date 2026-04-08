const API_BASE_URL = 'http://localhost:3010/api';

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
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error creating candidate');
    }

    return await response.json();
  } catch (error: any) {
    console.error('API Error in addCandidate:', error.message);
    throw error;
  }
};

export const getSuggestions = async (): Promise<{ education: string[]; experience: string[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/candidates/suggestions`);
    if (!response.ok) {
      throw new Error('Failed to fetch suggestions');
    }
    return await response.json();
  } catch (error: any) {
    console.error('API Error in getSuggestions:', error.message);
    return { education: [], experience: [] }; // Fallback to empty if fails
  }
};
