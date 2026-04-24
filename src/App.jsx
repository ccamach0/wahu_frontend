import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './hooks/useAuth.jsx';
import { PetProvider } from './hooks/usePetContext.jsx';
import { ToastProvider } from './components/ToastProvider.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import Pets from './pages/Pets.jsx';
import Contests from './pages/Contests.jsx';
import Pack from './pages/Pack.jsx';
import Clans from './pages/Clans.jsx';
import ClanProfile from './pages/ClanProfile.jsx';
import Cards from './pages/Cards.jsx';
import Hydrant from './pages/Hydrant.jsx';
import Companion from './pages/Companion.jsx';
import PetProfile from './pages/PetProfile.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import Chat from './pages/Chat.jsx';
import CompanionProfile from './pages/CompanionProfile.jsx';
import Appointments from './pages/Appointments.jsx';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PetProvider>
          <ToastProvider>
            <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/pets/:username" element={<PetProfile />} />
            <Route path="/contests" element={<Contests />} />
            <Route path="/pack" element={<Pack />} />
            <Route path="/clans" element={<Clans />} />
            <Route path="/clans/:clanId" element={<ClanProfile />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/hydrant" element={<Hydrant />} />
            <Route path="/companion" element={<Companion />} />
            <Route path="/companions/:username" element={<CompanionProfile />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/appointments" element={<Appointments />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </ToastProvider>
        </PetProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default function App() {
  if (!GOOGLE_CLIENT_ID) return <AppRoutes />;
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppRoutes />
    </GoogleOAuthProvider>
  );
}
