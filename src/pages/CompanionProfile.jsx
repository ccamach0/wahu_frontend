import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, PawPrint, ArrowLeft, UserCheck, Clock, Check, PawPrint as PawIcon } from 'lucide-react';
import api from '../services/api.js';
import { useMyPets } from '../hooks/useMyPets.jsx';

// Estado de amistad de una mascota del compañero respecto a mi mascota activa
function useFriendshipStatus(activePet, companionPets) {
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activePet || !companionPets.length) return;
    setLoading(true);
    Promise.all([
      api.getFriendships(activePet.id),
      api.getPendingRequests(activePet.id),
      api.getSentRequests(activePet.id),
    ]).then(([friends, received, sent]) => {
      const map = {};
      const allFriends = new Set([
        ...(friends.manada || []).map(p => p.id),
        ...(friends.jauria || []).map(p => p.id),
      ]);
      const receivedIds = new Set(received.map(r => r.id));
      const sentIds = new Set(sent.map(r => r.id));
      const sentFriendships = Object.fromEntries(sent.map(r => [r.id, r.friendship_id]));

      for (const pet of companionPets) {
        if (allFriends.has(pet.id)) {
          map[pet.id] = 'friends';
        } else if (sentIds.has(pet.id)) {
          map[pet.id] = { status: 'sent', friendship_id: sentFriendships[pet.id] };
        } else if (receivedIds.has(pet.id)) {
          map[pet.id] = 'received';
        } else {
          map[pet.id] = 'none';
        }
      }
      setStatuses(map);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [activePet?.id, companionPets.length]);

  return { statuses, loading, setStatuses };
}

export default function CompanionProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { firstPet } = useMyPets();
  const [companion, setCompanion] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    api.getCompanionProfile(username)
      .then(setCompanion)
      .catch(() => setCompanion(null))
      .finally(() => setPageLoading(false));
  }, [username]);

  const { statuses, loading: statusLoading, setStatuses } = useFriendshipStatus(
    firstPet,
    companion?.pets || []
  );

  const sendRequest = async (pet) => {
    if (!firstPet) return;
    setActionLoading(prev => ({ ...prev, [pet.id]: true }));
    try {
      await api.sendFriendRequest({ pet_id: firstPet.id, friend_id: pet.id });
      setStatuses(prev => ({ ...prev, [pet.id]: { status: 'sent', friendship_id: null } }));
    } catch (err) {
      alert(err.message || 'Error al enviar solicitud');
    } finally {
      setActionLoading(prev => ({ ...prev, [pet.id]: false }));
    }
  };

  const cancelRequest = async (pet) => {
    const s = statuses[pet.id];
    if (!s?.friendship_id) return;
    setActionLoading(prev => ({ ...prev, [pet.id]: true }));
    try {
      await api.cancelFriendRequest(s.friendship_id);
      setStatuses(prev => ({ ...prev, [pet.id]: 'none' }));
    } catch {
    } finally {
      setActionLoading(prev => ({ ...prev, [pet.id]: false }));
    }
  };

  if (pageLoading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-32 bg-wahu-50 rounded-2xl" />
          <div className="h-20 bg-wahu-50 rounded-2xl" />
          <div className="h-20 bg-wahu-50 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!companion) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8 text-center text-gray-400">
        <Users size={48} className="mx-auto mb-4 opacity-30" />
        <p className="font-medium">Compañero no encontrado</p>
        <button onClick={() => navigate(-1)} className="btn-secondary mt-4">Volver</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Back */}
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-wahu-500 mb-5 transition-colors">
        <ArrowLeft size={16} /> Volver
      </button>

      {/* Header del compañero */}
      <div className="card p-6 mb-6 flex items-center gap-5">
        <img
          src={companion.avatar_url || `https://i.pravatar.cc/80?u=${companion.id}`}
          alt={companion.name}
          className="w-20 h-20 rounded-full object-cover border-4 border-wahu-100 shadow-md flex-shrink-0"
          onError={e => { e.target.src = `https://i.pravatar.cc/80?u=${companion.id}`; }}
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-800 truncate">{companion.name}</h1>
          <p className="text-sm text-wahu-500">@{companion.username}</p>
          <p className="text-sm text-gray-400 mt-1">
            {companion.pets?.length || 0} mascota{(companion.pets?.length || 0) !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Mascota activa usada para enviar solicitudes */}
      {firstPet && (
        <div className="flex items-center gap-3 bg-wahu-50 border border-wahu-200 rounded-xl px-4 py-2.5 mb-5">
          <img src={firstPet.avatar_url || 'https://placedog.net/24/24'}
            className="w-8 h-8 rounded-full object-cover border-2 border-wahu-300"
            onError={e => { e.target.src = 'https://placedog.net/24/24'; }} />
          <div>
            <p className="text-xs font-semibold text-wahu-700">Mascota activa: {firstPet.name}</p>
            <p className="text-xs text-gray-500">Las solicitudes de jauría se envían en nombre de esta mascota</p>
          </div>
        </div>
      )}

      {!firstPet && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-5">
          <p className="text-xs text-amber-700">
            Necesitas una <span className="font-semibold">mascota activa</span> para enviar solicitudes de amistad.
          </p>
        </div>
      )}

      {/* Lista de mascotas */}
      <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
        <PawIcon size={18} className="text-wahu-500" />
        Mascotas de {companion.name}
      </h2>

      {!companion.pets?.length ? (
        <div className="card p-8 text-center text-gray-400">
          <PawPrint size={40} className="mx-auto mb-3 opacity-30" />
          <p>Este compañero no tiene mascotas registradas</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {companion.pets.map(pet => {
            const status = statuses[pet.id];
            const busy = actionLoading[pet.id] || statusLoading;

            return (
              <div key={pet.id} className="card flex items-center gap-4 p-4">
                <img src={pet.avatar_url || 'https://placedog.net/48/48'} alt={pet.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-wahu-100 flex-shrink-0 cursor-pointer"
                  onError={e => { e.target.src = 'https://placedog.net/48/48'; }}
                  onClick={() => navigate(`/pets/${pet.username}`)} />
                <div className="flex-1 cursor-pointer" onClick={() => navigate(`/pets/${pet.username}`)}>
                  <p className="font-semibold text-gray-800">{pet.name}</p>
                  <p className="text-xs text-wahu-500">@{pet.username}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{pet.species} · {pet.breed} · Nv.{pet.level}</p>
                </div>

                {/* Botón de solicitud según estado */}
                {!firstPet ? null
                  : firstPet.id === pet.id ? null
                  : status === 'friends' ? (
                    <div className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1.5 rounded-xl">
                      <Check size={14} />
                      <span className="text-xs font-medium">En jauría</span>
                    </div>
                  ) : status === 'received' ? (
                    <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl">
                      <UserCheck size={14} />
                      <span className="text-xs font-medium">Te envió solicitud</span>
                    </div>
                  ) : status?.status === 'sent' ? (
                    <button
                      onClick={() => cancelRequest(pet)}
                      disabled={busy}
                      className="flex items-center gap-1 text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50">
                      <Clock size={14} />
                      <span className="text-xs font-medium">Pendiente · Cancelar</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => sendRequest(pet)}
                      disabled={busy || !firstPet}
                      className="btn-primary text-xs py-1.5 px-3 disabled:opacity-50">
                      {busy ? '...' : '+ Agregar a Jauría'}
                    </button>
                  )
                }
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
