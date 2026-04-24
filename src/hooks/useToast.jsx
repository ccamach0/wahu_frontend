import { useCallback, useState } from 'react';

/**
 * Hook para manejar toasts (notificaciones) globalmente
 * Se debe usar con el proveedor ToastProvider
 */
const toastContext = [];
const toastListeners = [];

export function useToast() {
  const [toasts, setToasts] = useState(toastContext);

  const addToast = useCallback((message, options = {}) => {
    const {
      type = 'info',
      duration = 4000,
      action,
      actionLabel = 'Deshacer',
    } = options;

    const id = Math.random().toString(36).substr(2, 9);
    const toast = { id, message, type, duration, action, actionLabel };

    toastContext.push(toast);
    setToasts([...toastContext]);

    // Notificar a todos los listeners
    toastListeners.forEach((cb) => cb([...toastContext]));

    // Auto-remover
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    const idx = toastContext.findIndex((t) => t.id === id);
    if (idx >= 0) {
      toastContext.splice(idx, 1);
      setToasts([...toastContext]);
      toastListeners.forEach((cb) => cb([...toastContext]));
    }
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

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}

// Registrar listener para sincronizar estado
export function registerToastListener(callback) {
  toastListeners.push(callback);
  return () => {
    const idx = toastListeners.indexOf(callback);
    if (idx >= 0) toastListeners.splice(idx, 1);
  };
}
