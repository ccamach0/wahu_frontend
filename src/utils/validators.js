/**
 * Validadores para formularios
 * Cada validador retorna un string de error o undefined si es válido
 */

export const required = (value) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return 'Este campo es requerido';
  }
};

export const email = (value) => {
  if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return 'Ingresa un email válido';
  }
};

export const minLength = (min) => (value) => {
  if (value && value.length < min) {
    return `Mínimo ${min} caracteres`;
  }
};

export const maxLength = (max) => (value) => {
  if (value && value.length > max) {
    return `Máximo ${max} caracteres`;
  }
};

export const username = (value) => {
  if (value && !/^[a-z0-9_-]{3,20}$/i.test(value)) {
    return 'Solo letras, números, _ y - (3-20 caracteres)';
  }
};

export const password = (value) => {
  if (value && value.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }
  if (value && !/[A-Z]/.test(value)) {
    return 'Debe contener al menos una mayúscula';
  }
  if (value && !/[a-z]/.test(value)) {
    return 'Debe contener al menos una minúscula';
  }
  if (value && !/[0-9]/.test(value)) {
    return 'Debe contener al menos un número';
  }
};

export const number = (value) => {
  if (value && isNaN(value)) {
    return 'Debe ser un número';
  }
};

export const url = (value) => {
  if (value) {
    try {
      new URL(value);
    } catch {
      return 'Ingresa una URL válida';
    }
  }
};

export const match = (fieldValue) => (value) => {
  if (value !== fieldValue) {
    return 'Los valores no coinciden';
  }
};

export const custom = (fn) => (value) => {
  return fn(value);
};

/**
 * Crear validador compuesto de múltiples validadores
 */
export function compose(...validators) {
  return (value) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
  };
}

/**
 * Crear validadores para un objeto completo
 */
export function createFormValidator(schema) {
  return (values) => {
    const errors = {};
    Object.keys(schema).forEach((key) => {
      const validator = schema[key];
      const error = validator(values[key]);
      if (error) errors[key] = error;
    });
    return errors;
  };
}

/**
 * Validadores comunes pre-configurados
 */
export const validators = {
  required,
  email,
  username,
  password,
  number,
  url,
  minLength,
  maxLength,
  match,
  custom,
  compose,
};

export default validators;
