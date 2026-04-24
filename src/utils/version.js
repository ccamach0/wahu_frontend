// Información de versión - se actualiza en el build
export const BUILD_INFO = {
  version: '1.0.0',
  buildTime: __BUILD_TIME__,
  gitHash: __GIT_HASH__,
  gitBranch: __GIT_BRANCH__,
};

// Fallback si las variables no están definidas (para desarrollo local)
if (typeof BUILD_INFO.buildTime === 'string' && BUILD_INFO.buildTime.includes('BUILD_TIME')) {
  BUILD_INFO.buildTime = new Date().toISOString();
  BUILD_INFO.gitHash = 'dev-local';
  BUILD_INFO.gitBranch = 'development';
}

/**
 * Obtener información del backend
 */
export async function getBackendVersion() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/health`);
    if (!response.ok) throw new Error('Health check failed');
    return await response.json();
  } catch (err) {
    console.error('Error getting backend version:', err);
    return null;
  }
}

/**
 * Verificar si el backend se ha redesplegado
 * @param {Object} previousVersion - Versión anterior del backend
 * @returns {boolean} - true si hubo un cambio de versión
 */
export function hasBackendUpdated(previousVersion) {
  if (!previousVersion) return false;
  return previousVersion.gitHash !== (window.__backendVersion?.gitHash);
}

/**
 * Guardar versión actual en sessionStorage para comparar después
 */
export function saveCurrentVersions() {
  const backendVersion = window.__backendVersion;
  if (backendVersion) {
    sessionStorage.setItem('lastBackendVersion', JSON.stringify(backendVersion));
  }
}
