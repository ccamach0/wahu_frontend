import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

/**
 * Componente de input mejorado con validación visual integrada
 * Soporta: validación en tiempo real, feedback visual, iconos, tooltips
 */
export default function FormInput({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  success,
  hint,
  icon: Icon,
  disabled = false,
  required = false,
  autoComplete,
  pattern,
  minLength,
  maxLength,
  className = '',
  showPasswordToggle = false,
  name,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputType = showPassword ? 'text' : type;
  const hasError = error && error.trim();
  const hasSuccess = success && !hasError;

  const borderColor = hasError
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : hasSuccess
      ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
      : 'border-gray-300 focus:border-wahu-500 focus:ring-wahu-500';

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input container */}
      <div className="relative">
        {/* Icon izquierdo */}
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon size={18} />
          </div>
        )}

        {/* Input */}
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          pattern={pattern}
          minLength={minLength}
          maxLength={maxLength}
          className={`
            input w-full
            ${Icon ? 'pl-10' : ''}
            border-2 transition-all duration-200
            focus:ring-2 focus:ring-offset-0
            disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
            ${borderColor}
            ${hasError ? 'bg-red-50/50' : hasSuccess ? 'bg-green-50/50' : 'hover:border-gray-400'}
            ${className}
          `}
        />

        {/* Icon derecho - validación */}
        {hasError ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
            <AlertCircle size={18} />
          </div>
        ) : hasSuccess ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none">
            <CheckCircle size={18} />
          </div>
        ) : null}

        {/* Toggle de password */}
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* Error message */}
      {hasError && (
        <div className="flex items-start gap-2 text-red-600 text-sm animate-in fade-in-50 duration-200">
          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Success message */}
      {hasSuccess && (
        <div className="flex items-start gap-2 text-green-600 text-sm animate-in fade-in-50 duration-200">
          <CheckCircle size={14} className="flex-shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {/* Hint message */}
      {hint && !hasError && !hasSuccess && (
        <p className="text-xs text-gray-500 ml-0">{hint}</p>
      )}

      {/* Character counter */}
      {maxLength && (
        <div className="flex justify-end">
          <p className={`text-xs ${value?.length > maxLength * 0.8 ? 'text-amber-600 font-medium' : 'text-gray-400'}`}>
            {value?.length || 0} / {maxLength}
          </p>
        </div>
      )}
    </div>
  );
}
