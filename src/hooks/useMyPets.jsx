import { usePetContext } from './usePetContext.jsx';

// Wrapper que delega al contexto global — evita fetches duplicados
export function useMyPets() {
  const { pets, activePet, loading } = usePetContext();
  return { pets, firstPet: activePet, loading };
}
