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
              <div className="relative h-96 flex items-center justify-center">
                {/* SVG Background con gradientes */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 400" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#f97316', stopOpacity: 0.1 }} />
                      <stop offset="100%" style={{ stopColor: '#fb923c', stopOpacity: 0.05 }} />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Fondo decorativo */}
                  <circle cx="250" cy="200" r="180" fill="url(#grad1)" />

                  {/* Líneas de conexión - más refinadas */}
                  {/* Hub central a nodos */}
                  <line x1="250" y1="200" x2="150" y2="80" stroke="#f97316" strokeWidth="2" strokeOpacity="0.3" />
                  <line x1="250" y1="200" x2="350" y2="70" stroke="#f97316" strokeWidth="2" strokeOpacity="0.3" />
                  <line x1="250" y1="200" x2="420" y2="150" stroke="#f97316" strokeWidth="2" strokeOpacity="0.3" />
                  <line x1="250" y1="200" x2="400" y2="320" stroke="#f97316" strokeWidth="2" strokeOpacity="0.3" />
                  <line x1="250" y1="200" x2="200" y2="350" stroke="#f97316" strokeWidth="2" strokeOpacity="0.3" />
                  <line x1="250" y1="200" x2="80" y2="280" stroke="#f97316" strokeWidth="2" strokeOpacity="0.3" />
                  <line x1="250" y1="200" x2="100" y2="120" stroke="#f97316" strokeWidth="2" strokeOpacity="0.3" />

                  {/* Conexiones entre nodos - red completa */}
                  <line x1="150" y1="80" x2="350" y2="70" stroke="#f97316" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="5,5" />
                  <line x1="350" y1="70" x2="420" y2="150" stroke="#f97316" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="5,5" />
                  <line x1="420" y1="150" x2="400" y2="320" stroke="#f97316" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="5,5" />
                  <line x1="400" y1="320" x2="200" y2="350" stroke="#f97316" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="5,5" />
                  <line x1="200" y1="350" x2="80" y2="280" stroke="#f97316" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="5,5" />
                  <line x1="80" y1="280" x2="100" y2="120" stroke="#f97316" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="5,5" />
                  <line x1="100" y1="120" x2="150" y2="80" stroke="#f97316" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="5,5" />

                  {/* Nodos con sombra */}
                  {/* Centro */}
                  <g filter="url(#glow)">
                    <circle cx="250" cy="200" r="28" fill="#f97316" opacity="0.95" />
                    <circle cx="250" cy="200" r="28" fill="none" stroke="#f97316" strokeWidth="2" opacity="0.3" />
                    <text x="250" y="208" fontSize="24" fill="white" textAnchor="middle" fontWeight="bold">🐾</text>
                  </g>

                  {/* Nodo 1 - Arriba izquierda */}
                  <g className="pet-node">
                    <circle cx="150" cy="80" r="22" fill="#fecaca" opacity="0.9" />
                    <circle cx="150" cy="80" r="22" fill="none" stroke="#f87171" strokeWidth="2" />
                    <text x="150" y="88" fontSize="20" textAnchor="middle">🐕</text>
                  </g>

                  {/* Nodo 2 - Arriba derecha */}
                  <g className="pet-node">
                    <circle cx="350" cy="70" r="22" fill="#bfdbfe" opacity="0.9" />
                    <circle cx="350" cy="70" r="22" fill="none" stroke="#60a5fa" strokeWidth="2" />
                    <text x="350" y="78" fontSize="20" textAnchor="middle">🐈</text>
                  </g>

                  {/* Nodo 3 - Derecha */}
                  <g className="pet-node">
                    <circle cx="420" cy="150" r="22" fill="#fef08a" opacity="0.9" />
                    <circle cx="420" cy="150" r="22" fill="none" stroke="#fbbf24" strokeWidth="2" />
                    <text x="420" y="158" fontSize="20" textAnchor="middle">🦁</text>
                  </g>

                  {/* Nodo 4 - Abajo derecha */}
                  <g className="pet-node">
                    <circle cx="400" cy="320" r="22" fill="#fbcfe8" opacity="0.9" />
                    <circle cx="400" cy="320" r="22" fill="none" stroke="#f472b6" strokeWidth="2" />
                    <text x="400" y="328" fontSize="20" textAnchor="middle">🐇</text>
                  </g>

                  {/* Nodo 5 - Abajo izquierda */}
                  <g className="pet-node">
                    <circle cx="200" cy="350" r="22" fill="#d8b4fe" opacity="0.9" />
                    <circle cx="200" cy="350" r="22" fill="none" stroke="#c084fc" strokeWidth="2" />
                    <text x="200" y="358" fontSize="20" textAnchor="middle">🦎</text>
                  </g>

                  {/* Nodo 6 - Izquierda */}
                  <g className="pet-node">
                    <circle cx="80" cy="280" r="22" fill="#bbf7d0" opacity="0.9" />
                    <circle cx="80" cy="280" r="22" fill="none" stroke="#34d399" strokeWidth="2" />
                    <text x="80" y="288" fontSize="20" textAnchor="middle">🦜</text>
                  </g>

                  {/* Nodo 7 - Arriba izquierda secundario */}
                  <g className="pet-node">
                    <circle cx="100" cy="120" r="22" fill="#fed7aa" opacity="0.9" />
                    <circle cx="100" cy="120" r="22" fill="none" stroke="#fb923c" strokeWidth="2" />
                    <text x="100" y="128" fontSize="20" textAnchor="middle">🐕</text>
                  </g>

                  {/* Etiqueta */}
                  <text x="250" y="385" fontSize="13" fill="#666" textAnchor="middle" fontWeight="500">Una red social de mascotas conectadas</text>
                </svg>
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

      {/* ===== CÓMO FUNCIONA: MASCOTAS EN ACCIÓN ===== */}
      <div className="bg-white border-t border-gray-200 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Las mascotas en el centro
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tu mascota es la estrella. Aquí es donde ella vive su vida social extraordinaria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Sección izquierda - Videollamada */}
            <div className="relative h-96 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 400 350" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="phoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#1f2937', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#111827', stopOpacity: 1 }} />
                  </linearGradient>
                  <filter id="shadow">
                    <feDropShadow dx="0" dy="10" stdDeviation="15" floodOpacity="0.3" />
                  </filter>
                </defs>

                {/* Smartphone frame */}
                <g filter="url(#shadow)">
                  {/* Cuerpo del teléfono */}
                  <rect x="80" y="20" width="240" height="310" rx="20" fill="url(#phoneGrad)" stroke="#000" strokeWidth="1" />

                  {/* Pantalla */}
                  <rect x="90" y="35" width="220" height="280" rx="16" fill="#0f172a" />

                  {/* Notch */}
                  <rect x="160" y="35" width="80" height="25" rx="12" fill="#1f2937" />

                  {/* Pantalla de videollamada - Perro hablando */}
                  <circle cx="200" cy="130" r="50" fill="#f97316" opacity="0.2" />
                  <text x="200" y="145" fontSize="52" textAnchor="middle">🐕</text>

                  {/* Controles de videollamada */}
                  <g opacity="0.7">
                    <circle cx="140" cy="250" r="16" fill="#ef4444" />
                    <text x="140" y="257" fontSize="18" textAnchor="middle" fill="white">☎</text>

                    <circle cx="200" cy="250" r="16" fill="#10b981" />
                    <text x="200" y="257" fontSize="18" textAnchor="middle" fill="white">🎥</text>

                    <circle cx="260" cy="250" r="16" fill="#3b82f6" />
                    <text x="260" y="257" fontSize="18" textAnchor="middle" fill="white">🔊</text>
                  </g>

                  {/* Home indicator */}
                  <rect x="170" y="305" width="60" height="4" rx="2" fill="#374151" />
                </g>

                {/* Etiqueta */}
                <text x="200" y="335" fontSize="14" fill="#666" textAnchor="middle" fontWeight="600">Videollamadas en vivo</text>
              </svg>
            </div>

            {/* Sección derecha - Texto y beneficios */}
            <div>
              <h3 className="text-3xl font-black text-gray-900 mb-6">
                Conecta cara a cara
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Las mascotas pueden hacer videollamadas en vivo con amigos, participar en reuniones de clan y compartir momentos especiales con otros en la comunidad.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-wahu-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Chat en tiempo real</h4>
                    <p className="text-gray-600 text-sm">Mensajes instantáneos con tus amigos</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-wahu-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Videollamadas de grupo</h4>
                    <p className="text-gray-600 text-sm">Reuniones con tu clan y comunidad</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-wahu-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Compartir momentos</h4>
                    <p className="text-gray-600 text-sm">Publica fotos, videos y historias</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
