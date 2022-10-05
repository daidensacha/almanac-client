import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { FaLeaf, FaRegCalendarAlt, FaBookOpen } from 'react-icons/fa';

export default function AlmanacCards() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Box sx={{ bgcolor: 'primary.dark' }}>
        <Grid item container maxWidth='100%' sm={12} p={2} sx={{ mx: 'auto' }}>
          <Grid
            item
            xs={10}
            sm={10}
            md={4}
            zeroMinWidth
            sx={{
              bgcolor: 'primary.dark',
              mx: 'auto',
              px: 2,
              alignItems: 'stretch',
            }}>
            <Card
              sx={{
                minWidth: 275,
                minHeight: 410,
                bgcolor: 'paper',
                mb: 5,
                borderRadius: 2,
              }}>
              <CardContent>
                <Typography
                  variant='h3'
                  component='div'
                  sx={{ textAlign: 'center', color: 'secondary.main' }}>
                  <FaLeaf />
                </Typography>
                <Typography
                  variant='h3'
                  sx={{ color: 'primary.contrastText', textAlign: 'center' }}
                  gutterBottom>
                  Plants
                </Typography>
                <Typography
                  variant='h5'
                  component='div'
                  sx={{ textAlign: 'center' }}>
                  Care for your plants.
                </Typography>
                <Typography
                  sx={{ mb: 1.5, textAlign: 'center' }}
                  color='text.secondary'>
                  They will return the love.
                </Typography>
                <Typography variant='p' sx={{ textAlign: 'justify' }}>
                  A profile for each plant with helpful information. When to
                  sow, plant, harvest, fertilise. Add notes to help you remember
                  what your plants need. Revise each year to keep your garden
                  growing. A reference from previous years.
                </Typography>
              </CardContent>
            </Card>
            {/* </Box> */}
          </Grid>
          <Grid
            item
            xs={10}
            sm={10}
            md={4}
            zeroMinWidth
            sx={{ bgcolor: 'primary.dark', mx: 'auto', px: 2 }}>
            <Card
              sx={{
                minWidth: 275,
                minHeight: 410,
                bgcolor: 'paper',
                mb: 5,
                borderRadius: 2,
              }}>
              <CardContent>
                <Typography
                  variant='h3'
                  component='div'
                  sx={{ textAlign: 'center', color: 'secondary.main' }}>
                  <FaRegCalendarAlt />
                </Typography>
                <Typography
                  variant='h3'
                  sx={{ color: 'primary.contrastText', textAlign: 'center' }}
                  gutterBottom>
                  Events
                </Typography>
                <Typography
                  variant='h5'
                  component='div'
                  sx={{ textAlign: 'center' }}>
                  Nature is cyclical.
                </Typography>
                <Typography
                  sx={{ mb: 1.5, textAlign: 'center' }}
                  color='text.secondary'>
                  Every year same same but different.
                </Typography>
                <Typography variant='p'>
                  Its easy to forget. Add events to your calendar to help you
                  remember so you can be prepared each year. Events for each
                  plant, or for the garden as a whole. Reminders of important
                  dates, like first and last frost, or weather patterns.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            item
            xs={10}
            sm={10}
            md={4}
            zeroMinWidth
            sx={{ bgcolor: 'primary.dark', mx: 'auto', px: 2 }}>
            <Card
              sx={{
                minWidth: 275,
                minHeight: 410,
                bgcolor: 'paper',
                mb: 5,
                borderRadius: 2,
              }}>
              <CardContent>
                <Typography
                  variant='h3'
                  component='div'
                  sx={{ textAlign: 'center', color: 'secondary.main' }}>
                  <FaBookOpen />
                </Typography>
                <Typography
                  variant='h3'
                  sx={{ color: 'primary.contrastText', textAlign: 'center' }}
                  gutterBottom>
                  Almanac
                </Typography>
                <Typography
                  variant='h5'
                  component='div'
                  sx={{ textAlign: 'center' }}>
                  Review your records.
                </Typography>
                <Typography
                  sx={{ mb: 1.5, textAlign: 'center' }}
                  color='text.secondary'>
                  Learn about your garden.
                </Typography>
                <Typography variant='p'>
                  Your record to help you understand your garden's needs better.
                  Specific for your climate zone, and for your garden. A
                  reference to help impove the garden year after year. We
                  nourish nature; and nature nourishes us.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );
}
