import { useEffect, useState, useContext, createContext } from 'react'
import instance from '../utils/axiosClient';

const CategoriesContextProvider = ({children}) => {

  const [categories, setCategories] = useState([]);

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
    getCategories();
  }, []);

  return (

    <CategoriesContext.Provider value={{categories, setCategories}}>
      {children}
    </CategoriesContext.Provider>

  )
}
  const CategoriesContext = createContext();

export default CategoriesContextProvider;

export const useCategoriesContext = () => useContext(CategoriesContext)