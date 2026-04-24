/**
 * Componentes de loading con estilos profesionales
 */

export function Spinner({ size = 'md', color = 'wahu' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colorClasses = {
    wahu: 'border-wahu-200 border-t-wahu-500',
    white: 'border-white/30 border-t-white',
    gray: 'border-gray-200 border-t-gray-500',
  };

  return (
    <div
      className={`${sizeClasses[size]} border-4 ${colorClasses[color]} rounded-full animate-spin`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="animate-pulse space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
        <div className="h-12 bg-gray-200 rounded" />
        <div className="flex gap-2">
          <div className="h-8 bg-gray-100 rounded flex-1" />
          <div className="h-8 bg-gray-100 rounded flex-1" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGallery({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="aspect-square bg-gray-200 rounded-lg animate-pulse"
        />
      ))}
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-4 border border-gray-200 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-wahu-50">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" color="wahu" />
        <p className="text-wahu-500 font-medium">Cargando...</p>
      </div>
    </div>
  );
}

export function LoadingOverlay({ visible = true, message = 'Procesando...' }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-4 shadow-2xl">
        <Spinner size="lg" color="wahu" />
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
}

export default function LoadingSpinner({ type = 'spinner', size = 'md', count = 6 }) {
  if (type === 'spinner') return <Spinner size={size} />;
  if (type === 'card') return <SkeletonCard />;
  if (type === 'gallery') return <SkeletonGallery count={count} />;
  if (type === 'list') return <SkeletonList />;
  if (type === 'page') return <LoadingPage />;
  return <Spinner />;
}
