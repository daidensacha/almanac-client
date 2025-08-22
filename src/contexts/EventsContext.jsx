/* @refresh reset */
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthContext } from './AuthContext';
import instance from '@/utils/axiosClient';
import { getAxiosErrorMessage } from '@/utils/error';

// Keep the context internal to avoid export-shape churn
const EventsContext = createContext(null);
EventsContext.displayName = 'EventsContext';

export function useEventsContext() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error('useEventsContext must be used within <EventsContextProvider>');
  return ctx;
}

const EventsContextProvider = ({ children }) => {
  const { user } = useAuthContext();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?._id) {
      setEvents([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const {
          data: { allEvents },
        } = await instance.get('/events');
        if (!cancelled) setEvents(allEvents ?? []);
      } catch (err) {
        const msg = getAxiosErrorMessage(err, 'Failed to load events');
        if (!cancelled) {
          setError(msg);
          setEvents([]);
        }
        console.error('[Events] fetch failed:', msg, err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?._id]);

  return (
    <EventsContext.Provider value={{ events, setEvents, loading, error }}>
      {children}
    </EventsContext.Provider>
  );
};

export default EventsContextProvider;
