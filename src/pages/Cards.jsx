import { useToast } from '../hooks/useToast.jsx';
import { useState, useEffect } from 'react';
import { Tag, Search, Shuffle, Plus } from 'lucide-react';
import api from '../services/api.js';
import { useMyPets } from '../hooks/useMyPets.jsx';
import CardDisplay from '../components/CardDisplay.jsx';
import { BUTTON_TEXT } from '../constants/buttonText.js';

const CATEGORIES = ['Todas', 'Personalidad', 'Salud', 'Comportamiento', 'Habilidades', 'Energía'];

const CARD_COLORS = {
  Personalidad: { bg: 'bg-pink-50', border: 'border-pink-200', badge: 'bg-pink-100 text-pink-700', text: 'text-pink-800' },
  Salud: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700', text: 'text-green-800' },
  Comportamiento: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', text: 'text-blue-800' },
  Habilidades: { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', text: 'text-purple-800' },
  Energía: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', text: 'text-orange-800' },
};

export default function Cards() {
  const { firstPet } = useMyPets();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Todas');
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newCard, setNewCard] = useState({
    name: '',
    category: 'Personalidad',
    card_type: 'simple',
    value1_name: '',
    value1_value: '',
    value2_name: '',
    value2_value: '',
  });
  const [voted, setVoted] = useState(new Set());
  const [liked, setLiked] = useState(new Set());
  const [added, setAdded] = useState(new Set());

  const fetchCards = (params = {}) => {
    setLoading(true);
    api.getCards(params)
      .then(setCards)
      .catch(() => setCards([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCards(); }, []);

  const filtered = cards.filter(c => {
    const matchCat = category === 'Todas' || c.category === category;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handlePaw = async (card) => {
    if (voted.has(card.id) || !firstPet) return;
    setVoted(new Set([...voted, card.id]));
    setCards(cards.map(c => c.id === card.id ? { ...c, paw_count: Number(c.paw_count) + 1 } : c));
    try {
      const { paw_count } = await api.pawCard(card.id, firstPet.id);
      setCards(prev => prev.map(c => c.id === card.id ? { ...c, paw_count } : c));
    } catch {}
  };

  const handleAdd = async (card) => {
    if (added.has(card.id) || !firstPet) return;
    try {
      await api.addCardToPet(card.id, firstPet.id);
      setAdded(new Set([...added, card.id]));
    } catch {}
  };

  const handleLike = async (card) => {
    if (liked.has(card.id) || !firstPet) return;
    setLiked(new Set([...liked, card.id]));
    setCards(
      cards.map(c =>
        c.id === card.id ? { ...c, like_count: (c.like_count || 0) + 1 } : c
      )
    );
    try {
      const { like_count } = await api.likeCard(card.id, firstPet.id);
      setCards(prev =>
        prev.map(c => (c.id === card.id ? { ...c, like_count } : c))
      );
    } catch {
      // Revertir si falla
      setLiked(prev => {
        const newSet = new Set(prev);
        newSet.delete(card.id);
        return newSet;
      });
      setCards(
        cards.map(c =>
          c.id === card.id ? { ...c, like_count: (c.like_count || 0) - 1 } : c
        )
      );
    }
  };

  const handleCreate = async () => {
    if (!newCard.name || !firstPet) return;
    try {
      const created = await api.createCard({ ...newCard, pet_id: firstPet.id });
      setCards([created, ...cards]);
      setNewCard({
        name: '',
        category: 'Personalidad',
        card_type: 'simple',
        value1_name: '',
        value1_value: '',
        value2_name: '',
        value2_value: '',
      });
      setShowCreate(false);
    } catch (err) {
      toast.error(err.message || 'Error al crear tarjeta');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="page-header">
        <Tag className="page-icon" />
        <h1 className="page-title">Tarjetas</h1>
        <p className="page-subtitle">Explora y agrega tarjetas a tu mascota</p>
      </div>

      <div className="card p-4 mb-6 flex gap-3">
        <span className="text-2xl flex-shrink-0">🐾</span>
        <p className="text-sm text-gray-600 leading-relaxed">
          Las tarjetas son atributos que puedes agregar al perfil de tu mascota. La comunidad puede crear nuevas tarjetas y votar con huellas 🐾. Las más populares aparecen primero.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-9 py-2 text-sm"
            placeholder="Buscar tarjetas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn-primary text-sm py-2" onClick={() => fetchCards({ sort: 'popular' })}>
          <TrendingUpIcon /> {BUTTON_TEXT.POPULAR}
        </button>
        <button className="btn-secondary text-sm py-2" onClick={() => fetchCards({ sort: 'random' })}>
          <Shuffle size={15} /> {BUTTON_TEXT.RANDOM}
        </button>
        <button className="btn-primary text-sm py-2" onClick={() => setShowCreate(!showCreate)}>
          <Plus size={15} /> + {BUTTON_TEXT.CREATE_CARD}
        </button>
      </div>

      {showCreate && (
        <div className="card p-5 mb-5 border-2 border-wahu-200">
          <h3 className="font-bold text-gray-800 mb-3">Nueva tarjeta</h3>
          {!firstPet && <p className="text-xs text-amber-600 mb-3">Necesitas una mascota para crear tarjetas</p>}

          <div className="space-y-3">
            <div className="flex gap-3">
              <input
                className="input flex-1 text-sm"
                placeholder="Nombre de la tarjeta"
                value={newCard.name}
                onChange={e => setNewCard({ ...newCard, name: e.target.value })}
              />
              <select
                className="input w-32 text-sm"
                value={newCard.category}
                onChange={e => setNewCard({ ...newCard, category: e.target.value })}
              >
                {CATEGORIES.filter(c => c !== 'Todas').map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Selector de tipo de tarjeta */}
            <div className="flex gap-2">
              <select
                className="input flex-1 text-sm"
                value={newCard.card_type}
                onChange={e => setNewCard({ ...newCard, card_type: e.target.value })}
              >
                <option value="simple">Simple (solo nombre)</option>
                <option value="doble">Doble (nombre + 1 valor)</option>
                <option value="triple">Triple (nombre + 2 valores)</option>
              </select>
            </div>

            {/* Campos condicionales según tipo */}
            {newCard.card_type === 'doble' && (
              <div className="grid grid-cols-2 gap-2 bg-wahu-50 p-3 rounded-lg">
                <input
                  className="input text-sm"
                  placeholder="Nombre del atributo"
                  value={newCard.value1_name}
                  onChange={e => setNewCard({ ...newCard, value1_name: e.target.value })}
                />
                <input
                  className="input text-sm"
                  placeholder="Valor (ej: Alto, 85/100)"
                  value={newCard.value1_value}
                  onChange={e => setNewCard({ ...newCard, value1_value: e.target.value })}
                />
              </div>
            )}

            {newCard.card_type === 'triple' && (
              <div className="space-y-2 bg-wahu-50 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="input text-sm"
                    placeholder="Atributo 1"
                    value={newCard.value1_name}
                    onChange={e => setNewCard({ ...newCard, value1_name: e.target.value })}
                  />
                  <input
                    className="input text-sm"
                    placeholder="Valor 1"
                    value={newCard.value1_value}
                    onChange={e => setNewCard({ ...newCard, value1_value: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="input text-sm"
                    placeholder="Atributo 2"
                    value={newCard.value2_name}
                    onChange={e => setNewCard({ ...newCard, value2_name: e.target.value })}
                  />
                  <input
                    className="input text-sm"
                    placeholder="Valor 2"
                    value={newCard.value2_value}
                    onChange={e => setNewCard({ ...newCard, value2_value: e.target.value })}
                  />
                </div>
              </div>
            )}

            <button className="btn-primary w-full text-sm py-2" onClick={handleCreate} disabled={!firstPet}>
              {BUTTON_TEXT.CREATE}
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
              category === cat
                ? 'bg-wahu-500 text-white border-wahu-500'
                : 'bg-white text-gray-600 border-gray-200 hover:border-wahu-300 hover:text-wahu-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="card h-36 animate-pulse bg-wahu-50" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((card) => {
            const colors = CARD_COLORS[card.category] || CARD_COLORS.Personalidad;
            const hasVoted = voted.has(card.id);
            const hasLiked = liked.has(card.id);
            const hasAdded = added.has(card.id);

            return (
              <div key={card.id}>
                <CardDisplay
                  card={card}
                  colors={colors}
                  hasVoted={hasVoted}
                  hasLiked={hasLiked}
                  onVote={() => handlePaw(card)}
                  onLike={() => handleLike(card)}
                  disabled={!firstPet}
                  firstPet={firstPet}
                />
                <button
                  onClick={() => handleAdd(card)}
                  disabled={!firstPet || hasAdded}
                  className={`w-full text-xs py-1.5 px-3 rounded-b-lg border-t-0 border transition-all mt-0 ${
                    hasAdded
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-wahu-300 hover:text-wahu-500'
                  } disabled:opacity-50`}
                >
                  {hasAdded ? BUTTON_TEXT.CARD_ADDED : BUTTON_TEXT.ADD_CARD}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TrendingUpIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  );
}
