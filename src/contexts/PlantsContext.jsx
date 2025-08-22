/* @refresh reset */
// src/contexts/PlantsContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import instance from '@/utils/axiosClient';
import { useAuthContext } from '@/contexts/AuthContext';
import { getAxiosErrorMessage } from '@/utils/error';

export const PlantsContext = createContext(null);

export function usePlantsContext() {
  const ctx = useContext(PlantsContext);
  if (!ctx) throw new Error('usePlantsContext must be used within <PlantsContextProvider>');
  return ctx;
}

export default function PlantsContextProvider({ children }) {
  const { user } = useAuthContext();
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    const getPlants = async () => {
      try {
        const {
          data: { allPlants },
        } = await instance.get('/plants');
        setPlants(allPlants);
      } catch (err) {
        const msg = getAxiosErrorMessage(err, 'Failed to load plants');
        console.error('[Plants] fetch failed:', msg, err);
      }
    };
    if (user) getPlants();
  }, [user]);

  return <PlantsContext.Provider value={{ plants, setPlants }}>{children}</PlantsContext.Provider>;
}
