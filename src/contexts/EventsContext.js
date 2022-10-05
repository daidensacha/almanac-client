import { useEffect, useState, useContext, createContext } from 'react';
import instance from '../utils/axiosClient';

const EventContextProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  console.log('CONTEXT EVENTS', events);
  useEffect(() => {
    const getEvents = async () => {
      try {
        const {
          data: { allEvents },
        } = await instance.get(`/events`);
        // console.log('SUCCESS CONTEXT EVENTS', allEvents);
        setEvents(allEvents);
        console.log('allEvents', allEvents);
      } catch (err) {
        console.log(err.response.data.error);
      }
    };
    getEvents();
  }, []);

  return (
    <EventContext.Provider value={{ events, setEvents }}>
      {children}
    </EventContext.Provider>
  );
};
const EventContext = createContext();

export default EventContextProvider;

export const useEventsContext = () => useContext(EventContext);
