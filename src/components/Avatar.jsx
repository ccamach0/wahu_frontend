/**
 * Componente Avatar para mostrar avatares de usuarios
 * Soporta: imágenes, iniciales, fallbacks, tamaños
 */
export default function Avatar({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  variant = 'circle',
  status,
  statusColor = 'online',
  className = '',
  fallbackColor = 'wahu',
  onClick,
}) {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  };

  const variantClasses = {
    circle: 'rounded-full',
    rounded: 'rounded-lg',
    square: 'rounded-none',
  };

  const fallbackColors = {
    wahu: 'bg-wahu-100 text-wahu-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
    pink: 'bg-pink-100 text-pink-700',
    red: 'bg-red-100 text-red-700',
  };

  const statusClasses = {
    online: 'bg-green-500 border-white',
    offline: 'bg-gray-400 border-white',
    away: 'bg-amber-500 border-white',
    dnd: 'bg-red-500 border-white',
  };

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const statusSizeClasses = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5',
  };

  return (
    <div
      className={`relative inline-block ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Avatar */}
      <div
        className={`
          flex items-center justify-center font-semibold overflow-hidden
          border-2 border-gray-100
          ${sizeClasses[size] || sizeClasses.md}
          ${variantClasses[variant] || variantClasses.circle}
          ${src ? 'bg-gray-200' : fallbackColors[fallbackColor] || fallbackColors.wahu}
          ${className}
        `}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = initials;
            }}
          />
        ) : (
          initials
        )}
      </div>

      {/* Status indicator */}
      {status && (
        <div
          className={`
            absolute bottom-0 right-0 rounded-full border-2
            ${statusClasses[status] || statusClasses.online}
            ${statusSizeClasses[size] || statusSizeClasses.md}
          `}
        />
      )}
    </div>
  );
}

/**
 * Avatar Group para mostrar múltiples avatares
 */
export function AvatarGroup({
  avatars = [],
  max = 3,
  size = 'md',
  className = '',
}) {
  const visible = avatars.slice(0, max);
  const hidden = avatars.length - max;

  const sizeOffset = {
    xs: '-ml-1',
    sm: '-ml-1.5',
    md: '-ml-2.5',
    lg: '-ml-3.5',
    xl: '-ml-4',
    '2xl': '-ml-5',
  };

  return (
    <div className={`flex items-center ${className}`}>
      {visible.map((avatar, idx) => (
        <div key={idx} className={`${idx > 0 ? sizeOffset[size] : ''}`}>
          <Avatar {...avatar} size={size} />
        </div>
      ))}

      {hidden > 0 && (
        <div
          className={`
            flex items-center justify-center font-semibold text-white
            bg-gray-400 rounded-full border-2 border-gray-100
            ml-1
            ${{
              xs: 'w-6 h-6 text-xs',
              sm: 'w-8 h-8 text-sm',
              md: 'w-10 h-10 text-base',
              lg: 'w-12 h-12 text-lg',
              xl: 'w-16 h-16 text-xl',
              '2xl': 'w-20 h-20 text-2xl',
            }[size]}
          `}
        >
          +{hidden}
        </div>
      )}
    </div>
  );
}
