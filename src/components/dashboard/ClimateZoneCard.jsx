// src/components/dashboard/ClimateZoneCard.jsx
import { Card, CardContent, CardHeader, Typography, Button, Stack } from '@mui/material';
export default function ClimateZoneCard() {
  // TODO: wire to useKoppenZone/useUserProfile
  return (
    <Card>
      <CardHeader title="Climate Zone" />
      <CardContent>
        <Typography variant="subtitle1">Cfb — Temperate Oceanic 🌧️🌤️</Typography>
        <Stack spacing={0.5} sx={{ mt: 1 }}>
          <Typography variant="body2">Growing season: Mar–Oct</Typography>
          <Typography variant="body2">Frost risk: Last ~15 May / First ~15 Nov</Typography>
        </Stack>
        <Button size="small" sx={{ mt: 1 }}>
          Learn more about your zone
        </Button>
      </CardContent>
    </Card>
  );
}
