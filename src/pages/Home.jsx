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

            {/* Red de mascotas - Imagen profesional */}
            <div className="flex-1 hidden md:block">
              <div className="relative h-96 flex items-center justify-center rounded-2xl overflow-hidden">
                <img
                  src="/red.png"
                  alt="Red de mascotas conectadas"
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                />
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
            {/* Sección izquierda - Chat image */}
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/chat.png"
                alt="Interacción con la comunidad"
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Sección derecha - Texto y beneficios */}
            <div>
              <h3 className="text-3xl font-black text-gray-900 mb-6">
                Interactúa con la comunidad
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Publica momentos especiales de tu mascota, interactúa con otros compañeros, comenta en posts, vota en tarjetas y participa en la vida social de la comunidad Wahu.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-wahu-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Publica y comparte</h4>
                    <p className="text-gray-600 text-sm">Crea posts con fotos y historias de tu mascota</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-wahu-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Comenta e interactúa</h4>
                    <p className="text-gray-600 text-sm">Deja comentarios y vota en posts de otros</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-wahu-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Únete a clanes</h4>
                    <p className="text-gray-600 text-sm">Participa en comunidades temáticas</p>
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

      {/* ===== HIDRANTE: ENCUENTRA MASCOTAS CERCANAS ===== */}
      <div className="bg-white py-20 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Sección izquierda - Texto */}
            <div>
              <div className="inline-block px-4 py-2 bg-orange-100 text-wahu-500 rounded-full text-sm font-bold mb-4">
                🚀 Característica Especial
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-6">
                Encuentra mascotas cerca de ti
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Con el Hidrante, tu mascota aparece en el mapa para que otros compañeros puedan descubrirla y conectar. ¡Es como un encuentro virtual al aire libre!
              </p>

              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-wahu-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Ubicación en vivo</p>
                    <p className="text-sm text-gray-600">Comparte dónde estás para que te encuentren</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-wahu-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Citas instantáneas</p>
                    <p className="text-sm text-gray-600">Propón encuentros con mascotas cercanas</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-wahu-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Socialización real</p>
                    <p className="text-sm text-gray-600">Crea amistades en tu zona</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/hydrant')}
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-wahu-500 text-white font-bold rounded-lg hover:bg-wahu-600 transition-all hover:shadow-2xl"
              >
                Explorar Hidrante
                <ArrowRight size={20} />
              </button>
            </div>

            {/* Sección derecha - Imagen */}
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/hidrante.png"
                alt="Hidrante - Encuentra mascotas cerca de ti"
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== CERTAMEN ===== */}
      <div className="bg-white py-20 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Sección izquierda - Imagen */}
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/certamen_1.png"
                alt="Certamen - Competencias y desafíos"
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Sección derecha - Texto */}
            <div>
              <div className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-bold mb-4">
                🏆 Competiciones
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-6">
                Participa en certámenes
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Demuestra las habilidades y características únicas de tu mascota. Compite con otros, gana reconocimiento y obtén tarjetas exclusivas de logros.
              </p>

              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Múltiples categorías</p>
                    <p className="text-sm text-gray-600">Belleza, agilidad, talento y más</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Reconocimiento comunitario</p>
                    <p className="text-sm text-gray-600">Sé conocido como campeón en la comunidad</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Tarjetas exclusivas</p>
                    <p className="text-sm text-gray-600">Gana tarjetas de logros únicos</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/contests')}
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-all hover:shadow-2xl"
              >
                Ver Certámenes
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CITA ===== */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Sección izquierda - Texto */}
            <div>
              <div className="inline-block px-4 py-2 bg-pink-100 text-pink-600 rounded-full text-sm font-bold mb-4">
                💕 Encuentros
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-6">
                Organiza citas virtuales
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Propón encuentros con otras mascotas, agenda citas virtuales y crea momentos especiales. Una forma innovadora de que tu mascota socialice.
              </p>

              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Propuestas flexibles</p>
                    <p className="text-sm text-gray-600">Sugiere encuentros sin compromisos</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Chat integrado</p>
                    <p className="text-sm text-gray-600">Comunícate directamente con otros dueños</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Historial de encuentros</p>
                    <p className="text-sm text-gray-600">Mantén un registro de las amistades</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección derecha - Imagen */}
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/cita.png"
                alt="Citas - Organiza encuentros virtuales"
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== CLANES ===== */}
      <div className="bg-white py-20 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Sección izquierda - Imagen */}
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/clan.png"
                alt="Clanes - Comunidades temáticas"
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Sección derecha - Texto */}
            <div>
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-bold mb-4">
                👥 Comunidades
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-6">
                Únete a clanes temáticos
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Encuentra comunidades basadas en razas, intereses, ubicación o personalidad. Comparte experiencias, posts y fotos con mascotas afines.
              </p>

              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Miles de clanes</p>
                    <p className="text-sm text-gray-600">Temática para cada interés y raza</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Galería y publicaciones</p>
                    <p className="text-sm text-gray-600">Comparte contenido exclusivo del clan</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Chat grupal</p>
                    <p className="text-sm text-gray-600">Conversa en tiempo real con el clan</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/clans')}
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-all hover:shadow-2xl"
              >
                Explorar Clanes
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MANADA ===== */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Sección izquierda - Texto */}
            <div>
              <div className="inline-block px-4 py-2 bg-amber-100 text-amber-600 rounded-full text-sm font-bold mb-4">
                🐕 Tu Círculo
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-6">
                Construye tu manada y jauría
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                La manada son tus mejores amigos. La jauría son los amigos de tus amigos. Expande tu círculo social y crea una red de mascotas conectadas.
              </p>

              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Manada cercana</p>
                    <p className="text-sm text-gray-600">Tus mejores amigos en un lugar</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Jauría expandida</p>
                    <p className="text-sm text-gray-600">Descubre los amigos de tus amigos</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Red social de mascotas</p>
                    <p className="text-sm text-gray-600">Conexiones auténticas y duraderas</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/pack')}
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition-all hover:shadow-2xl"
              >
                Ver mi Manada
                <ArrowRight size={20} />
              </button>
            </div>

            {/* Sección derecha - Imagen */}
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/manada.png"
                alt="Manada - Tu círculo de amigos"
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>
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
