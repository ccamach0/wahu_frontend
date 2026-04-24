import { AlertTriangle, X } from 'lucide-react';

/**
 * Modal de confirmación para acciones destructivas
 * Soporta diferentes niveles de severidad y botones personalizados
 */
export default function ConfirmModal({
  isOpen = false,
  title = '¿Estás seguro?',
  message = 'Esta acción no se puede deshacer.',
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  severity = 'danger', // 'danger', 'warning', 'info'
  onConfirm,
  onCancel,
  loading = false,
  disabled = false,
}) {
  if (!isOpen) return null;

  const severityColors = {
    danger: {
      icon: 'text-red-500',
      bg: 'bg-red-50',
      border: 'border-red-200',
      button: 'btn-danger',
    },
    warning: {
      icon: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      button: 'bg-amber-500 hover:bg-amber-600 text-white',
    },
    info: {
      icon: 'text-blue-500',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      button: 'bg-blue-500 hover:bg-blue-600 text-white',
    },
  };

  const colors = severityColors[severity] || severityColors.danger;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 opacity-100 transition-opacity"
        onClick={onCancel}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onCancel?.();
        }}
      >
        <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full animate-in scale-in-95 duration-200">
          {/* Header */}
          <div className={`flex items-start gap-4 p-6 ${colors.bg} border-b ${colors.border}`}>
            <div className={`flex-shrink-0 w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center`}>
              <AlertTriangle size={24} className={colors.icon} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">{message}</p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Acciones */}
          <div className="flex gap-3 p-6">
            <button
              onClick={onCancel}
              disabled={loading || disabled}
              className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading || disabled}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${colors.button}`}
            >
              {loading ? '⏳ Procesando...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
