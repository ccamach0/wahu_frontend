import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import api from '../services/api.js';
import PetCard from '../components/PetCard.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import WahuLogo from '../components/WahuLogo.jsx';

// Datos demo para cuando el backend no esté disponible
const DEMO_PETS = [
  { id: '1', name: 'Max', username: 'max_golden', breed: 'Golden Retriever', location: 'Lima, Perú', avatar_url: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400', level: 12, popularity: 85, tags: ['Juguetón', 'Amigable', 'Energético'], friend_count: 3, companion_avatar: 'https://i.pravatar.cc/40?img=1' },
  { id: '2', name: 'Luna', username: 'luna_husky', breed: 'Husky Siberiano', location: 'Miraflores', avatar_url: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400', level: 8, popularity: 92, tags: ['Hiperactivo', 'Disponible_para_jugar'], friend_count: 2, companion_avatar: 'https://i.pravatar.cc/40?img=2' },
  { id: '3', name: 'Rocky', username: 'rocky_lab', breed: 'Labrador', location: 'Barranco', avatar_url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400', level: 42, popularity: 76, tags: ['Amigable', 'Entrenado'], friend_count: 4, companion_avatar: 'https://i.pravatar.cc/40?img=3' },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({ pets: '...', clans: '...', companions: '...' });

  useEffect(() => {
    api.getPopularPets()
      .then(setPets)
      .catch(() => setPets(DEMO_PETS))
      .finally(() => setLoading(false));
    api.getStats()
      .then(s => setStats({ pets: s.pets.toLocaleString(), clans: s.clans.toLocaleString(), companions: s.companions.toLocaleString() }))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <WahuLogo size={42} />
        </div>
        <h1 className="text-4xl font-bold text-wahu-500 mb-3">
          Bienvenido{user?.name ? `, ${user.name.split(' ')[0]}` : ''} a Wahu
        </h1>
        <p className="text-gray-500 text-lg max-w-lg mx-auto leading-relaxed">
          La red social para mascotas donde tu mejor amigo puede socializar, hacer amigos y mostrar su mejor lado
        </p>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Mascotas registradas', value: stats.pets, color: 'from-orange-400 to-wahu-500' },
          { label: 'Clanes activos', value: stats.clans, color: 'from-blue-400 to-blue-500' },
          { label: 'Compañeros', value: stats.companions, color: 'from-purple-400 to-purple-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`card p-5 bg-gradient-to-br ${color} text-white`}>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-sm opacity-80 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Mascotas populares */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp size={20} className="text-wahu-500" />
            Mascotas Populares
          </h2>
          <button
            onClick={() => navigate('/pets')}
            className="text-sm text-wahu-500 font-medium hover:underline"
          >
            Ver todas →
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-44 bg-wahu-100" />
                <div className="p-4 flex flex-col gap-3">
                  <div className="h-4 bg-wahu-100 rounded w-1/2" />
                  <div className="h-3 bg-wahu-100 rounded w-1/3" />
                  <div className="h-2 bg-wahu-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onClick={() => navigate(`/pets/${pet.username}`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
