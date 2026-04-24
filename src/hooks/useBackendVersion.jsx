import { useEffect, useState } from 'react';

export function useBackendVersion() {
  const [version, setVersion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/health`);
        if (response.ok) {
          const data = await response.json();
          setVersion(data);
          // Guardar en window para acceso global
          window.__backendVersion = data;
        }
      } catch (err) {
        console.error('Error fetching backend version:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVersion();
  }, []);

  return { version, loading };
}
