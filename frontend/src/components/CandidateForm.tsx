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
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">Add New Candidate</h2>
        </div>
        <div className="card-body">
          {message && (
            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="firstName" className="form-label">First Name *</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="lastName" className="form-label">Last Name *</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="email" className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12">
                <label htmlFor="address" className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12">
                <label htmlFor="education" className="form-label">Education</label>
                <textarea
                  className="form-control"
                  id="education"
                  name="education"
                  rows={2}
                  value={formData.education}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12">
                <label htmlFor="experience" className="form-label">Work Experience</label>
                <textarea
                  className="form-control"
                  id="experience"
                  name="experience"
                  rows={3}
                  value={formData.experience}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12">
                <label htmlFor="cvFile" className="form-label">CV Document (PDF/DOCX)</label>
                <input
                  type="file"
                  className="form-control"
                  id="cvFile"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileChange}
                />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Adding Candidate...
                    </>
                  ) : (
                    'Add Candidate'
                  )}
                </button>
              </div>
            </div>
            <p className="text-muted mt-3 small">* Required fields</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CandidateForm;
