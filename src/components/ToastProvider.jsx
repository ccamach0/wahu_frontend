import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import Toast from './Toast.jsx';

const ToastContext = createContext();

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext debe usarse dentro de ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, options = {}) => {
    const {
      type = 'info',
      duration = 4000,
      action,
      actionLabel = 'Deshacer',
    } = options;

    const id = Math.random().toString(36).substr(2, 9);
    const toast = { id, message, type, duration, action, actionLabel };

    setToasts((prev) => [...prev, toast]);

    // Auto-remover
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (message, options) =>
      addToast(message, { type: 'success', duration: 3000, ...options }),
    [addToast]
  );

  const error = useCallback(
    (message, options) =>
      addToast(message, { type: 'error', duration: 5000, ...options }),
    [addToast]
  );

  const warning = useCallback(
    (message, options) =>
      addToast(message, { type: 'warning', duration: 4000, ...options }),
    [addToast]
  );

  const info = useCallback(
    (message, options) =>
      addToast(message, { type: 'info', duration: 4000, ...options }),
    [addToast]
  );

  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              isOpen={true}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
              action={toast.action}
              actionLabel={toast.actionLabel}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
