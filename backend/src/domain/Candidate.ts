export class CandidateValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CandidateValidationError';
  }
}

export class Candidate {
  public id?: number;
  public firstName: string;
  public lastName: string;
  public email: string;
  public phone: string | null;
  public address: string | null;
  public education: string | null;
  public experience: string | null;
  public cvUrl: string | null;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(data: {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    education?: string | null;
    experience?: string | null;
    cvUrl?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    if (!data.firstName || data.firstName.trim() === '') {
      throw new CandidateValidationError('First name is required');
    }
    if (!data.lastName || data.lastName.trim() === '') {
      throw new CandidateValidationError('Last name is required');
    }
    
    this.validateEmail(data.email);

    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.phone = data.phone || null;
    this.address = data.address || null;
    this.education = data.education || null;
    this.experience = data.experience || null;
    this.cvUrl = data.cvUrl || null;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  private validateEmail(email: string) {
    if (!email || email.trim() === '') {
      throw new CandidateValidationError('Email is required');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new CandidateValidationError('Invalid email format');
    }
  }
}
