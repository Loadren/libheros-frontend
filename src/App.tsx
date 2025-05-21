// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import './App.css'

import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

const App: React.FC = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />


        {/* Protected Routes */}
        {/* TODO: Wrap protected routes with ProtectedRoute in the future */}

        {/* Redirect root to /lists, that will redirect to login if no token is found */}
        <Route path="/" element={<Navigate to="/lists" replace />} />

        {/* Shouldn't happen, but catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
