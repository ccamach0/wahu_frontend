/**
 * Componente Badge para mostrar etiquetas, estados y categorías
 * Soporta: múltiples variantes, tamaños, iconos
 */
export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon: Icon,
  removable = false,
  onRemove,
  className = '',
}) {
  const variants = {
    default: 'bg-gray-100 text-gray-700 border border-gray-200',
    primary: 'bg-wahu-100 text-wahu-700 border border-wahu-200',
    success: 'bg-green-100 text-green-700 border border-green-200',
    warning: 'bg-amber-100 text-amber-700 border border-amber-200',
    danger: 'bg-red-100 text-red-700 border border-red-200',
    info: 'bg-blue-100 text-blue-700 border border-blue-200',
    // Sin borde
    'default-solid': 'bg-gray-200 text-gray-800',
    'primary-solid': 'bg-wahu-500 text-white',
    'success-solid': 'bg-green-500 text-white',
    'warning-solid': 'bg-amber-500 text-white',
    'danger-solid': 'bg-red-500 text-white',
    'info-solid': 'bg-blue-500 text-white',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium transition-all
        ${variants[variant] || variants.default}
        ${sizes[size] || sizes.md}
        ${removable ? 'pr-1' : ''}
        ${className}
      `}
    >
      {Icon && <Icon size={size === 'sm' ? 12 : size === 'lg' ? 18 : 14} />}
      <span>{children}</span>
      {removable && (
        <button
          onClick={onRemove}
          className="ml-1 p-0.5 hover:opacity-70 transition-opacity flex-shrink-0"
          aria-label="Remover"
        >
          ✕
        </button>
      )}
    </span>
  );
}

// Variantes predefinidas comunes
export function CategoryBadge({ category }) {
  const categoryConfig = {
    Personalidad: 'primary',
    Salud: 'success',
    Comportamiento: 'info',
    Habilidades: 'warning',
    Energía: 'danger',
  };

  return <Badge variant={categoryConfig[category] || 'default'}>{category}</Badge>;
}

export function StatusBadge({ status, capitalize = true }) {
  const statusConfig = {
    pending: 'warning',
    accepted: 'success',
    rejected: 'danger',
    active: 'success',
    inactive: 'default',
    loading: 'info',
  };

  const displayText = capitalize
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : status;

  return <Badge variant={statusConfig[status] || 'default'}>{displayText}</Badge>;
}

export function TagBadge({ tag, onRemove, removable = false }) {
  return (
    <Badge
      variant="primary"
      size="sm"
      removable={removable}
      onRemove={onRemove}
    >
      #{tag}
    </Badge>
  );
}
