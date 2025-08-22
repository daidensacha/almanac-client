import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { FaLeaf, FaRegCalendarAlt, FaBookOpen } from 'react-icons/fa';

export default function AlmanacCards() {
  return (
    <Box sx={{ bgcolor: 'primary.dark', py: { xs: 3, sm: 4 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Plants */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              elevation={2}
              sx={{
                // Let the grid control width; make card fill its cell and
                // keep contents aligned even when heights differ.
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                bgcolor: 'background.paper',
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h3" align="center" sx={{ color: 'secondary.main', mb: 1 }}>
                  <FaLeaf />
                </Typography>
                <Typography variant="h4" align="center" gutterBottom>
                  Plants
                </Typography>
                <Typography variant="h6" align="center">
                  Care for your plants.
                </Typography>
                <Typography color="text.secondary" align="center" sx={{ mb: 1.5 }}>
                  They will return the love.
                </Typography>
                <Typography component="p" variant="body2" sx={{ textAlign: 'justify' }}>
                  A profile for each plant with helpful information: when to sow, plant, harvest,
                  fertilise. Add notes to help you remember what your plants need. Revisit each year
                  to keep your garden growing.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Events */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                bgcolor: 'background.paper',
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h3" align="center" sx={{ color: 'secondary.main', mb: 1 }}>
                  <FaRegCalendarAlt />
                </Typography>
                <Typography variant="h4" align="center" gutterBottom>
                  Events
                </Typography>
                <Typography variant="h6" align="center">
                  Nature is cyclical.
                </Typography>
                <Typography color="text.secondary" align="center" sx={{ mb: 1.5 }}>
                  Every year same same but different.
                </Typography>
                <Typography component="p" variant="body2" sx={{ textAlign: 'justify' }}>
                  It’s easy to forget. Add events to your calendar so you’re prepared:
                  plant-specific tasks, garden-wide reminders, and important dates like first/last
                  frost or seasonal patterns.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Almanac */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                bgcolor: 'background.paper',
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h3" align="center" sx={{ color: 'secondary.main', mb: 1 }}>
                  <FaBookOpen />
                </Typography>
                <Typography variant="h4" align="center" gutterBottom>
                  Almanac
                </Typography>
                <Typography variant="h6" align="center">
                  Review your records.
                </Typography>
                <Typography color="text.secondary" align="center" sx={{ mb: 1.5 }}>
                  Learn about your garden.
                </Typography>
                <Typography component="p" variant="body2" sx={{ textAlign: 'justify' }}>
                  A running record that makes your garden smarter over time—tailored to your climate
                  zone and your space. Improve year after year: we nourish nature; nature nourishes
                  us.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
