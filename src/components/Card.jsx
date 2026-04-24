/**
 * Componente Card reutilizable
 * Soporta: header, footer, acciones, variantes
 */
export default function Card({
  children,
  header,
  footer,
  title,
  subtitle,
  actions,
  variant = 'default',
  className = '',
  hoverable = false,
  clickable = false,
  onClick,
  loading = false,
}) {
  const variantClasses = {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white border border-gray-100 shadow-sm hover:shadow-md',
    filled: 'bg-gray-50 border border-gray-200',
    outlined: 'bg-transparent border-2 border-wahu-200',
    success: 'bg-green-50 border border-green-200',
    warning: 'bg-amber-50 border border-amber-200',
    danger: 'bg-red-50 border border-red-200',
  };

  return (
    <div
      onClick={clickable ? onClick : undefined}
      className={`
        rounded-lg overflow-hidden transition-all
        ${variantClasses[variant]}
        ${hoverable ? 'hover:shadow-lg hover:scale-105' : ''}
        ${clickable ? 'cursor-pointer' : ''}
        ${loading ? 'opacity-50 pointer-events-none' : ''}
        ${className}
      `}
    >
      {/* Header */}
      {header || (title && (
        <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between gap-4">
          <div>
            {title && <h3 className="font-bold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {actions && (
            <div className="flex gap-2">
              {actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick?.();
                  }}
                  className={`
                    text-sm font-medium px-3 py-1.5 rounded transition-colors
                    ${action.className || 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
                  `}
                  title={action.title}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Content */}
      <div className={header || title ? 'px-6 py-4' : 'p-6'}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
          {footer}
        </div>
      )}
    </div>
  );
}

/**
 * Card Grid para mostrar múltiples cards
 */
export function CardGrid({ children, columns = 3, gap = 4 }) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  const gapClasses = {
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
  };

  return (
    <div className={`grid ${colClasses[columns] || colClasses[3]} ${gapClasses[gap] || gapClasses[4]}`}>
      {children}
    </div>
  );
}
