import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';

function AppContent() {
  const { state } = useApp();

  if (state.isOnboarding || !state.profile) {
    return <Onboarding />;
  }

  return <Dashboard />;
}

function App() {
  return (
    <Router>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  );
}

export default App;