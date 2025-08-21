import { useEffect, useState, useContext, createContext } from 'react';
import { useAuthContext } from './AuthContext';
import instance from '@/utils/axiosClient';

const CategoriesContextProvider = ({ children }) => {
  const { user } = useAuthContext();

  const [categories, setCategories] = useState([]);
  // console.log('CONTEXT CATEGORIES', categories);
  useEffect(() => {
    const getCategories = async () => {
      try {
        const {
          data: { allCategories },
        } = await instance.get(`/categories`);
        // console.log('SUCCESS CONTEXT CATEGORIES', allCategories);
        setCategories(allCategories);
      } catch (err) {
        console.log(err.response.data.error);
      }
    };
    user && getCategories();
  }, [user]);

  return (
    <CategoriesContext.Provider value={{ categories, setCategories }}>
      {children}
    </CategoriesContext.Provider>
  );
};
const CategoriesContext = createContext();

export default CategoriesContextProvider;

export const useCategoriesContext = () => useContext(CategoriesContext);
