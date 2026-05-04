/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useAuthStore } from '@/src/store/useAuthStore';
import { LandingPage } from '@/src/pages/LandingPage';
import { LoginPage } from '@/src/pages/LoginPage';
import { AppLayout } from '@/src/components/layout/AppLayout';
import { AnalyzePage } from '@/src/pages/AnalyzePage';
import { BatchUploadPage } from '@/src/pages/BatchUploadPage';
import { AdminDashboard } from '@/src/pages/AdminDashboard';
import { Toaster } from '@/components/ui/sonner';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { user, token } = useAuthStore();
  
  if (!token) return <Navigate to="/login" />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/analyze" />;
  
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/analyze" element={<AnalyzePage />} />
          <Route path="/batch" element={<BatchUploadPage />} />
        </Route>

        <Route element={<ProtectedRoute adminOnly><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  );
}
