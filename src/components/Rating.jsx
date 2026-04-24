import { Star } from 'lucide-react';
import { useState } from 'react';

/**
 * Componente Rating para calificaciones
 * Soporta: interactivo, solo lectura, diferentes tamaños
 */
export default function Rating({
  value = 0,
  onChange,
  size = 'md',
  count = 5,
  readOnly = false,
  showLabel = true,
  color = 'wahu',
  allowHalf = false,
  className = '',
}) {
  const [hoverValue, setHoverValue] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  const colorClasses = {
    wahu: 'text-wahu-400',
    yellow: 'text-yellow-400',
    amber: 'text-amber-400',
    orange: 'text-orange-400',
  };

  const displayValue = hoverValue || value;

  const handleClick = (index, half = false) => {
    if (readOnly) return;
    const newValue = allowHalf && half ? index + 0.5 : index + 1;
    onChange?.(newValue);
  };

  const handleMouseMove = (index, e) => {
    if (readOnly) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    if (allowHalf) {
      setHoverValue(isHalf ? index + 0.5 : index + 1);
    } else {
      setHoverValue(index + 1);
    }
  };

  const handleMouseLeave = () => {
    setHoverValue(0);
  };

  const getStarFill = (index) => {
    const fullStars = Math.floor(displayValue);
    const hasHalf = displayValue % 1 !== 0;

    if (index < fullStars) return 'full';
    if (index === fullStars && hasHalf) return 'half';
    return 'empty';
  };

  const labels = ['Terrible', 'Mal', 'Normal', 'Bueno', 'Excelente'];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Estrellas */}
      <div className="flex gap-1">
        {Array.from({ length: count }).map((_, idx) => {
          const fill = getStarFill(idx);
          return (
            <div
              key={idx}
              className={`relative ${readOnly ? '' : 'cursor-pointer'}`}
              onClick={() => handleClick(idx)}
              onMouseMove={(e) => handleMouseMove(idx, e)}
              onMouseLeave={handleMouseLeave}
              title={`Calificar ${idx + 1} de ${count}`}
            >
              {/* Estrella vacía */}
              <Star
                size={sizeClasses[size] === 'w-4 h-4' ? 16 : 20}
                className={`${sizeClasses[size]} text-gray-300 stroke-2 fill-none`}
              />

              {/* Estrella llena (overlay) */}
              {fill === 'full' && (
                <div className="absolute inset-0 overflow-hidden w-full">
                  <Star
                    size={sizeClasses[size] === 'w-4 h-4' ? 16 : 20}
                    className={`${sizeClasses[size]} ${colorClasses[color]} fill-current stroke-0`}
                  />
                </div>
              )}

              {/* Estrella media (overlay) */}
              {fill === 'half' && (
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star
                    size={sizeClasses[size] === 'w-4 h-4' ? 16 : 20}
                    className={`${sizeClasses[size]} ${colorClasses[color]} fill-current stroke-0`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Valor y etiqueta */}
      {showLabel && (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">{displayValue.toFixed(1)}</span>
          {labels[Math.floor(displayValue) - 1] && (
            <span className="text-sm text-gray-500">
              {labels[Math.floor(displayValue) - 1]}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Rating Display para mostrar reseñas con rating
 */
export function RatingDisplay({
  rating = 0,
  count = 0,
  variant = 'compact',
}) {
  const percentages = [5, 4, 3, 2, 1].map((stars) => {
    return count > 0
      ? Math.round((count / 5) * 100)
      : 0;
  });

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              size={16}
              className={`${
                idx < Math.floor(rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
        <span className="text-xs text-gray-500">({count} reseñas)</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Rating promedio */}
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className="text-3xl font-bold text-gray-900">{rating.toFixed(1)}</div>
          <div className="flex gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                size={14}
                className={`${
                  idx < Math.round(rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-1">{count} reseñas</div>
        </div>

        {/* Distribución */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-2">
              <span className="text-xs text-gray-600 w-6">{stars}★</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400"
                  style={{ width: `${percentages[5 - stars]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
