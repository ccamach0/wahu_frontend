import { useState, useCallback } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Layout() {
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = useCallback(() => setMobileOpen(v => !v), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-wahu-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-wahu-200 border-t-wahu-500 rounded-full animate-spin" />
          <p className="text-wahu-500 font-medium">Cargando Wahu...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen">
      {/* Backdrop móvil */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={closeMobile}
        />
      )}
      <Sidebar mobileOpen={mobileOpen} onClose={closeMobile} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={toggleMobile} />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
