import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

/**
 * Componente de paginación reutilizable
 */
export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  isLoading = false,
  showJumper = false,
  onJump,
  maxVisible = 5,
}) {
  if (totalPages <= 1) return null;

  // Generar números de página a mostrar
  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {/* Primer página */}
      <button
        onClick={() => onPageChange?.(1)}
        disabled={currentPage === 1 || isLoading}
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Primera página"
      >
        <ChevronsLeft size={18} className="text-gray-500" />
      </button>

      {/* Página anterior */}
      <button
        onClick={() => onPageChange?.(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Página anterior"
      >
        <ChevronLeft size={18} className="text-gray-500" />
      </button>

      {/* Números de página */}
      <div className="flex gap-1">
        {pages.map((page, idx) => (
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-2 py-1 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange?.(page)}
              disabled={isLoading}
              className={`
                min-w-9 h-9 rounded-lg font-medium transition-all
                ${
                  page === currentPage
                    ? 'bg-wahu-500 text-white shadow-md'
                    : 'hover:bg-gray-100 text-gray-700 disabled:opacity-50'
                }
              `}
            >
              {page}
            </button>
          )
        ))}
      </div>

      {/* Página siguiente */}
      <button
        onClick={() => onPageChange?.(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Página siguiente"
      >
        <ChevronRight size={18} className="text-gray-500" />
      </button>

      {/* Última página */}
      <button
        onClick={() => onPageChange?.(totalPages)}
        disabled={currentPage === totalPages || isLoading}
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Última página"
      >
        <ChevronsRight size={18} className="text-gray-500" />
      </button>

      {/* Info de página */}
      <div className="ml-2 text-sm text-gray-500 whitespace-nowrap">
        {currentPage} de {totalPages}
      </div>
    </div>
  );
}
