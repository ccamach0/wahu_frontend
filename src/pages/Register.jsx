import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { PawPrint, Mail } from 'lucide-react';
import WahuLogo from '../components/WahuLogo.jsx';
import GoogleAuthButton from '../components/GoogleAuthButton.jsx';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';

export default function Register() {
  const { loginWithGoogle } = useAuth();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await register(form);
      if (result.pending) setPendingEmail(result.email);
    } catch (err) {
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
      setError(err.message || 'Error al registrarse con Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMsg('');
    try {
      await api.resendVerification(pendingEmail);
      setResendMsg('¡Email reenviado! Revisa tu bandeja de entrada.');
    } catch (err) {
      setResendMsg(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  if (pendingEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-wahu-50 via-wahu-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <div className="flex flex-col items-center mb-8">
            <WahuLogo size={72} stacked textColor="#1a1a2e" />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="w-16 h-16 bg-wahu-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail size={32} className="text-wahu-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">¡Revisa tu email!</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-2">
              Te enviamos un enlace de verificación a:
            </p>
            <p className="font-semibold text-gray-800 text-sm mb-6">{pendingEmail}</p>
            <p className="text-gray-400 text-xs mb-6">
              El enlace expira en 24 horas. Revisa también tu carpeta de spam.
            </p>
            {resendMsg && (
              <div className="bg-wahu-50 text-wahu-700 text-xs px-4 py-2 rounded-xl mb-4">
                {resendMsg}
              </div>
            )}
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="text-wahu-500 hover:text-wahu-600 text-sm font-medium disabled:opacity-50"
            >
              {resendLoading ? 'Enviando...' : '¿No llegó? Reenviar email'}
            </button>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <Link to="/login" className="text-sm text-gray-500 hover:text-wahu-500">
                Volver al inicio de sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-wahu-50 via-wahu-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <WahuLogo size={72} stacked textColor="#1a1a2e" />
          <p className="text-gray-400 text-sm mt-3 tracking-wide">Crea tu cuenta de compañero</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Crear cuenta</h2>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 border border-red-100">
              {error}
            </div>
          )}

          <GoogleAuthButton
            text="Registrarse con Google"
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
            {[
              { field: 'name', label: 'Tu nombre', placeholder: 'Juan Pérez', type: 'text' },
              { field: 'username', label: 'Nombre de usuario (@)', placeholder: 'tu_usuario', type: 'text' },
              { field: 'email', label: 'Email', placeholder: 'tu@email.com', type: 'email' },
              { field: 'password', label: 'Contraseña', placeholder: '••••••••', type: 'password' },
            ].map(({ field, label, placeholder, type }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <input
                  type={type}
                  className="input"
                  placeholder={placeholder}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              className="btn-primary justify-center mt-1"
              disabled={loading || googleLoading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><PawPrint size={18} />Crear cuenta</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-wahu-500 font-semibold hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
