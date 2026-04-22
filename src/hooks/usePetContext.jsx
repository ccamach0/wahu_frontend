import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';
import { useAuth } from './useAuth.jsx';

const PetContext = createContext({ pets: [], activePet: null, setActivePet: () => {}, addPet: () => {}, removePet: () => {}, loading: true });

export function PetProvider({ children }) {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [activePet, setActivePetState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPets([]);
      setActivePetState(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    api.getMyPets()
      .then(data => {
        setPets(data);
        const bdActive = user.active_pet_id ? data.find(p => p.id === user.active_pet_id) : null;
        const savedId = localStorage.getItem('wahu_active_pet');
        const localActive = savedId ? data.find(p => p.id === savedId) : null;
        setActivePetState(bdActive || localActive || data[0] || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id]);

  const setActivePet = (pet) => {
    setActivePetState(pet);
    if (pet) {
      localStorage.setItem('wahu_active_pet', pet.id);
      api.setActivePet(pet.id).catch(() => {});
    }
  };

  const addPet = (pet) => setPets(prev => [...prev, pet]);

  const removePet = (petId) => {
    setPets(prev => prev.filter(p => p.id !== petId));
    if (activePet?.id === petId) {
      setActivePetState(null);
      localStorage.removeItem('wahu_active_pet');
      api.setActivePet(null).catch(() => {});
    }
  };

  return (
    <PetContext.Provider value={{ pets, activePet, setActivePet, addPet, removePet, loading }}>
      {children}
    </PetContext.Provider>
  );
}

export const usePetContext = () => useContext(PetContext);
