import { Paper, Typography, Stack } from '@mui/material';

export default function MoonCard() {
  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Moon
      </Typography>
      <Stack spacing={1}>
        <Typography variant="body2">
          Phase: <b>[—]</b>
        </Typography>
        <Typography variant="body2">
          Illumination: <b>[—]</b>
        </Typography>
        <Typography variant="body2">
          Next full/new: <b>[— / —]</b>
        </Typography>
      </Stack>
    </Paper>
  );
}
