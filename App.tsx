import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { SimulationSetup } from './pages/SimulationSetup';
import { ExamView } from './pages/ExamView';
import { Results } from './pages/Results';

// Route Guard
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useUser();
  return profile.isOnboarded ? <>{children}</> : <Navigate to="/" />;
};

const AppRoutes = () => {
    const { profile } = useUser();
    
    return (
        <Routes>
            <Route path="/" element={profile.isOnboarded ? <Navigate to="/dashboard" /> : <Onboarding />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/simulation/setup" element={<PrivateRoute><SimulationSetup /></PrivateRoute>} />
            <Route path="/simulation/run" element={<PrivateRoute><ExamView /></PrivateRoute>} />
            <Route path="/results" element={<PrivateRoute><Results /></PrivateRoute>} />
        </Routes>
    );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </UserProvider>
  );
};

export default App;