import { Container, Grid, Typography } from '@mui/material';

import WeatherCard from '@/components/dashboard/WeatherCard';
import MoonCard from '@/components/dashboard/MoonCard';
import ClimateZoneCard from '@/components/dashboard/ClimateZoneCard';
import SeasonalCard from '@/components/dashboard/SeasonalCard';
import StatsCard from '@/components/dashboard/StatsCard';
import UpcomingList from '@/components/dashboard/UpcomingList';
import TipsCard from '@/components/dashboard/TipsCard';
import QuickActions from '@/components/dashboard/QuickActions';

export default function Dashboard() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Row 1 */}
        <Grid item xs={12} md={6} lg={8}>
          <WeatherCard />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <MoonCard />
        </Grid>

        {/* Row 2 */}
        <Grid item xs={12} md={6} lg={6}>
          <ClimateZoneCard />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <SeasonalCard />
        </Grid>

        {/* Row 3 */}
        <Grid item xs={12} md={6} lg={6}>
          <StatsCard />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <QuickActions />
        </Grid>

        {/* Row 4 */}
        <Grid item xs={12} md={8}>
          <UpcomingList />
        </Grid>
        <Grid item xs={12} md={4}>
          <TipsCard />
        </Grid>
      </Grid>
    </Container>
  );
}
