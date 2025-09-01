import { Paper, Typography, Stack, Skeleton } from '@mui/material';

export default function WeatherCard() {
  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Weather
      </Typography>
      <Stack spacing={1}>
        <Typography variant="body2">
          Location: <b>[—]</b>
        </Typography>
        <Typography variant="body2">
          Temp: <b>[—]°C</b>
        </Typography>
        <Typography variant="body2">
          Sunrise/Sunset: <b>[— / —]</b>
        </Typography>
        <Skeleton variant="rectangular" height={8} />
      </Stack>
    </Paper>
  );
}
