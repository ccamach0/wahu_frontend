import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Componente Toast para notificaciones
 * Soporta: success, error, warning, info
 */
export default function Toast({
  isOpen = false,
  message,
  type = 'info', // 'success', 'error', 'warning', 'info'
  duration = 4000,
  onClose,
  action,
  actionLabel = 'Deshacer',
}) {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
    if (!isOpen) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [isOpen, duration, onClose]);

  if (!isVisible) return null;

  const config = {
    success: {
      icon: CheckCircle,
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      iconColor: 'text-green-600',
    },
    error: {
      icon: AlertCircle,
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      iconColor: 'text-red-600',
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      iconColor: 'text-amber-600',
    },
    info: {
      icon: Info,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      iconColor: 'text-blue-600',
    },
  };

  const c = config[type] || config.info;
  const Icon = c.icon;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className={`flex items-start gap-3 px-4 py-3.5 rounded-lg border-l-4 shadow-lg ${c.bg} ${c.border}`}>
        <Icon size={20} className={`flex-shrink-0 mt-0.5 ${c.iconColor}`} />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${c.text}`}>{message}</p>
          {action && (
            <button
              onClick={() => {
                action();
                setIsVisible(false);
              }}
              className={`text-xs font-semibold mt-2 underline hover:no-underline ${c.text}`}
            >
              {actionLabel}
            </button>
          )}
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className={`flex-shrink-0 p-1 hover:bg-white/50 rounded transition-colors ${c.text}`}
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
