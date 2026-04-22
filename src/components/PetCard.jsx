import { MessageCircle, MapPin } from 'lucide-react';

const LEVEL_COLORS = {
  low: 'bg-green-100 text-green-700',
  mid: 'bg-blue-100 text-blue-700',
  high: 'bg-wahu-100 text-wahu-700',
};

const getLevelColor = (level) => {
  if (level < 10) return LEVEL_COLORS.low;
  if (level < 30) return LEVEL_COLORS.mid;
  return LEVEL_COLORS.high;
};

const TAG_COLORS = [
  'bg-orange-100 text-orange-700',
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-green-100 text-green-700',
  'bg-pink-100 text-pink-700',
];

export default function PetCard({ pet, onClick }) {
  const tags = Array.isArray(pet.tags) ? pet.tags.filter(Boolean).slice(0, 3) : [];
  const friendCount = pet.friend_count ?? pet.friends ?? 0;

  return (
    <div
      className="card cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gray-100">
        <img
          src={pet.avatar_url || `https://placedog.net/400/300?id=${pet.id}`}
          alt={pet.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://placedog.net/400/300'; }}
        />
        <span className={`absolute top-2 right-2 badge text-xs font-bold ${getLevelColor(pet.level)}`}>
          Nivel {pet.level}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-gray-800 text-base leading-tight">{pet.name}</h3>
            <p className="text-wahu-500 text-xs font-medium">@{pet.username}</p>
          </div>
          {pet.companion_avatar && (
            <img
              src={pet.companion_avatar}
              alt="dueño"
              className="w-8 h-8 rounded-full border-2 border-wahu-200 object-cover"
            />
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map((tag, i) => (
              <span key={tag} className={`badge text-xs ${TAG_COLORS[i % TAG_COLORS.length]}`}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 mt-2 pt-2 border-t border-gray-50">
          <div className="flex items-center gap-1">
            <MessageCircle size={13} className="text-wahu-400" />
            <span>{friendCount}</span>
          </div>
          {pet.location && (
            <div className="flex items-center gap-1">
              <MapPin size={13} className="text-wahu-400" />
              <span>{pet.location}</span>
            </div>
          )}
        </div>

        {/* Popularidad */}
        {pet.popularity != null && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Popularidad</span>
              <span>{pet.popularity}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${pet.popularity}%` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
