import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, PawPrint } from 'lucide-react';
import WahuLogo from '../components/WahuLogo.jsx';
import api from '../services/api.js';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('pending'); // pending | loading | success | error
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');

  const handleVerify = async () => {
    if (!token) {
      setStatus('error');
      setMessage('Token de verificación no encontrado.');
      return;
    }
    setStatus('loading');
    try {
      const { token: jwt } = await api.verifyEmail(token);
      localStorage.setItem('wahu_token', jwt);
      setStatus('success');
      setTimeout(() => navigate('/home'), 2000);
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Token inválido o expirado.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-wahu-50 via-wahu-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <div className="flex flex-col items-center mb-8">
          <WahuLogo size={72} stacked textColor="#1a1a2e" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {status === 'pending' && (
            <>
              <div className="w-16 h-16 bg-wahu-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <PawPrint size={32} className="text-wahu-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">¡Ya casi!</h2>
              <p className="text-gray-500 text-sm mb-6">
                Haz clic en el botón para activar tu cuenta de Wahu.
              </p>
              <button onClick={handleVerify} className="btn-primary justify-center w-full">
                <PawPrint size={18} />
                Verificar mi cuenta
              </button>
            </>
          )}

          {status === 'loading' && (
            <>
              <div className="w-10 h-10 border-4 border-wahu-200 border-t-wahu-500 rounded-full animate-spin mx-auto mb-4" />
              <h2 className="text-lg font-bold text-gray-800">Verificando...</h2>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">¡Cuenta verificada!</h2>
              <p className="text-gray-500 text-sm">Redirigiendo a Wahu...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle size={48} className="text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Verificación fallida</h2>
              <p className="text-gray-500 text-sm mb-6">{message}</p>
              <Link to="/login" className="btn-primary justify-center inline-flex w-full">
                Ir al inicio de sesión
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
