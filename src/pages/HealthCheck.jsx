import { useEffect, useState } from 'react';

const HealthCheck = () => {
  const [status, setStatus] = useState(null);

  const base = import.meta.env.VITE_API || 'http://localhost:8000/api';
  const urls = {
    Auth: `${base}/auth/health`,
    User: `${base}/user/health`,
    Climate: `${base}/climate/health`,
  };

  const fetchHealth = async () => {
    try {
      const entries = await Promise.all(
        Object.entries(urls).map(async ([name, url]) => {
          try {
            const res = await fetch(url);
            const json = await res.json().catch(() => ({}));
            return [name, { ok: res.ok, status: res.status, json: json || {} }];
          } catch (e) {
            return [name, { ok: false, status: 0, json: {} }];
          }
        }),
      );
      setStatus(Object.fromEntries(entries));
    } catch {
      setStatus(null);
    }
  };

  useEffect(() => {
    fetchHealth();
    const id = setInterval(fetchHealth, 10000);
    return () => clearInterval(id);
  }, []);

  if (!status) return <p>Health check failed</p>;

  return (
    <div style={{ padding: 16, textAlign: 'left' }}>
      <h2>🩺 Health Dashboard</h2>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          marginTop: '20px',
          marginBottom: '20px',
          marginLeft: '20px',
        }}
      >
        <thead>
          <tr>
            <th>Service</th>
            <th>Status</th>
            <th>Code</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(status).map(([name, svc]) => (
            <tr key={name}>
              <td>{name}</td>
              <td style={{ fontWeight: 700, color: svc.ok ? 'green' : 'red' }}>
                {svc.ok ? '✔️ Up' : '❌ Down'}
              </td>
              <td>{svc.status}</td>
              <td>
                {svc.json?.timestamp ? new Date(svc.json.timestamp).toLocaleTimeString() : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ color: '#666' }}>Auto-refresh every 10s</p>
    </div>
  );
};

export default HealthCheck;

// import { useEffect, useState } from 'react';
// import Container from '@mui/material/Container';
// import Grid from '@mui/material/Grid';
// import Chip from '@mui/material/Chip';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';

// const ping = async url => {
//   try {
//     const res = await fetch(url, { method: 'GET', credentials: 'omit' }); // no auth
//     if (!res.ok) return { ok: false, status: res.status };
//     const json = await res.json().catch(() => ({}));
//     return { ok: !!json.ok, status: res.status, json };
//   } catch (e) {
//     return { ok: false, error: String(e) };
//   }
// };

// export default function HealthCheck() {
//   const base = import.meta.env.VITE_API?.replace(/\/+$/, '') || ''; // e.g. http://localhost:8000/api
//   const endpoints = {
//     Auth: `${base}/auth/health`,
//     User: `${base}/user/health`,
//     Climate: `${base}/climate/health`,
//   };

//   const [results, setResults] = useState({
//     Auth: null,
//     User: null,
//     Climate: null,
//   });

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       const entries = await Promise.all(
//         Object.entries(endpoints).map(async ([name, url]) => [
//           name,
//           await ping(url),
//         ]),
//       );
//       if (!cancelled) setResults(Object.fromEntries(entries));
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, []); // run once

//   const chip = name => {
//     const r = results[name];
//     const ok = r && r.ok;
//     const label = r == null ? 'Checking…' : ok ? 'Up' : 'Down';
//     const color = r == null ? 'default' : ok ? 'success' : 'error';
//     return (
//       <Chip label={`${name} ${label}`} color={color} sx={{ mr: 1, mb: 1 }} />
//     );
//   };

//   return (
//     <Container maxWidth='sm' sx={{ py: 6, minHeight: '60vh' }}>
//       <Typography variant='h4' gutterBottom>
//         Service Health
//       </Typography>
//       <Box sx={{ mt: 2 }}>
//         {chip('Auth')}
//         {chip('User')}
//         {chip('Climate')}
//       </Box>
//       <Grid container sx={{ mt: 3 }}>
//         <pre
//           style={{
//             width: '100%',
//             overflow: 'auto',
//             background: '#111',
//             color: '#9fe',
//             padding: 12,
//             borderRadius: 8,
//           }}>
//           {JSON.stringify(results, null, 2)}
//         </pre>
//       </Grid>
//     </Container>
//   );
// }
