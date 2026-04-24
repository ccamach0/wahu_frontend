import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, Flag, Heart, Zap, Sparkles, ArrowRight, PawPrint } from 'lucide-react';
import api from '../services/api.js';
import PetCard from '../components/PetCard.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import WahuLogo from '../components/WahuLogo.jsx';

const DEMO_PETS = [
  { id: '1', name: 'Max', username: 'max_golden', breed: 'Golden Retriever', location: 'Lima, Perú', avatar_url: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400', level: 12, popularity: 85, tags: ['Juguetón', 'Amigable', 'Energético'], friend_count: 3, companion_avatar: 'https://i.pravatar.cc/40?img=1' },
  { id: '2', name: 'Luna', username: 'luna_husky', breed: 'Husky Siberiano', location: 'Miraflores', avatar_url: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400', level: 8, popularity: 92, tags: ['Hiperactivo', 'Disponible_para_jugar'], friend_count: 2, companion_avatar: 'https://i.pravatar.cc/40?img=2' },
  { id: '3', name: 'Rocky', username: 'rocky_lab', breed: 'Labrador', location: 'Barranco', avatar_url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400', level: 42, popularity: 76, tags: ['Amigable', 'Entrenado'], friend_count: 4, companion_avatar: 'https://i.pravatar.cc/40?img=3' },
];

const FEATURES = [
  {
    icon: PawPrint,
    title: 'Perfiles de Mascotas',
    description: 'Crea el perfil perfecto para tu mascota con fotos, atributos y personalidad',
  },
  {
    icon: Users,
    title: 'Haz Amigos',
    description: 'Conecta con otras mascotas, crea amistades y expande tu manada',
  },
  {
    icon: Flag,
    title: 'Únete a Clanes',
    description: 'Comunidades temáticas donde mascotas con intereses similares se reúnen',
  },
  {
    icon: Sparkles,
    title: 'Tarjetas de Atributos',
    description: 'Colecciona tarjetas únicas y muestra los rasgos especiales de tu mascota',
  },
  {
    icon: Heart,
    title: 'Interactúa',
    description: 'Comenta, vota y participa en la vida social de tu mascota',
  },
  {
    icon: Zap,
    title: 'Encuentra Encuentros',
    description: 'Descubre y organiza encuentros virtuales con mascotas cercanas',
  },
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
      .then(s => setStats({
        pets: s.pets.toLocaleString(),
        clans: s.clans.toLocaleString(),
        companions: s.companions.toLocaleString()
      }))
      .catch(() => {});
  }, []);

  return (
    <div className="w-full">
      {/* ===== HERO SECTION ===== */}
      <div className="relative bg-white overflow-hidden border-b border-gray-200">
        {/* Elemento decorativo naranja arriba */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-wahu-500/10 to-orange-400/5 rounded-full blur-3xl -mr-20 -mt-20"></div>

        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-32">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Contenido del Hero */}
            <div className="flex-1 z-10">
              <div className="mb-8">
                <WahuLogo size={64} />
              </div>

              <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight text-gray-900">
                Tu mascota merece una vida social <span className="text-wahu-500">extraordinaria</span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-xl leading-relaxed">
                Wahu es la plataforma donde las mascotas crean perfiles, hacen amigos, se unen a comunidades y muestran quiénes son realmente.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                {!user ? (
                  <>
                    <button
                      onClick={() => navigate('/register')}
                      className="px-8 py-4 bg-wahu-500 text-white font-bold rounded-lg hover:bg-wahu-600 transition-all hover:shadow-2xl flex items-center justify-center gap-2 group"
                    >
                      Comenzar Ahora
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
                    </button>
                    <button
                      onClick={() => navigate('/login')}
                      className="px-8 py-4 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-all border-2 border-gray-200"
                    >
                      Iniciar Sesión
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigate('/pets')}
                    className="px-8 py-4 bg-wahu-500 text-white font-bold rounded-lg hover:bg-wahu-600 transition-all hover:shadow-2xl flex items-center justify-center gap-2 group"
                  >
                    Explorar Mascotas
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
                  </button>
                )}
              </div>
            </div>

            {/* Ilustración de red social moderna */}
            <div className="flex-1 hidden md:block">
              <div className="relative h-96 flex items-center justify-center overflow-hidden">
                {/* Fondo decorativo */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5">
                  <div className="absolute w-96 h-96 bg-wahu-500 rounded-full blur-3xl"></div>
                </div>

                {/* Red de conexión */}
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                  {/* Líneas de conexión entre nodos */}
                  {/* Centro a todos */}
                  <line x1="50%" y1="50%" x2="25%" y2="20%" stroke="#f97316" strokeWidth="2" strokeOpacity="0.25" />
                  <line x1="50%" y1="50%" x2="75%" y2="18%" stroke="#f97316" strokeWidth="2" strokeOpacity="0.25" />
                  <line x1="50%" y1="50%" x2="80%" y2="50%" stroke="#f97316" strokeWidth="2" strokeOpacity="0.25" />
                  <line x1="50%" y1="50%" x2="70%" y2="80%" stroke="#f97316" strokeWidth="2" strokeOpacity="0.25" />
                  <line x1="50%" y1="50%" x2="30%" y2="82%" stroke="#f97316" strokeWidth="2" strokeOpacity="0.25" />
                  <line x1="50%" y1="50%" x2="15%" y2="75%" stroke="#f97316" strokeWidth="2" strokeOpacity="0.25" />
                  <line x1="50%" y1="50%" x2="18%" y2="45%" stroke="#f97316" strokeWidth="2" strokeOpacity="0.25" />

                  {/* Conexiones entre nodos */}
                  <line x1="25%" y1="20%" x2="75%" y2="18%" stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.15" />
                  <line x1="75%" y1="18%" x2="80%" y2="50%" stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.15" />
                  <line x1="80%" y1="50%" x2="70%" y2="80%" stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.15" />
                  <line x1="70%" y1="80%" x2="30%" y2="82%" stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.15" />
                  <line x1="30%" y1="82%" x2="15%" y2="75%" stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.15" />
                  <line x1="15%" y1="75%" x2="18%" y2="45%" stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.15" />
                  <line x1="18%" y1="45%" x2="25%" y2="20%" stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.15" />
                </svg>

                {/* Nodos de red (mascotas) */}
                <div className="absolute inset-0 w-full h-full" style={{ zIndex: 2 }}>
                  {/* Centro */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-wahu-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
                    🐾
                  </div>

                  {/* Nodos periféricos */}
                  {/* Arriba izquierda */}
                  <div className="absolute top-[15%] left-[25%] w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center text-2xl shadow-md hover:shadow-lg transition transform hover:scale-110 cursor-pointer border-2 border-orange-200">
                    🐕
                  </div>

                  {/* Arriba derecha */}
                  <div className="absolute top-[12%] right-[22%] w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center text-2xl shadow-md hover:shadow-lg transition transform hover:scale-110 cursor-pointer border-2 border-blue-200">
                    🐈
                  </div>

                  {/* Derecha */}
                  <div className="absolute top-1/2 right-[8%] transform -translate-y-1/2 w-14 h-14 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-full flex items-center justify-center text-2xl shadow-md hover:shadow-lg transition transform hover:scale-110 cursor-pointer border-2 border-yellow-200">
                    🐕‍🦺
                  </div>

                  {/* Abajo derecha */}
                  <div className="absolute bottom-[15%] right-[20%] w-14 h-14 bg-gradient-to-br from-pink-100 to-pink-50 rounded-full flex items-center justify-center text-2xl shadow-md hover:shadow-lg transition transform hover:scale-110 cursor-pointer border-2 border-pink-200">
                    🐇
                  </div>

                  {/* Abajo izquierda */}
                  <div className="absolute bottom-[12%] left-[25%] w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full flex items-center justify-center text-2xl shadow-md hover:shadow-lg transition transform hover:scale-110 cursor-pointer border-2 border-purple-200">
                    🦎
                  </div>

                  {/* Izquierda */}
                  <div className="absolute top-1/2 left-[8%] transform -translate-y-1/2 w-14 h-14 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center text-2xl shadow-md hover:shadow-lg transition transform hover:scale-110 cursor-pointer border-2 border-green-200">
                    🦜
                  </div>

                  {/* Nodo secundario superior */}
                  <div className="absolute top-[25%] left-[38%] w-12 h-12 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center text-xl shadow-md hover:shadow-lg transition transform hover:scale-110 cursor-pointer border-2 border-red-200">
                    🐶
                  </div>
                </div>

                {/* Texto de conexión */}
                <div className="absolute bottom-4 left-0 right-0 text-center z-20">
                  <p className="text-gray-600 text-sm font-medium">Una red social de mascotas conectadas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== ESTADÍSTICAS ===== */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Mascotas Registradas', value: stats.pets, icon: PawPrint },
              { label: 'Clanes Activos', value: stats.clans, icon: Flag },
              { label: 'Compañeros', value: stats.companions, icon: Users },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center p-8">
                <div className="inline-block p-4 bg-gradient-to-br from-wahu-500 to-orange-400 rounded-2xl mb-4">
                  <Icon size={32} className="text-white" />
                </div>
                <p className="text-4xl font-black text-gray-900 mb-2">{value}</p>
                <p className="text-gray-600 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== CARACTERÍSTICAS ===== */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            ¿Qué puedes hacer en Wahu?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubre todas las formas en que tu mascota puede socializar, conectar y crecer en nuestra comunidad
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="inline-block p-4 bg-wahu-500 rounded-xl mb-6 group-hover:scale-110 transition">
                <Icon size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== MASCOTAS POPULARES ===== */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black text-gray-900 flex items-center gap-3 mb-2">
                <TrendingUp size={32} className="text-wahu-500" />
                Mascotas Destacadas
              </h2>
              <p className="text-gray-600">Conoce a las mascotas más populares de la comunidad</p>
            </div>
            <button
              onClick={() => navigate('/pets')}
              className="hidden md:flex items-center gap-2 px-6 py-3 text-wahu-500 font-bold hover:bg-wahu-50 rounded-lg transition"
            >
              Ver todas
              <ArrowRight size={20} />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-44 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  onClick={() => navigate(`/pets/${pet.username}`)}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12 md:hidden">
            <button
              onClick={() => navigate('/pets')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-wahu-500 text-white font-bold rounded-lg hover:bg-wahu-600 transition"
            >
              Ver todas las mascotas
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ===== CTA FINAL ===== */}
      <div className="bg-gradient-to-br from-wahu-50 to-orange-50 border-t border-wahu-100 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Sparkles size={48} className="mx-auto mb-6 text-wahu-500" />
          <h2 className="text-4xl font-black mb-4 text-gray-900">¿Listo para que tu mascota brille?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Únete a miles de mascotas y sus dueños que ya están creando conexiones increíbles en Wahu.
          </p>
          {!user ? (
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-wahu-500 text-white font-bold rounded-lg hover:bg-wahu-600 transition-all hover:shadow-2xl"
            >
              Crear Cuenta Gratis
              <ArrowRight size={20} />
            </button>
          ) : (
            <button
              onClick={() => navigate('/clans')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-wahu-500 text-white font-bold rounded-lg hover:bg-wahu-600 transition-all hover:shadow-2xl"
            >
              Explorar Comunidades
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
