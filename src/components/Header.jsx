import { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, Check, PawPrint, Menu } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';
import { usePetContext } from '../hooks/usePetContext.jsx';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';

export default function Header({ onMenuToggle }) {
  const { user } = useAuth();
  const { pets, activePet, setActivePet } = usePetContext();
  const [petOpen, setPetOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const petRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handler = (e) => {
      if (petRef.current && !petRef.current.contains(e.target)) setPetOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Polling de notificaciones cada 30s
  useEffect(() => {
    if (!user) return;
    const fetchUnread = () => {
      api.getUnreadCount().then(({ count }) => setUnread(count)).catch(() => {});
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const openNotifications = async () => {
    setNotifOpen(!notifOpen);
    if (!notifOpen) {
      try {
        const data = await api.getNotifications();
        setNotifications(data);
        if (unread > 0) {
          await api.markAllNotificationsRead();
          setUnread(0);
        }
      } catch {}
    }
  };

  const notifIcon = (type) => {
    if (type === 'friend_request') return '🐾';
    if (type === 'friend_accepted') return '✅';
    return '🔔';
  };

  const formatTime = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Ahora';
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    return `${Math.floor(h / 24)}d`;
  };

  return (
    <header className="h-14 bg-white border-b border-wahu-100 flex items-center justify-end px-4 gap-3 sticky top-0 z-20">
      {/* Hamburger — solo móvil */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-xl hover:bg-wahu-50 text-gray-500 hover:text-wahu-500 transition-colors mr-auto"
        aria-label="Menú"
      >
        <Menu size={22} />
      </button>

      {/* Campana de notificaciones */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={openNotifications}
          className="relative p-2 rounded-xl hover:bg-wahu-50 text-gray-400 hover:text-wahu-500 transition-colors"
        >
          <Bell size={20} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-lg border border-wahu-100 overflow-hidden z-30">
            <div className="px-4 py-3 border-b border-wahu-50 flex items-center justify-between">
              <p className="text-sm font-bold text-gray-800">Notificaciones</p>
              {notifications.length > 0 && (
                <button onClick={() => navigate('/pack')} className="text-xs text-wahu-500 hover:underline">
                  Ver solicitudes
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-sm">
                  <Bell size={28} className="mx-auto mb-2 opacity-30" />
                  Sin notificaciones
                </div>
              ) : notifications.map(n => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-wahu-50 last:border-0 ${!n.read ? 'bg-wahu-50/50' : ''}`}
                >
                  <span className="text-xl flex-shrink-0 mt-0.5">{notifIcon(n.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 leading-snug">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatTime(n.created_at)}</p>
                  </div>
                  {n.type === 'friend_request' && (
                    <button
                      onClick={() => { navigate('/pack'); setNotifOpen(false); }}
                      className="text-xs text-wahu-500 font-medium hover:underline flex-shrink-0 mt-1"
                    >
                      Ver
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selector de mascota activa */}
      <div className="relative" ref={petRef}>
        <button
          onClick={() => pets.length > 0 ? setPetOpen(!petOpen) : navigate('/companion')}
          className="flex items-center gap-2.5 bg-wahu-50 hover:bg-wahu-100 border border-wahu-100 rounded-xl px-3 py-1.5 transition-colors"
        >
          {activePet ? (
            <>
              <img
                src={activePet.avatar_url || 'https://placedog.net/32/32'}
                alt={activePet.name}
                className="w-7 h-7 rounded-lg object-cover border-2 border-wahu-200 flex-shrink-0"
                onError={e => { e.target.src = 'https://placedog.net/32/32'; }}
              />
              <div className="text-left">
                <p className="text-xs font-bold text-gray-800 leading-tight">{activePet.name}</p>
                <p className="text-xs text-wahu-500 leading-tight">Nivel {activePet.level}</p>
              </div>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${petOpen ? 'rotate-180' : ''}`} />
            </>
          ) : (
            <span className="text-xs text-wahu-500 font-medium">+ Agregar mascota</span>
          )}
        </button>

        {petOpen && pets.length > 0 && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-lg border border-wahu-100 overflow-hidden z-30">
            <div className="px-3 py-2 border-b border-wahu-50">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Mis mascotas</p>
            </div>
            <div className="py-1 max-h-60 overflow-y-auto">
              {pets.map(pet => (
                <button
                  key={pet.id}
                  onClick={() => { setActivePet(pet); setPetOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-wahu-50 transition-colors text-left"
                >
                  <img
                    src={pet.avatar_url || 'https://placedog.net/36/36'}
                    alt={pet.name}
                    className="w-9 h-9 rounded-xl object-cover border-2 border-wahu-100 flex-shrink-0"
                    onError={e => { e.target.src = 'https://placedog.net/36/36'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{pet.name}</p>
                    <p className="text-xs text-wahu-500">@{pet.username} · Nv.{pet.level}</p>
                  </div>
                  {activePet?.id === pet.id && <Check size={15} className="text-wahu-500 flex-shrink-0" />}
                </button>
              ))}
            </div>
            <div className="border-t border-wahu-50 px-3 py-2">
              <button
                onClick={() => { navigate('/companion'); setPetOpen(false); }}
                className="text-xs text-wahu-500 hover:text-wahu-600 font-medium"
              >
                + Agregar mascota
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Compañero (usuario) */}
      <div
        className="flex items-center gap-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl px-3 py-1.5 cursor-pointer transition-colors"
        onClick={() => navigate('/companion')}
      >
        <img
          src={user?.avatar_url || `https://i.pravatar.cc/40?u=${user?.email}`}
          alt={user?.name}
          className="w-7 h-7 rounded-full object-cover flex-shrink-0"
          onError={e => { e.target.src = `https://i.pravatar.cc/40`; }}
        />
        <p className="text-xs font-semibold text-gray-700 max-w-32 truncate">{user?.name || 'Compañero'}</p>
      </div>
    </header>
  );
}
