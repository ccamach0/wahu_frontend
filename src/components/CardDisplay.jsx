import { Heart, MessageCircle } from 'lucide-react';

/**
 * CardDisplay Component
 * Muestra tarjetas con soporte para 3 tipos:
 * - simple: Solo nombre
 * - doble: Nombre + 1 valor
 * - triple: Nombre + 2 valores
 */
export default function CardDisplay({
  card,
  colors = {},
  hasVoted = false,
  hasLiked = false,
  onVote,
  onLike,
  disabled = false,
  firstPet = null,
}) {
  const cardColors = colors || {};

  const renderCardContent = () => {
    const baseContent = (
      <div className="mb-3">
        <span className={`badge text-xs ${cardColors.badge || 'bg-gray-100 text-gray-600'}`}>
          {card.category}
        </span>
        <h3 className={`font-bold text-base mb-1 mt-1 ${cardColors.text || 'text-gray-800'}`}>
          {card.name}
        </h3>
      </div>
    );

    // Tarjeta simple: solo nombre
    if (card.card_type === 'simple') {
      return baseContent;
    }

    // Tarjeta doble: nombre + 1 valor
    if (card.card_type === 'doble') {
      return (
        <>
          {baseContent}
          <div className="bg-white/50 rounded-lg p-2 mb-2">
            <p className="text-xs text-gray-500 font-medium">{card.value1_name || 'Atributo'}</p>
            <p className="text-sm font-semibold text-gray-800">{card.value1_value || '—'}</p>
          </div>
        </>
      );
    }

    // Tarjeta triple: nombre + 2 valores
    if (card.card_type === 'triple') {
      return (
        <>
          {baseContent}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-white/50 rounded-lg p-2">
              <p className="text-xs text-gray-500 font-medium">{card.value1_name || 'Atributo 1'}</p>
              <p className="text-sm font-semibold text-gray-800">{card.value1_value || '—'}</p>
            </div>
            <div className="bg-white/50 rounded-lg p-2">
              <p className="text-xs text-gray-500 font-medium">{card.value2_name || 'Atributo 2'}</p>
              <p className="text-sm font-semibold text-gray-800">{card.value2_value || '—'}</p>
            </div>
          </div>
        </>
      );
    }

    return baseContent;
  };

  const totalScore = (card.paw_count || 0) + (card.like_count || 0);

  return (
    <div className={`card p-5 ${cardColors.bg || 'bg-white'} border ${cardColors.border || 'border-gray-200'}`}>
      {renderCardContent()}

      <p className="text-xs text-gray-400 mb-4">
        Creado por @{card.creator_username || 'wahu'}
      </p>

      <div className="flex items-center justify-between gap-2">
        {/* Botón de voto con huella */}
        <button
          onClick={() => onVote?.()}
          disabled={!firstPet || disabled}
          className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-all ${
            hasVoted
              ? 'bg-wahu-500 text-white'
              : 'bg-white text-gray-600 hover:bg-wahu-50 hover:text-wahu-500'
          } disabled:opacity-50`}
          title="Votar con huella"
        >
          🐾 {card.paw_count || 0}
        </button>

        {/* Botón de like */}
        <button
          onClick={() => onLike?.()}
          disabled={!firstPet || disabled}
          className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-all ${
            hasLiked
              ? 'bg-red-100 text-red-600'
              : 'bg-white text-gray-400 hover:bg-red-50 hover:text-red-500'
          } disabled:opacity-50`}
          title="Me gusta"
        >
          <Heart size={14} fill={hasLiked ? 'currentColor' : 'none'} />
          {card.like_count || 0}
        </button>

        {/* Mostrar puntuación total */}
        <div className="flex-1 text-right">
          <p className="text-xs text-gray-400">Popularidad</p>
          <p className="text-sm font-bold text-wahu-500">{totalScore}</p>
        </div>
      </div>
    </div>
  );
}
