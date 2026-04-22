import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ChevronUp, ChevronDown, Users, Bell, Check, X, MessageCircle, Send, Clock, Star, CalendarDays } from 'lucide-react';
import api from '../services/api.js';
import { useMyPets } from '../hooks/useMyPets.jsx';
import { AppointmentModal } from './Appointments.jsx';

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function Pack() {
  const navigate = useNavigate();
  const { firstPet, loading: petsLoading } = useMyPets();
  const [tab, setTab] = useState('manada');
  const [manada, setManada] = useState([]);
  const [jauria, setJauria] = useState([]);
  const [pending, setPending] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apptTarget, setApptTarget] = useState(null);

  const loadData = () => {
    if (!firstPet) { setLoading(false); return; }
    setLoading(true);
    Promise.all([
      api.getFriendships(firstPet.id),
      api.getPendingRequests(firstPet.id),
      api.getSentRequests(firstPet.id),
    ])
      .then(([friends, reqs, sentReqs]) => {
        const m = friends.manada || [];
        const manadaIds = new Set(m.map(p => p.id));
        // Jauría sólo muestra los que NO están ya en manada
        const j = (friends.jauria || []).filter(p => !manadaIds.has(p.id));
        setManada(m);
        setJauria(j);
        setPending(reqs || []);
        setSent(sentReqs || []);
      })
      .catch(() => { setManada([]); setJauria([]); setPending([]); setSent([]); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [firstPet]);

  const moveUp = async (idx) => {
    if (idx === 0 || !firstPet) return;
    const next = [...manada];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    setManada(next);
    await api.reorderManada(firstPet.id, next.map(p => p.id)).catch(() => {});
  };

  const moveDown = async (idx) => {
    if (idx === manada.length - 1 || !firstPet) return;
    const next = [...manada];
    [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
    setManada(next);
    await api.reorderManada(firstPet.id, next.map(p => p.id)).catch(() => {});
  };

  const removeFromManada = async (pet) => {
    setManada(prev => prev.filter(m => m.id !== pet.id));
    setJauria(prev => [...prev, pet]); // devolver a jauría
    await api.removeFromManada(firstPet.id, pet.id).catch(() => {});
  };

  const deleteFromJauria = async (pet) => {
    if (!confirm(`¿Eliminar a ${pet.name} de tu jauría? Se eliminará la amistad.`)) return;
    setJauria(prev => prev.filter(j => j.id !== pet.id));
    setManada(prev => prev.filter(m => m.id !== pet.id));
    await api.deleteFriendship(firstPet.id, pet.id).catch(() => {});
  };

  const addToManada = async (pet) => {
    if (manada.length >= 20 || !firstPet) return;
    setManada(prev => [...prev, { ...pet, manada_order: prev.length + 1 }]);
    setJauria(prev => prev.filter(p => p.id !== pet.id)); // quitar de jauría
    await api.addToManada(firstPet.id, pet.id).catch(() => {});
  };

  const acceptRequest = async (req) => {
    await api.acceptFriendRequest(req.friendship_id).catch(() => {});
    setPending(prev => prev.filter(r => r.friendship_id !== req.friendship_id));
    loadData();
  };

  const rejectRequest = async (req) => {
    await api.rejectFriendRequest(req.friendship_id).catch(() => {});
    setPending(prev => prev.filter(r => r.friendship_id !== req.friendship_id));
  };

  const cancelSent = async (req) => {
    await api.cancelFriendRequest(req.friendship_id).catch(() => {});
    setSent(prev => prev.filter(r => r.friendship_id !== req.friendship_id));
  };

  const isLoading = petsLoading || loading;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="page-header">
        <Shield className="page-icon" />
        <h1 className="page-title">Manada</h1>
        <p className="page-subtitle">Gestiona los amigos de tu mascota</p>
      </div>

      {/* Mascota activa */}
      {firstPet && (
        <div className="card p-4 mb-4 flex items-center gap-3 bg-wahu-50 border border-wahu-200">
          <img src={firstPet.avatar_url || 'https://placedog.net/48/48'}
            alt={firstPet.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-wahu-300"
            onError={e => { e.target.src = 'https://placedog.net/48/48'; }} />
          <div>
            <p className="font-bold text-wahu-700 text-sm">{firstPet.name}</p>
            <p className="text-xs text-wahu-500">@{firstPet.username} · Nv.{firstPet.level}</p>
          </div>
          <span className="ml-auto text-xs bg-wahu-500 text-white px-2 py-1 rounded-full font-medium">Mascota activa</span>
        </div>
      )}

      <div className="card p-4 mb-6">
        <div className="flex gap-3">
          <Users size={20} className="text-wahu-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-800 text-sm mb-1">¿Qué es la Manada?</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Tu <span className="font-semibold text-wahu-500">Manada</span> son tus mejores amigos (máximo 20), ordenados por puesto.
              Tu <span className="font-semibold text-gray-600">Jauría</span> son todos tus amigos sin límite.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 bg-white rounded-xl border border-wahu-100 p-1 mb-6 gap-1">
        {[
          { key: 'manada', label: `Manada (${manada.length}/20)`, icon: Shield },
          { key: 'jauria', label: `Jauría (${jauria.length})`, icon: Users },
          { key: 'pending', label: 'Recibidas', icon: Bell, badge: pending.length },
          { key: 'sent', label: 'Enviadas', icon: Send, badge: sent.length },
        ].map(({ key, label, icon: Icon, badge }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`relative flex flex-col items-center justify-center gap-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${tab === key ? 'bg-wahu-500 text-white' : 'text-gray-500 hover:text-wahu-500'}`}>
            <Icon size={15} />
            <span className="leading-none">{label}</span>
            {badge > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2].map(i => <div key={i} className="card h-20 animate-pulse bg-wahu-50" />)}
        </div>
      ) : !firstPet ? (
        <div className="card p-8 text-center text-gray-400">
          <Shield size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">Necesitas una mascota para ver tu manada</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">

          {/* MANADA */}
          {tab === 'manada' && (
            manada.length === 0 ? (
              <div className="card p-8 text-center text-gray-400">
                <Shield size={40} className="mx-auto mb-3 opacity-30" />
                <p>Tu manada está vacía</p>
                <p className="text-xs mt-1">Agrega amigos desde la Jauría</p>
              </div>
            ) : manada.map((pet, idx) => (
              <div key={pet.id} className="card flex items-center gap-3 p-4">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${idx < 3 ? 'text-lg' : 'bg-wahu-500 text-white text-sm'}`}>
                  {idx < 3 ? MEDAL[idx + 1] : idx + 1}
                </div>
                <img src={pet.avatar_url || 'https://placedog.net/44/44'} alt={pet.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-wahu-100 cursor-pointer"
                  onError={e => { e.target.src = 'https://placedog.net/44/44'; }}
                  onClick={() => navigate(`/pets/${pet.username}`)} />
                <div className="flex-1 cursor-pointer" onClick={() => navigate(`/pets/${pet.username}`)}>
                  <p className="font-semibold text-gray-800 text-sm">{pet.name}</p>
                  <p className="text-xs text-wahu-500">@{pet.username} · Nv.{pet.level}</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => moveUp(idx)} disabled={idx === 0}
                    className="p-1 hover:bg-wahu-50 rounded text-gray-400 hover:text-wahu-500 disabled:opacity-30 transition-colors">
                    <ChevronUp size={15} />
                  </button>
                  <button onClick={() => moveDown(idx)} disabled={idx === manada.length - 1}
                    className="p-1 hover:bg-wahu-50 rounded text-gray-400 hover:text-wahu-500 disabled:opacity-30 transition-colors">
                    <ChevronDown size={15} />
                  </button>
                </div>
                <button onClick={() => setApptTarget(pet)}
                  className="p-1.5 hover:bg-orange-50 text-orange-400 hover:text-orange-600 rounded-lg transition-colors" title="Proponer cita">
                  <CalendarDays size={16} />
                </button>
                <button onClick={() => navigate(`/chat?petId=${pet.id}`)}
                  className="p-1.5 hover:bg-wahu-50 text-wahu-400 hover:text-wahu-600 rounded-lg transition-colors" title="Chatear">
                  <MessageCircle size={16} />
                </button>
                <button onClick={() => removeFromManada(pet)}
                  className="text-xs text-red-400 hover:text-red-600 font-medium px-2 transition-colors">
                  Quitar
                </button>
              </div>
            ))
          )}

          {/* JAURÍA */}
          {tab === 'jauria' && (
            jauria.length === 0 ? (
              <div className="card p-8 text-center text-gray-400">
                <Users size={40} className="mx-auto mb-3 opacity-30" />
                <p>Aún no tienes amigos en tu jauría</p>
                <p className="text-xs mt-1">Explora mascotas y envía solicitudes de amistad</p>
              </div>
            ) : jauria.map((pet) => (
              <div key={pet.id} className="card flex items-center gap-4 p-4">
                <img src={pet.avatar_url || 'https://placedog.net/48/48'} alt={pet.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-wahu-100 cursor-pointer"
                  onError={e => { e.target.src = 'https://placedog.net/48/48'; }}
                  onClick={() => navigate(`/pets/${pet.username}`)} />
                <div className="flex-1 cursor-pointer" onClick={() => navigate(`/pets/${pet.username}`)}>
                  <p className="font-semibold text-gray-800">{pet.name}</p>
                  <p className="text-xs text-wahu-500">@{pet.username}</p>
                </div>
                <span className="badge bg-wahu-100 text-wahu-600 text-xs">Nv.{pet.level}</span>
                <button onClick={() => setApptTarget(pet)}
                  className="p-1.5 hover:bg-orange-50 text-orange-400 hover:text-orange-600 rounded-lg transition-colors" title="Proponer cita">
                  <CalendarDays size={16} />
                </button>
                <button onClick={() => navigate(`/chat?petId=${pet.id}`)}
                  className="p-1.5 hover:bg-wahu-50 text-wahu-400 hover:text-wahu-600 rounded-lg transition-colors" title="Chatear">
                  <MessageCircle size={16} />
                </button>
                {!manada.find(m => m.id === pet.id) && (
                  <button onClick={() => addToManada(pet)}
                    className="flex items-center gap-1 text-xs py-1.5 px-3 rounded-xl font-medium border border-wahu-200 text-wahu-600 hover:bg-wahu-500 hover:text-white hover:border-wahu-500 transition-all disabled:opacity-40"
                    disabled={manada.length >= 20}
                    title={manada.length >= 20 ? 'Manada llena (máx. 20)' : 'Elevar a Manada'}>
                    <Star size={11} /> Manada
                  </button>
                )}
                <button onClick={() => deleteFromJauria(pet)}
                  className="p-1.5 hover:bg-red-50 text-gray-300 hover:text-red-400 rounded-lg transition-colors" title="Eliminar amistad">
                  <X size={15} />
                </button>
              </div>
            ))
          )}

          {/* SOLICITUDES RECIBIDAS */}
          {tab === 'pending' && (
            pending.length === 0 ? (
              <div className="card p-8 text-center text-gray-400">
                <Bell size={40} className="mx-auto mb-3 opacity-30" />
                <p>No hay solicitudes pendientes</p>
              </div>
            ) : pending.map((req) => (
              <div key={req.friendship_id} className="card flex items-center gap-4 p-4">
                <img src={req.avatar_url || 'https://placedog.net/48/48'} alt={req.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-wahu-100 cursor-pointer"
                  onError={e => { e.target.src = 'https://placedog.net/48/48'; }}
                  onClick={() => navigate(`/pets/${req.username}`)} />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{req.name}</p>
                  <p className="text-xs text-wahu-500">@{req.username} · Nv.{req.level}</p>
                  <p className="text-xs text-gray-400 mt-0.5">quiere ser amigo de <span className="font-medium text-wahu-600">{firstPet.name}</span></p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => acceptRequest(req)}
                    className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition-colors" title="Aceptar">
                    <Check size={16} />
                  </button>
                  <button onClick={() => rejectRequest(req)}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors" title="Rechazar">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))
          )}

          {/* SOLICITUDES ENVIADAS */}
          {tab === 'sent' && (
            sent.length === 0 ? (
              <div className="card p-8 text-center text-gray-400">
                <Send size={40} className="mx-auto mb-3 opacity-30" />
                <p>No hay solicitudes enviadas pendientes</p>
                <p className="text-xs mt-1">Explora mascotas para enviar solicitudes</p>
              </div>
            ) : sent.map((req) => (
              <div key={req.friendship_id} className="card flex items-center gap-4 p-4">
                <img src={req.avatar_url || 'https://placedog.net/48/48'} alt={req.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-100 cursor-pointer"
                  onError={e => { e.target.src = 'https://placedog.net/48/48'; }}
                  onClick={() => navigate(`/pets/${req.username}`)} />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{req.name}</p>
                  <p className="text-xs text-wahu-500">@{req.username} · Nv.{req.level}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    de <span className="text-gray-600">{req.owner_name}</span>
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock size={11} className="text-amber-500" />
                    <span className="text-xs text-amber-600">Esperando respuesta</span>
                  </div>
                </div>
                <button onClick={() => cancelSent(req)}
                  className="text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-xl transition-colors">
                  Cancelar
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {apptTarget && firstPet && (
        <AppointmentModal
          open={!!apptTarget}
          onClose={() => setApptTarget(null)}
          onCreated={() => setApptTarget(null)}
          myPet={firstPet}
          targetPet={apptTarget}
        />
      )}
    </div>
  );
}
