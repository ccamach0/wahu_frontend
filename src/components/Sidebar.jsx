import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, PawPrint, Trophy, Shield, Flag, Tag, Droplets, User, ChevronLeft, ChevronRight, Bone, LogOut, MessageCircle, CalendarDays
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { usePetContext } from '../hooks/usePetContext.jsx';
import WahuLogo from './WahuLogo.jsx';

const NAV_ITEMS = [
  { to: '/home', icon: Home, label: 'Inicio' },
  { to: '/pets', icon: PawPrint, label: 'Mascotas' },
  { to: '/contests', icon: Trophy, label: 'Certamen' },
  { to: '/pack', icon: Shield, label: 'Manada' },
  { to: '/clans', icon: Flag, label: 'Clanes' },
  { to: '/cards', icon: Tag, label: 'Tarjetas' },
  { to: '/hydrant', icon: Droplets, label: 'Hidrante' },
  { to: '/companion', icon: User, label: 'Compañero' },
  { to: '/chat', icon: MessageCircle, label: 'Chat' },
  { to: '/appointments', icon: CalendarDays, label: 'Citas' },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const { activePet: firstPet } = usePetContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside
      className={`
        flex flex-col bg-white border-r border-wahu-100 transition-all duration-300
        z-40
        fixed top-14 bottom-0 left-0
        lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
        ${collapsed ? 'w-16' : 'w-64'}
        ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Logo */}
      {collapsed ? (
        <div className="flex flex-col items-center gap-1 px-2 py-3 border-b border-wahu-100">
          <WahuLogo size={28} iconOnly />
          <button
            onClick={() => setCollapsed(false)}
            className="p-1 rounded-lg hover:bg-wahu-50 text-gray-400 hover:text-wahu-500 transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-4 py-4 border-b border-wahu-100">
          <WahuLogo size={30} />
          <button
            onClick={() => setCollapsed(true)}
            className="ml-auto p-1 rounded-lg hover:bg-wahu-50 text-gray-400 hover:text-wahu-500 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      )}

      {/* Mi mascota activa */}
      {firstPet && (
        <div
          className={`mx-2 mt-3 mb-1 rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-sm ${collapsed ? 'p-2' : 'p-3'} bg-gradient-to-br from-wahu-50 to-orange-50 border border-wahu-100`}
          onClick={() => navigate(`/pets/${firstPet.username}`)}
          title={collapsed ? firstPet.name : undefined}
        >
          {collapsed ? (
            <img
              src={firstPet.avatar_url || 'https://placedog.net/40/40'}
              alt={firstPet.name}
              className="w-9 h-9 rounded-xl object-cover mx-auto"
              onError={e => { e.target.src = 'https://placedog.net/40/40'; }}
            />
          ) : (
            <div className="flex items-center gap-3">
              <img
                src={firstPet.avatar_url || 'https://placedog.net/40/40'}
                alt={firstPet.name}
                className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                onError={e => { e.target.src = 'https://placedog.net/40/40'; }}
              />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-800 text-sm truncate">{firstPet.name}</p>
                <p className="text-xs text-wahu-500 truncate">@{firstPet.username}</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="h-1.5 flex-1 bg-wahu-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-wahu-400 to-orange-400 rounded-full"
                      style={{ width: `${Math.min(100, ((firstPet.xp % 1000) / 1000) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-wahu-500 font-semibold">Nv.{firstPet.level}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 min-h-0 overflow-y-auto px-2 py-3 flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={20} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: croquetas + logout */}
      <div className="px-2 py-3 border-t border-wahu-100 flex flex-col gap-1">
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-wahu-50 ${collapsed ? 'justify-center' : ''}`}>
          <Bone size={16} className="text-wahu-500 flex-shrink-0" />
          {!collapsed && (
            <div>
              <p className="text-xs font-semibold text-wahu-600">Croquetas</p>
              <p className="text-xs text-gray-500">{user?.croquetas ?? 0} créditos</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors text-sm ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Cerrar sesión' : undefined}
        >
          <LogOut size={16} className="flex-shrink-0" />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}
