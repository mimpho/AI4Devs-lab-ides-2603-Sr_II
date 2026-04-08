import React from 'react';
import './App.css';
import CandidateForm from './components/CandidateForm';

function App() {
  return (
    <div className="App bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            ATS System
          </span>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Recruiter Dashboard
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <CandidateForm />
      </main>
      
      <footer className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} ATS Candidate Manager • Modern Recruitment Experience
      </footer>
    </div>
  );
}

export default App;
