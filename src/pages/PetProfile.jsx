import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Users, Star, ArrowLeft, PawPrint, Shield, X } from 'lucide-react';
import api from '../services/api.js';
import { useAuth } from '../hooks/useAuth.jsx';
import { useMyPets } from '../hooks/useMyPets.jsx';

const CARD_COLORS = {
  Personalidad: 'bg-pink-100 text-pink-700',
  Salud: 'bg-green-100 text-green-700',
  Comportamiento: 'bg-blue-100 text-blue-700',
  Habilidades: 'bg-purple-100 text-purple-700',
  Energía: 'bg-orange-100 text-orange-700',
};

// Estados posibles: 'loading' | 'none' | 'sent' | 'received' | 'friends'
function useFriendStatus(firstPet, petId) {
  const [status, setStatus] = useState('loading');
  const [friendshipId, setFriendshipId] = useState(null);

  useEffect(() => {
    if (!firstPet || !petId || firstPet.id === petId) { setStatus('none'); return; }
    Promise.all([
      api.getFriendships(firstPet.id),
      api.getSentRequests(firstPet.id),
      api.getPendingRequests(firstPet.id),
    ]).then(([friends, sent, received]) => {
      const allFriendIds = new Set([
        ...(friends.manada || []).map(p => p.id),
        ...(friends.jauria || []).map(p => p.id),
      ]);
      if (allFriendIds.has(petId)) { setStatus('friends'); return; }
      const sentReq = sent.find(r => r.id === petId);
      if (sentReq) { setStatus('sent'); setFriendshipId(sentReq.friendship_id); return; }
      const recvReq = received.find(r => r.id === petId);
      if (recvReq) { setStatus('received'); setFriendshipId(recvReq.friendship_id); return; }
      setStatus('none');
    }).catch(() => setStatus('none'));
  }, [firstPet?.id, petId]);

  return { status, setStatus, friendshipId };
}

export default function PetProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { firstPet } = useMyPets();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    api.getPet(username)
      .then(setPet)
      .catch(() => setPet(null))
      .finally(() => setLoading(false));
  }, [username]);

  const { status, setStatus, friendshipId } = useFriendStatus(firstPet, pet?.id);

  const isOwnPet = user && pet && pet.companion_id === user.id;

  const handleInvite = async () => {
    if (!firstPet || !pet || actionLoading) return;
    setActionLoading(true);
    try {
      await api.sendFriendRequest({ pet_id: firstPet.id, friend_id: pet.id });
      setStatus('sent');
    } catch (err) {
      alert(err.message || 'Error al enviar solicitud');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!firstPet || !pet || actionLoading) return;
    if (!confirm(`¿Quitar a ${pet.name} de tu jauría?`)) return;
    setActionLoading(true);
    try {
      await api.deleteFriendship(firstPet.id, pet.id);
      setStatus('none');
    } catch {
    } finally {
      setActionLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!friendshipId || actionLoading) return;
    setActionLoading(true);
    try {
      await api.acceptFriendRequest(friendshipId);
      setStatus('friends');
    } catch {
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="card animate-pulse">
        <div className="h-48 bg-wahu-100 rounded-t-2xl" />
        <div className="p-6 flex flex-col gap-4">
          <div className="h-6 bg-wahu-100 rounded w-1/3" />
          <div className="h-4 bg-wahu-100 rounded w-1/2" />
        </div>
      </div>
    </div>
  );

  if (!pet) return (
    <div className="max-w-2xl mx-auto px-6 py-8 text-center">
      <PawPrint size={48} className="mx-auto mb-4 text-wahu-200" />
      <h2 className="text-xl font-bold text-gray-700 mb-2">Mascota no encontrada</h2>
      <button onClick={() => navigate('/pets')} className="btn-primary mt-4">Ver todas las mascotas</button>
    </div>
  );

  const popularityPct = Math.min(100, Math.round(pet.popularity || 0));

  // Botón según estado de amistad
  const renderFriendButton = () => {
    if (isOwnPet || !firstPet) return null;
    if (status === 'loading') return (
      <div className="w-32 h-9 bg-gray-100 rounded-xl animate-pulse" />
    );
    if (status === 'friends') return (
      <button onClick={handleRemove} disabled={actionLoading}
        className="flex items-center gap-1.5 text-sm py-2 px-4 border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors disabled:opacity-50">
        <X size={14} /> Quitar de jauría
      </button>
    );
    if (status === 'sent') return (
      <span className="flex items-center gap-1.5 text-sm py-2 px-4 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl">
        <Shield size={14} /> Solicitud enviada
      </span>
    );
    if (status === 'received') return (
      <button onClick={handleAccept} disabled={actionLoading}
        className="flex items-center gap-1.5 btn-primary text-sm py-2 px-4 disabled:opacity-50">
        <Shield size={14} /> Aceptar en jauría
      </button>
    );
    // none
    return (
      <button onClick={handleInvite} disabled={actionLoading}
        className="flex items-center gap-1.5 btn-primary text-sm py-2 px-4 disabled:opacity-50">
        <Shield size={14} /> {actionLoading ? '...' : 'Invitar a jauría'}
      </button>
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-wahu-500 mb-5 transition-colors">
        <ArrowLeft size={16} /> Volver
      </button>

      <div className="card overflow-hidden mb-5">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-br from-wahu-400 to-orange-500 relative">
          <div className="absolute -bottom-10 left-6">
            <img
              src={pet.avatar_url || ''}
              alt={pet.name}
              className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md bg-wahu-100"
              onError={e => {
                e.target.style.display = 'none';
                e.target.nextSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden w-20 h-20 rounded-2xl border-4 border-white shadow-md bg-gradient-to-br from-wahu-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold">
              {pet.name[0].toUpperCase()}
            </div>
          </div>
          <div className="absolute top-3 right-4">
            <span className="bg-white/90 text-wahu-600 font-bold text-sm px-3 py-1 rounded-full flex items-center gap-1">
              <Star size={13} fill="currentColor" /> Nv. {pet.level}
            </span>
          </div>
        </div>

        <div className="pt-12 px-6 pb-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{pet.name}</h1>
              <p className="text-wahu-500 font-medium text-sm">@{pet.username}</p>
            </div>
            {renderFriendButton()}
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1">🐾 {pet.species || 'Perro'} · {pet.breed || '—'}</span>
            {pet.location && (
              <span className="flex items-center gap-1"><MapPin size={14} /> {pet.location}</span>
            )}
            <span className="flex items-center gap-1"><Users size={14} /> {pet.friend_count || 0} amigos</span>
          </div>

          {pet.bio && (
            <p className="text-sm text-gray-600 leading-relaxed mb-4 bg-wahu-50 rounded-xl px-4 py-3">
              "{pet.bio}"
            </p>
          )}

          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Popularidad</span>
              <span className="font-semibold text-wahu-500">{popularityPct}%</span>
            </div>
            <div className="h-2 bg-wahu-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-wahu-400 to-orange-500 rounded-full transition-all"
                style={{ width: `${popularityPct}%` }} />
            </div>
          </div>

          {/* Dueño como hipervínculo */}
          {pet.companion_name && (
            <button
              onClick={() => navigate(`/companions/${pet.companion_username}`)}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-wahu-500 transition-colors mt-2 group">
              <img
                src={pet.companion_avatar || `https://i.pravatar.cc/24?u=${pet.companion_username}`}
                className="w-6 h-6 rounded-full border border-gray-200 group-hover:border-wahu-300 transition-colors"
                onError={e => { e.target.src = `https://i.pravatar.cc/24`; }}
              />
              <span>Compañero: <span className="font-medium text-gray-600 group-hover:text-wahu-600">@{pet.companion_username}</span></span>
            </button>
          )}
        </div>
      </div>

      {/* Tarjetas */}
      {pet.cards && pet.cards.length > 0 && (
        <div className="card p-5 mb-5">
          <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <PawPrint size={16} className="text-wahu-500" /> Tarjetas
          </h2>
          <div className="flex flex-wrap gap-2">
            {pet.cards.map((card) => {
              const colorClass = CARD_COLORS[card.category] || 'bg-gray-100 text-gray-600';
              return (
                <span key={card.id} className={`badge ${colorClass} text-sm`}>{card.name}</span>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Nivel', value: pet.level },
          { label: 'XP', value: (pet.xp || 0).toLocaleString() },
          { label: 'Amigos', value: pet.friend_count || 0 },
        ].map(({ label, value }) => (
          <div key={label} className="card p-4 text-center">
            <p className="text-2xl font-bold text-wahu-500">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
