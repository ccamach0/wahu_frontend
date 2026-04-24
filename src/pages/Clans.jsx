import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flag, Plus, Users, TrendingUp } from 'lucide-react';
import api from '../services/api.js';
import { useMyPets } from '../hooks/useMyPets.jsx';
import { BUTTON_TEXT } from '../constants/buttonText.js';

export default function Clans() {
  const navigate = useNavigate();
  const { firstPet } = useMyPets();
  const [clans, setClans] = useState([]);
  const [myClans, setMyClans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newClan, setNewClan] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getClans()
      .then(setClans)
      .catch(() => setClans([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!firstPet) return;
    api.getMyClans(firstPet.id)
      .then(setMyClans)
      .catch(() => setMyClans([]));
  }, [firstPet]);

  const handleCreate = async () => {
    if (!newClan.name) return;
    if (!firstPet) return setError('Necesitas tener una mascota para crear un clan');
    setCreating(true);
    setError('');
    try {
      const created = await api.createClan({ ...newClan, pet_id: firstPet.id });
      setMyClans([created, ...myClans]);
      setNewClan({ name: '', description: '' });
      setShowCreate(false);
      // Refresh clans list
      const updated = await api.getClans();
      setClans(updated);
    } catch (err) {
      setError(err.message || 'Error al crear clan');
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = async (clan) => {
    if (!firstPet) return;
    try {
      await api.joinClan(clan.id, firstPet.id);
      setMyClans([...myClans, clan]);
      // Refresh the clans list to update the joined status
      const updated = await api.getClans();
      setClans(updated);
    } catch (err) {
      console.error('Error joining clan:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="page-header">
        <Flag className="page-icon" />
        <h1 className="page-title">Clanes</h1>
        <p className="page-subtitle">Únete a comunidades de mascotas con intereses similares</p>
      </div>

      <div className="card p-5 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <Users size={20} className="text-wahu-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600 leading-relaxed">
            Los clanes son grupos públicos donde las mascotas pueden socializar, compartir publicaciones y organizar actividades.
          </p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary text-sm py-2">
          <Plus size={16} /> + {BUTTON_TEXT.CREATE_CLAN}
        </button>
      </div>

      {showCreate && (
        <div className="card p-6 mb-6 border-2 border-wahu-200">
          <h3 className="font-bold text-gray-800 mb-4">Crear clan</h3>
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-3 border border-red-100">{error}</div>}
          <div className="flex flex-col gap-3">
            <input
              className="input"
              placeholder="Nombre del clan"
              value={newClan.name}
              onChange={e => setNewClan({ ...newClan, name: e.target.value })}
            />
            <textarea
              className="input resize-none h-20"
              placeholder="Descripción del clan..."
              value={newClan.description}
              onChange={e => setNewClan({ ...newClan, description: e.target.value })}
            />
            <div className="flex gap-3">
              <button className="btn-primary text-sm py-2 flex-1" onClick={handleCreate} disabled={creating}>
                {creating ? 'Creando...' : BUTTON_TEXT.CREATE}
              </button>
              <button className="btn-secondary text-sm py-2" onClick={() => setShowCreate(false)}>{BUTTON_TEXT.CANCEL}</button>
            </div>
          </div>
        </div>
      )}

      {myClans.length > 0 && (
        <section className="mb-6">
          <h2 className="font-bold text-gray-800 mb-3">Mis Clanes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myClans.map(clan => <ClanRow key={clan.id} clan={clan} joined navigate={navigate} />)}
          </div>
        </section>
      )}

      {myClans.length === 0 && (
        <div className="card p-8 text-center text-gray-400 mb-6">
          <Users size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">Aún no perteneces a ningún clan</p>
          <p className="text-xs mt-1">Explora los clanes disponibles y únete a uno</p>
        </div>
      )}

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-800">Explorar Clanes</h2>
          <span className="text-xs text-wahu-500 flex items-center gap-1">
            <TrendingUp size={12} /> Más populares
          </span>
        </div>
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1,2,3].map(i => <div key={i} className="card h-20 animate-pulse bg-wahu-50" />)}
          </div>
        ) : clans.length === 0 ? (
          <div className="card p-8 text-center text-gray-400">
            <Flag size={36} className="mx-auto mb-3 opacity-30" />
            <p>No hay clanes disponibles aún</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clans.map(clan => (
              <ClanRow
                key={clan.id}
                clan={clan}
                joined={myClans.some(m => m.id === clan.id)}
                onJoin={() => handleJoin(clan)}
                navigate={navigate}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ClanRow({ clan, joined, onJoin, navigate }) {
  const handleCardClick = () => {
    navigate(`/clans/${clan.id}`);
  };

  const handleJoinClick = async (e) => {
    e.stopPropagation();
    await onJoin?.();
  };

  return (
    <div className="card overflow-hidden cursor-pointer hover:shadow-lg transition" onClick={handleCardClick}>
      <div className="flex gap-4 p-4">
        <img
          src={clan.avatar_url || 'https://placedog.net/80/80'}
          alt={clan.name}
          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
          onError={e => { e.target.src = 'https://placedog.net/80/80'; }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-gray-800 text-sm leading-tight">{clan.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{clan.description}</p>
            </div>
            <span className="badge bg-wahu-100 text-wahu-600 text-xs flex-shrink-0">Nv.{clan.level || 1}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Users size={12} /> {clan.member_count || 1} miembros
            </span>
            {!joined ? (
              <button
                className="btn-primary text-xs py-1 px-3"
                onClick={handleJoinClick}
                title="Enviar solicitud de acceso"
              >
                Solicitar
              </button>
            ) : (
              <span className="text-xs text-wahu-500 font-semibold">{BUTTON_TEXT.MEMBER}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
