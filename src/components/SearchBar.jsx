import { Search, X, Filter, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

/**
 * Componente de búsqueda avanzada con filtros
 */
export default function SearchBar({
  placeholder = 'Buscar...',
  value = '',
  onChange,
  onSearch,
  filters = [],
  onFilterChange,
  loading = false,
  suggestions = [],
  onSuggestionSelect,
  debounceMs = 300,
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const filterRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(debounceTimer);
  }, [debounceTimer]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange?.(newValue);

    // Mostrar sugerencias cuando hay texto
    if (newValue.trim()) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }

    // Debounce search
    clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      onSearch?.(newValue);
    }, debounceMs);
    setDebounceTimer(timer);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange?.('');
    onSearch?.('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion) => {
    setLocalValue(suggestion);
    onChange?.(suggestion);
    setShowSuggestions(false);
    onSuggestionSelect?.(suggestion);
  };

  // Cerrar filtros al hacer click fuera
  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="space-y-3">
      {/* Barra de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={loading}
          className={`
            input w-full pl-10 pr-12 border-2 transition-all
            focus:border-wahu-500 focus:ring-2 focus:ring-wahu-500/20
            disabled:opacity-60
          `}
        />

        {/* Botones de acción */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {localValue && (
            <button
              onClick={handleClear}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
              title="Limpiar búsqueda"
            >
              <X size={18} />
            </button>
          )}

          {filters.length > 0 && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-1.5 rounded-lg transition-colors ${
                showFilters ? 'bg-wahu-100 text-wahu-500' : 'hover:bg-gray-100 text-gray-400'
              }`}
              title="Filtros"
            >
              <Filter size={18} />
            </button>
          )}
        </div>

        {/* Sugerencias */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            <div className="py-1 max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-2.5 hover:bg-wahu-50 transition-colors text-sm text-gray-700"
                >
                  <Search size={14} className="inline text-gray-400 mr-2" />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filtros */}
      {showFilters && filters.length > 0 && (
        <div
          ref={filterRef}
          className="bg-white rounded-lg border border-gray-200 p-4 space-y-3 animate-in fade-in-50 duration-200"
        >
          <p className="text-sm font-semibold text-gray-700">Filtros</p>
          {filters.map((filter) => (
            <div key={filter.key} className="space-y-2">
              <label className="text-xs font-medium text-gray-600 block">{filter.label}</label>
              {filter.type === 'select' ? (
                <select
                  value={filter.value}
                  onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
                  className="input w-full text-sm"
                >
                  <option value="">Todos</option>
                  {filter.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : filter.type === 'checkbox' ? (
                <div className="flex gap-2 flex-wrap">
                  {filter.options?.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filter.value?.includes(opt.value)}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...(filter.value || []), opt.value]
                            : filter.value?.filter((v) => v !== opt.value);
                          onFilterChange?.(filter.key, newValue);
                        }}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-600">{opt.label}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  type={filter.type}
                  value={filter.value}
                  onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
                  className="input w-full text-sm"
                  placeholder={filter.placeholder}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
