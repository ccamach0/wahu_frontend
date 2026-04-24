import { AlertCircle, Plus } from 'lucide-react';

/**
 * Componente EmptyState para mostrar cuando no hay datos
 * Proporciona mensajes claros y acciones sugeridas
 */
export default function EmptyState({
  icon: Icon = AlertCircle,
  title = 'No hay datos',
  message = 'No encontramos ningún resultado',
  action,
  actionLabel = 'Crear nuevo',
  illustration,
  variant = 'default',
  className = '',
}) {
  const variantClasses = {
    default: 'text-gray-400',
    primary: 'text-wahu-300',
    success: 'text-green-300',
    warning: 'text-amber-300',
    danger: 'text-red-300',
  };

  return (
    <div
      className={`
        flex flex-col items-center justify-center py-12 px-4 rounded-lg
        bg-gradient-to-b from-gray-50 to-white
        ${className}
      `}
    >
      {/* Ilustración */}
      {illustration ? (
        <div className="w-32 h-32 mb-6">{illustration}</div>
      ) : (
        <div className="mb-6">
          <Icon size={64} className={`${variantClasses[variant]} opacity-40`} />
        </div>
      )}

      {/* Título */}
      <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{title}</h3>

      {/* Mensaje */}
      <p className="text-gray-600 text-center max-w-sm mb-6">{message}</p>

      {/* Acción */}
      {action && (
        <button
          onClick={action}
          className="inline-flex items-center gap-2 bg-wahu-500 hover:bg-wahu-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          <Plus size={18} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// Variantes específicas pre-configuradas
export function NoResultsEmpty({ onRetry }) {
  return (
    <EmptyState
      title="Sin resultados"
      message="No encontramos coincidencias para tu búsqueda. Intenta con otros términos."
      action={onRetry}
      actionLabel="Limpiar búsqueda"
      variant="primary"
    />
  );
}

export function NoDataEmpty({ action, actionLabel = 'Crear primero' }) {
  return (
    <EmptyState
      title="Sin datos"
      message="No hay nada aquí todavía. ¡Sé el primero en crear algo!"
      action={action}
      actionLabel={actionLabel}
      variant="primary"
    />
  );
}

export function NetworkErrorEmpty({ onRetry }) {
  return (
    <EmptyState
      title="Error de conexión"
      message="No pudimos conectar con el servidor. Verifica tu conexión e intenta nuevamente."
      action={onRetry}
      actionLabel="Reintentar"
      variant="danger"
    />
  );
}

export function PermissionErrorEmpty() {
  return (
    <EmptyState
      title="Acceso denegado"
      message="No tienes permisos para ver este contenido."
      variant="danger"
    />
  );
}
