/**
 * Mostrar información de versión del frontend y backend en consola
 * Se ejecuta automáticamente al cargar la app
 */

export async function logVersionInfo() {
  const frontendVersion = {
    buildTime: __BUILD_TIME__,
    gitHash: __GIT_HASH__,
    gitBranch: __GIT_BRANCH__,
  };

  console.group('🐾 Wahu Version Info');
  console.log('Frontend:', frontendVersion);

  try {
    const backendResponse = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/health`);
    if (backendResponse.ok) {
      const backendVersion = await backendResponse.json();
      console.log('Backend:', backendVersion);

      // Verificar si coinciden
      const matching = frontendVersion.gitHash === backendVersion.gitHash;
      console.log(
        `%c${matching ? '✅ Versions match' : '⚠️ Versions MISMATCH'}`,
        matching ? 'color: green; font-weight: bold' : 'color: orange; font-weight: bold'
      );
    }
  } catch (err) {
    console.error('Could not fetch backend version:', err.message);
  }
  console.groupEnd();
}

// Hacer disponible globalmente
window.__logVersionInfo = logVersionInfo;
window.__getVersionInfo = async () => {
  return {
    frontend: {
      buildTime: __BUILD_TIME__,
      gitHash: __GIT_HASH__,
      gitBranch: __GIT_BRANCH__,
    },
    backend: await fetch(`${import.meta.env.VITE_API_URL || ''}/api/health`)
      .then(r => r.json())
      .catch(e => ({ error: e.message }))
  };
};
