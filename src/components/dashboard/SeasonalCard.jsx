import { Paper, Typography, Stack, Chip } from '@mui/material';

export default function SeasonalCard() {
  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Seasonal Anchors
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
        <Chip label="Zone: [—]" />
        <Chip label="Last frost: [—]" />
        <Chip label="First frost: [—]" />
        <Chip label="Solstice/Equinox: [—]" />
      </Stack>
    </Paper>
  );
}
