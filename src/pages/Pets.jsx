import { useToast } from '../hooks/useToast.jsx';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, Search, Users, SlidersHorizontal, X } from 'lucide-react';
import api from '../services/api.js';
import PetCard from '../components/PetCard.jsx';
import { usePetContext } from '../hooks/usePetContext.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { BUTTON_TEXT } from '../constants/buttonText.js';

const SPECIES = ['', 'Perro', 'Gato', 'Conejo', 'Pájaro', 'Hamster', 'Otro'];
const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularidad' },
  { value: 'level', label: 'Nivel' },
  { value: 'name', label: 'Nombre A-Z' },
];

export default function Pets() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activePet } = usePetContext();
  const [tab, setTab] = useState('pets'); // 'pets' | 'companions'
  const [pets, setPets] = useState([]);
  const [companions, setCompanions] = useState([]);
  const [loading, setLoading] = useState(true);
  // petId → 'sent' | 'friends'
  const [petStatuses, setPetStatuses] = useState({});
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ species: '', min_level: '', max_level: '', sort: 'popularity' });

  const fetchPets = useCallback((q = '', f = filters) => {
    setLoading(true);
    const params = { search: q, limit: 24, ...(f.species && { species: f.species }), ...(f.min_level && { min_level: f.min_level }), ...(f.max_level && { max_level: f.max_level }), sort: f.sort };
    if (user?.id) params.exclude_companion = user.id;
    api.getPets(params)
      .then(data => setPets(data.pets || data))
      .catch(() => setPets([]))
      .finally(() => setLoading(false));
  }, [filters, user]);

  const fetchCompanions = useCallback((q = '') => {
    setLoading(true);
    api.getCompanions({ search: q, limit: 24 })
      .then(data => setCompanions(data.companions || []))
      .catch(() => setCompanions([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (tab === 'pets') fetchPets(search);
    else fetchCompanions(search);
  }, [tab, search, fetchPets]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (tab === 'pets') fetchPets(search);
    else fetchCompanions(search);
  };

  const handleFilterChange = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    fetchPets(search, next);
  };

  const clearFilters = () => {
    const reset = { species: '', min_level: '', max_level: '', sort: 'popularity' };
    setFilters(reset);
    fetchPets(search, reset);
  };

  const activeFilterCount = [filters.species, filters.min_level, filters.max_level].filter(Boolean).length;

  // Cargar estados de amistad cuando cambien las mascotas/activePet
  useEffect(() => {
    if (!activePet || pets.length === 0) return;
    Promise.all([
      api.getFriendships(activePet.id),
      api.getSentRequests(activePet.id),
    ]).then(([friends, sent]) => {
      const map = {};
      const friendIds = new Set([
        ...(friends.manada || []).map(p => p.id),
        ...(friends.jauria || []).map(p => p.id),
      ]);
      const sentIds = new Set(sent.map(r => r.id));
      for (const pet of pets) {
        if (friendIds.has(pet.id)) map[pet.id] = 'friends';
        else if (sentIds.has(pet.id)) map[pet.id] = 'sent';
      }
      setPetStatuses(map);
    }).catch(() => {});
  }, [activePet?.id, pets]);

  // Invitar a mascota a la jauría
  const handleInvite = async (pet) => {
    if (!activePet) return toast.error('Selecciona una mascota activa primero');
    try {
      await api.sendFriendRequest({ pet_id: activePet.id, friend_id: pet.id });
      setPetStatuses(prev => ({ ...prev, [pet.id]: 'sent' }));
    } catch (err) {
      if (err.message?.includes('Ya son amigos')) {
        setPetStatuses(prev => ({ ...prev, [pet.id]: 'friends' }));
      } else if (err.message?.includes('Solicitud ya enviada')) {
        setPetStatuses(prev => ({ ...prev, [pet.id]: 'sent' }));
      } else {
        toast.error(err.message);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="page-header">
        <PawPrint className="page-icon" />
        <h1 className="page-title">Explorar</h1>
        <p className="page-subtitle">Descubre mascotas y compañeros de la comunidad Wahu</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-white rounded-xl border border-wahu-100 p-1 mb-5">
        <button onClick={() => { setTab('pets'); setSearch(''); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === 'pets' ? 'bg-wahu-500 text-white' : 'text-gray-500 hover:text-wahu-500'}`}>
          <PawPrint size={16} /> Mascotas
        </button>
        <button onClick={() => { setTab('companions'); setSearch(''); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === 'companions' ? 'bg-wahu-500 text-white' : 'text-gray-500 hover:text-wahu-500'}`}>
          <Users size={16} /> Compañeros
        </button>
      </div>

      {/* Buscador + filtros */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" className="input pl-11"
            placeholder={tab === 'pets' ? 'Buscar por nombre, raza...' : 'Buscar compañeros...'}
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button type="submit" className="btn-primary px-5">Buscar</button>
        {tab === 'pets' && (
          <button type="button" onClick={() => setShowFilters(!showFilters)}
            className={`relative px-4 py-2 rounded-xl border font-medium text-sm transition-colors ${showFilters ? 'bg-wahu-500 text-white border-wahu-500' : 'bg-white text-gray-600 border-gray-200 hover:border-wahu-300'}`}>
            <SlidersHorizontal size={18} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-wahu-500 text-white text-xs rounded-full flex items-center justify-center">{activeFilterCount}</span>
            )}
          </button>
        )}
      </form>

      {/* Panel de filtros */}
      {tab === 'pets' && showFilters && (
        <div className="bg-white border border-wahu-100 rounded-2xl p-4 mb-5 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Especie</label>
            <select className="input text-sm py-2 min-w-32" value={filters.species} onChange={e => handleFilterChange('species', e.target.value)}>
              {SPECIES.map(s => <option key={s} value={s}>{s || 'Todas'}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Nivel mínimo</label>
            <input type="number" min="1" className="input text-sm py-2 w-24" placeholder="1" value={filters.min_level} onChange={e => handleFilterChange('min_level', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Nivel máximo</label>
            <input type="number" min="1" className="input text-sm py-2 w-24" placeholder="100" value={filters.max_level} onChange={e => handleFilterChange('max_level', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Ordenar por</label>
            <select className="input text-sm py-2" value={filters.sort} onChange={e => handleFilterChange('sort', e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors">
              <X size={14} /> Limpiar
            </button>
          )}
        </div>
      )}

      {/* Resultados */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="card animate-pulse">
              <div className="h-44 bg-wahu-100 rounded-t-2xl" />
              <div className="p-4 flex flex-col gap-3">
                <div className="h-4 bg-wahu-100 rounded w-1/2" />
                <div className="h-3 bg-wahu-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : tab === 'pets' ? (
        pets.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <PawPrint size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium">No se encontraron mascotas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pets.map(pet => (
              <div key={pet.id} className="relative group">
                <PetCard pet={pet} onClick={() => navigate(`/pets/${pet.username}`)} />
                {activePet && activePet.id !== pet.id && (() => {
                  const st = petStatuses[pet.id];
                  if (st === 'friends') return (
                    <span className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-green-100 text-green-700 text-xs py-1.5 px-3 rounded-xl font-medium">
                      En jauría ✓
                    </span>
                  );
                  if (st === 'sent') return (
                    <span className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-amber-100 text-amber-700 text-xs py-1.5 px-3 rounded-xl font-medium">
                      Solicitud enviada
                    </span>
                  );
                  return (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleInvite(pet); }}
                      className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity btn-primary text-xs py-1.5 px-3">
                      {BUTTON_TEXT.INVITE_PACK}
                    </button>
                  );
                })()}
              </div>
            ))}
          </div>
        )
      ) : (
        companions.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Users size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium">No se encontraron compañeros</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companions.map(comp => (
              <div key={comp.id} className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/companions/${comp.username}`)}>
                <img
                  src={comp.avatar_url || `https://i.pravatar.cc/80?u=${comp.id}`}
                  alt={comp.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-wahu-100 flex-shrink-0"
                  onError={e => { e.target.src = `https://i.pravatar.cc/80?u=${comp.id}`; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 truncate">{comp.name}</p>
                  <p className="text-xs text-wahu-500">@{comp.username}</p>
                  <p className="text-xs text-gray-400">{comp.pet_count} mascota{comp.pet_count !== 1 ? 's' : ''}</p>
                </div>
                <span className="text-xs text-wahu-400 font-medium">Ver →</span>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
