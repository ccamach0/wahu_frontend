import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { Eye, EyeOff, PawPrint } from 'lucide-react';
import WahuLogo from '../components/WahuLogo.jsx';
import GoogleAuthButton from '../components/GoogleAuthButton.jsx';
import api from '../services/api.js';

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  const handleResend = async () => {
    setResendLoading(true);
    setResendMsg('');
    try {
      await api.resendVerification(unverifiedEmail);
      setResendMsg('¡Email reenviado! Revisa tu bandeja de entrada.');
    } catch (err) {
      setResendMsg(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUnverifiedEmail(null);
    setResendMsg('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/home');
    } catch (err) {
      if (err.code === 'EMAIL_NOT_VERIFIED') {
        setUnverifiedEmail(err.data?.email || form.email);
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (accessToken) => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle(accessToken);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión con Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-wahu-50 via-wahu-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo principal — punto focal de la pantalla */}
        <div className="flex flex-col items-center mb-10">
          <WahuLogo size={88} stacked textColor="#1a1a2e" />
          <p className="text-gray-400 text-sm mt-4 tracking-wide">La red social para mascotas</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Iniciar sesión</h2>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 border border-red-100">
              {error}
              {unverifiedEmail && (
                <div className="mt-2 pt-2 border-t border-red-100">
                  {resendMsg ? (
                    <p className="text-xs text-wahu-600">{resendMsg}</p>
                  ) : (
                    <button
                      onClick={handleResend}
                      disabled={resendLoading}
                      className="text-xs font-semibold text-wahu-500 hover:text-wahu-600 disabled:opacity-50"
                    >
                      {resendLoading ? 'Enviando...' : 'Reenviar email de verificación'}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          <GoogleAuthButton
            text="Continuar con Google"
            onSuccess={handleGoogleSuccess}
            onError={(msg) => setError(msg)}
            loading={googleLoading}
          />

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-medium">o con email</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                className="input"
                placeholder="tu@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-wahu-500"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary justify-center mt-1"
              disabled={loading || googleLoading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <PawPrint size={18} />
                  Entrar
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-wahu-500 font-semibold hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
