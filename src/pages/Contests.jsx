import { Trophy, Palette, Star, Sparkles } from 'lucide-react';

const CONTEST_TYPES = [
  { type: 'Disfraces', icon: Palette, color: 'bg-purple-100 text-purple-600', desc: 'Demuestra la creatividad de tu mascota con increíbles disfraces temáticos', bg: 'bg-purple-50' },
  { type: 'Habilidades', icon: Star, color: 'bg-yellow-100 text-yellow-600', desc: 'Muestra las increíbles habilidades y trucos que tu mascota ha aprendido', bg: 'bg-yellow-50' },
  { type: 'Belleza', icon: Sparkles, color: 'bg-pink-100 text-pink-600', desc: 'Celebra la belleza natural y el carisma único de tu mascota', bg: 'bg-pink-50' },
];

export default function Contests() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="page-header">
        <Trophy className="page-icon" />
        <h1 className="page-title">Certamen</h1>
        <p className="page-subtitle">Eventos y concursos especiales para que tu mascota brille</p>
      </div>

      {/* Estado actual */}
      <div className="card p-8 text-center mb-8">
        <div className="w-16 h-16 bg-wahu-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy size={28} className="text-wahu-500" />
        </div>
        <span className="badge bg-wahu-100 text-wahu-600 font-semibold mb-3">¡Próximamente!</span>
        <h2 className="text-xl font-bold text-gray-800 mt-2 mb-2">No hay concursos activos</h2>
        <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
          Los certámenes son eventos especiales donde tu mascota puede competir y ganar premios. ¡Prepárate porque pronto comenzará algo increíble!
        </p>
        <div className="mt-5 p-3 bg-wahu-50 rounded-xl inline-block">
          <p className="text-xs text-gray-500">Próximo evento</p>
          <p className="text-wahu-500 font-bold">Por anunciar</p>
        </div>
      </div>

      {/* Tipos de certámenes */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">¿Qué puedes esperar?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CONTEST_TYPES.map(({ type, icon: Icon, color, desc, bg }) => (
            <div key={type} className={`card p-5 ${bg}`}>
              <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-3`}>
                <Icon size={22} />
              </div>
              <h3 className="font-bold text-gray-800 mb-1">Concursos de {type}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cómo funciona */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">¿Cómo funciona?</h2>
        <div className="flex flex-col gap-4">
          {[
            { step: '1', title: 'Inscribe a tu mascota', desc: 'Cuando haya un certamen activo, podrás inscribir a tu mascota con una foto o video.' },
            { step: '2', title: 'La comunidad vota', desc: 'Otros usuarios de Wahu podrán ver las participaciones y votar con sus huellas.' },
            { step: '3', title: 'Gana premios', desc: 'Las mascotas con más votos ganarán croquetas, nivel extra y reconocimiento.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-4">
              <div className="w-8 h-8 bg-wahu-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                {step}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
