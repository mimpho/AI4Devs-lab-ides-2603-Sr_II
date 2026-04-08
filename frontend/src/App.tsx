import React from 'react';
import './App.css';
import CandidateForm from './components/CandidateForm';

function App() {
  return (
    <div className="App bg-light min-vh-100">
      <nav className="navbar navbar-dark bg-dark mb-4">
        <div className="container">
          <span className="navbar-brand mb-0 h1">ATS System - Recruiter Dashboard</span>
        </div>
      </nav>
      <main>
        <CandidateForm />
      </main>
      <footer className="py-4 text-center text-muted">
        &copy; {new Date().getFullYear()} ATS Candidate Manager
      </footer>
    </div>
  );
}

export default App;
