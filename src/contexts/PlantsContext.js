import { useEffect, useState, useContext, createContext } from 'react'
import instance from '../utils/axiosClient';

const PlantsContextProvider = ({children}) => {

  const [plants, setPlants] = useState([]);
  console.log('CONTEXT PLANTS', plants);
  useEffect(() => {
    const getPlants = async () => {
      try {
        const {
          data: { allPlants },
        } = await instance.get(`/plants`);
        // console.log('SUCCESS CONTEXT PLANT', allPlants);
        setPlants(allPlants);
      } catch (err) {
        console.log(err.response.data.error);
      }
    };
    getPlants();
  }, []);

  return (

    <PlantsContext.Provider value={{plants, setPlants}}>
      {children}
    </PlantsContext.Provider>

  )
}
  const PlantsContext = createContext();

export default PlantsContextProvider;

export const usePlantsContext = () => useContext(PlantsContext)