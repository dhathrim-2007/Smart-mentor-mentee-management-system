import React, { createContext, useContext, useState, useEffect } from 'react';
import { BENCHMARK_CASES } from '../data/benchmarkCases';

const AuthRoleContext = createContext();

export function AuthRoleProvider({ children }) {
  // Roles: 'Victim' | 'Counsellor' | 'District Officer' | 'National Admin'
  const [currentRole, setCurrentRole] = useState('Victim');

  // Currently active victim case (defaults to Benchmark Case B - Moderate/Increasing)
  const [activeBenchmarkKey, setActiveBenchmarkKey] = useState('CASE_B');
  const [activeCase, setActiveCase] = useState(
    BENCHMARK_CASES.find(c => c.benchmarkKey === 'CASE_B') || BENCHMARK_CASES[1]
  );

  // Switch benchmark scenario
  const switchBenchmarkCase = (key) => {
    const found = BENCHMARK_CASES.find(c => c.benchmarkKey === key);
    if (found) {
      setActiveBenchmarkKey(key);
      setActiveCase(found);
    }
  };

  // Update active case after a check-in or action
  const updateActiveCase = (updatedData) => {
    setActiveCase(prev => ({
      ...prev,
      ...updatedData
    }));
  };

  return (
    <AuthRoleContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeBenchmarkKey,
        activeCase,
        switchBenchmarkCase,
        updateActiveCase,
        benchmarkCases: BENCHMARK_CASES
      }}
    >
      {children}
    </AuthRoleContext.Provider>
  );
}

export function useAuthRole() {
  const context = useContext(AuthRoleContext);
  if (!context) {
    throw new Error('useAuthRole must be used within an AuthRoleProvider');
  }
  return context;
}
