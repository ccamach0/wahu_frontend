import { X } from 'lucide-react';
import { useEffect } from 'react';

/**
 * Componente Modal reutilizable
 * Soporta: diferentes tamaños, backdrop, scroll bloqueo
 */
export default function Modal({
  isOpen = false,
  onClose,
  title,
  children,
  footer,
  actions,
  size = 'md',
  closeOnBackdrop = true,
  closeButton = true,
  className = '',
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  };

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`
            bg-white rounded-xl shadow-2xl overflow-hidden
            max-h-[90vh] overflow-y-auto
            w-full ${sizeClasses[size] || sizeClasses.md}
            animate-in scale-in-95 duration-200
            ${className}
          `}
        >
          {/* Header */}
          {(title || closeButton) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                {title && <h2 className="text-xl font-bold text-gray-900">{title}</h2>}
              </div>
              {closeButton && (
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Cerrar"
                >
                  <X size={24} />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {children}
          </div>

          {/* Footer */}
          {(footer || actions) && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3 justify-end">
              {footer}
              {actions && actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    action.onClick?.();
                    if (action.closeOnClick !== false) onClose?.();
                  }}
                  className={`
                    px-4 py-2.5 rounded-lg font-medium transition-all text-sm
                    ${action.className || 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
                    ${action.primary ? 'bg-wahu-500 hover:bg-wahu-600 text-white' : ''}
                  `}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
