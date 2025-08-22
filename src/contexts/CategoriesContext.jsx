/* @refresh reload */
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthContext } from './AuthContext';
import instance from '@/utils/axiosClient';
import { getAxiosErrorMessage } from '@/utils/error';

const CategoriesContext = createContext(null);
CategoriesContext.displayName = 'CategoriesContext';

export function useCategoriesContext() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error('useCategoriesContext must be used within <CategoriesContextProvider>');
  return ctx;
}

const CategoriesContextProvider = ({ children }) => {
  const { user } = useAuthContext();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?._id) {
      setCategories([]);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const {
          data: { allCategories },
        } = await instance.get('/categories');
        if (!cancelled) setCategories(allCategories ?? []);
      } catch (err) {
        const msg = getAxiosErrorMessage(err, 'Failed to load categories');
        if (!cancelled) {
          setError(msg);
          setCategories([]);
        }
        console.error('[Categories] fetch failed:', msg, err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?._id]);

  return (
    <CategoriesContext.Provider value={{ categories, setCategories, loading, error }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export default CategoriesContextProvider;
