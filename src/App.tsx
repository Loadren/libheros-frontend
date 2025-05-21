// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import './App.css'

import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import SidebarContainer from './layouts/SidebarContainer';
import TasksPage from './pages/TasksPage';

const App: React.FC = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />


        {/* All protected list/task views share the same layout */}
        <Route
          element={
            <ProtectedRoute>
              <SidebarContainer />
            </ProtectedRoute>
          }
        >
          {/* /lists → placeholder prompting to pick a list */}
          <Route
            path="lists"
            element={
              <main className="flex-1 p-8 flex flex-col items-center justify-center text-gray-600">
                <p className="text-lg">
                  Select a list from the sidebar to view its tasks.
                </p>
              </main>
            }
          />

          {/* /lists/:listId → TasksPage showing that list’s tasks */}
          <Route path="lists/:listId" element={<TasksPage />} />

          {/* /lists/:listId/tasks/:taskId → same TasksPage (with right sidebar open) */}
          <Route
            path="lists/:listId/tasks/:taskId"
            element={<TasksPage />}
          />

          {/* root redirect */}
          <Route path="/" element={<Navigate to="lists" replace />} />
        </Route>

        {/* Redirect root to /lists, that will redirect to login if no token is found */}
        <Route path="/" element={<Navigate to="/lists" replace />} />

        {/* Shouldn't happen, but catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
