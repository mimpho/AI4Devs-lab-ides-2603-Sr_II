import React, { useState } from 'react';
import { addCandidate, CandidateData } from '../services/candidateService';

const CandidateForm: React.FC = () => {
  const [formData, setFormData] = useState<Partial<CandidateData>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    education: '',
    experience: '',
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!formData.firstName || !formData.lastName || !formData.email) {
      setMessage({ type: 'error', text: 'First name, last name, and email are required.' });
      setLoading(false);
      return;
    }

    try {
      const submissionData: CandidateData = {
        firstName: formData.firstName!,
        lastName: formData.lastName!,
        email: formData.email!,
        phone: formData.phone,
        address: formData.address,
        education: formData.education,
        experience: formData.experience,
        cvFile: cvFile || undefined,
      };

      await addCandidate(submissionData);
      setMessage({ type: 'success', text: 'Candidate added successfully!' });
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        education: '',
        experience: '',
      });
      setCvFile(null);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An error occurred while adding the candidate.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
          <h2 className="text-2xl font-bold text-white mb-1">Add New Candidate</h2>
          <p className="text-blue-100 text-sm">Fill in the professional profile to add to the pipeline</p>
        </div>

        <div className="p-8">
          {message && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
              message.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-100 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-800'
            }`} role="alert">
              <span className="text-lg">
                {message.type === 'success' ? '✓' : '⚠'}
              </span>
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-gray-100"
                  id="firstName"
                  name="firstName"
                  placeholder="e.g. John"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-gray-100"
                  id="lastName"
                  name="lastName"
                  placeholder="e.g. Doe"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-gray-100"
                  id="email"
                  name="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-gray-100"
                  id="phone"
                  name="phone"
                  placeholder="+34 600 000 000"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Address
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-gray-100"
                id="address"
                name="address"
                placeholder="Calle Ejemplo 123, Madrid"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="education" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Education
              </label>
              <textarea
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-gray-100 resize-none"
                id="education"
                name="education"
                rows={2}
                placeholder="University, Degree Name..."
                value={formData.education}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="experience" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Work Experience
              </label>
              <textarea
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-gray-100 resize-none"
                id="experience"
                name="experience"
                rows={3}
                placeholder="Briefly describe previous roles..."
                value={formData.experience}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="cvFile" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                CV Document (PDF/DOCX)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer group">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label htmlFor="cvFile" className="relative cursor-pointer bg-transparent rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input id="cvFile" name="cvFile" type="file" className="sr-only" accept=".pdf,.docx,.doc" onChange={handleFileChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {cvFile ? `Selected: ${cvFile.name}` : 'PDF, DOCX up to 5MB'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  'Complete Registration'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
        * Registration as candidate implies acceptance of the professional privacy policy.
      </p>
    </div>
  );
};

export default CandidateForm;
