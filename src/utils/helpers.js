/**
 * Utilidades y funciones helper
 */

// Formateo
export function formatDate(date, locale = 'es-ES') {
  if (!date) return '';
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(date, locale = 'es-ES') {
  if (!date) return '';
  return new Date(date).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateTime(date, locale = 'es-ES') {
  return `${formatDate(date, locale)} ${formatTime(date, locale)}`;
}

export function formatRelativeTime(date) {
  const now = new Date();
  const then = new Date(date);
  const diff = now - then;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Hace unos segundos';
  if (minutes < 60) return `Hace ${minutes}m`;
  if (hours < 24) return `Hace ${hours}h`;
  if (days < 7) return `Hace ${days}d`;

  return formatDate(date);
}

// Validación
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validateUsername(username) {
  const re = /^[a-z0-9_-]{3,20}$/i;
  return re.test(username);
}

export function validatePassword(password) {
  return password && password.length >= 6;
}

export function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Strings
export function truncate(str, length = 50) {
  if (!str || str.length <= length) return str;
  return str.substring(0, length) + '...';
}

export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Arrays
export function groupBy(array, key) {
  return array.reduce((acc, item) => {
    const group = item[key];
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
}

export function unique(array, key) {
  const seen = new Set();
  return array.filter((item) => {
    const value = key ? item[key] : item;
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

export function sortBy(array, key, order = 'asc') {
  const sorted = [...array];
  sorted.sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (typeof aVal === 'string') {
      return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return order === 'asc' ? aVal - bVal : bVal - aVal;
  });
  return sorted;
}

export function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// Objetos
export function pick(obj, keys) {
  return keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key];
    return acc;
  }, {});
}

export function omit(obj, keys) {
  return Object.keys(obj).reduce((acc, key) => {
    if (!keys.includes(key)) acc[key] = obj[key];
    return acc;
  }, {});
}

export function merge(...objects) {
  return Object.assign({}, ...objects);
}

// Numbers
export function formatNumber(num) {
  return num.toLocaleString('es-ES');
}

export function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

export function percentage(value, total) {
  return ((value / total) * 100).toFixed(1);
}

// Misc
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function debounce(fn, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}

export function throttle(fn, wait) {
  let timeout;
  let prev = 0;
  return function (...args) {
    const now = Date.now();
    const remaining = wait - (now - prev);
    clearTimeout(timeout);

    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      prev = now;
      fn(...args);
    } else {
      timeout = setTimeout(() => {
        prev = Date.now();
        fn(...args);
      }, remaining);
    }
  };
}

export function retry(fn, options = {}) {
  const { times = 3, delay: delayMs = 1000 } = options;
  let lastError;

  return async function attempt(attempt = 1) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < times) {
        await delay(delayMs * attempt);
        return attempt(attempt + 1);
      }
      throw lastError;
    }
  }();
}

// LocalStorage
export function getFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setInStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeFromStorage(key) {
  localStorage.removeItem(key);
}
