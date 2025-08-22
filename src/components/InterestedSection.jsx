import { Typography, Box, Container, Grid, Divider, Stack, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const InterestedSection = () => {
  return (
    <Box sx={{ bgcolor: 'secondary.dark', py: { xs: 6, md: 8 } }}>
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 4, md: 2 }} alignItems="stretch" justifyContent="center">
          {/* Column 1 */}
          <Grid item xs={12} md={3}>
            <Stack spacing={2} sx={{ height: '100%' }}>
              <Typography variant="h5" align="center" color="secondary.contrastText">
                Questions or suggestions?
              </Typography>
              <Typography variant="body1" color="secondary.contrastText">
                I'm open to hear from you if you have any questions or suggestions for the app. I'm
                also interested in hearing about your gardening or farming experiences. Please
                contact me through the form on the{' '}
                <MuiLink component={RouterLink} to="/contact" color="inherit" underline="always">
                  contact page
                </MuiLink>
                .
              </Typography>
            </Stack>
          </Grid>

          {/* Divider for md+ */}
          <Grid
            item
            md={1}
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'stretch',
              justifyContent: 'center',
            }}
          >
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: 'common.white', opacity: 0.3 }}
            />
          </Grid>

          {/* Column 2 */}
          <Grid item xs={12} md={3}>
            <Stack spacing={2} sx={{ height: '100%' }}>
              <Typography variant="h5" align="center" color="secondary.contrastText">
                Want to contribute?
              </Typography>
              <Typography variant="body1" color="secondary.contrastText">
                I'm growing this project to help people understand climate change and how to
                mitigate it. If you're interested in helping, please reach out—looking for
                developers, designers, writers, and folks keen on outreach/marketing.
              </Typography>
            </Stack>
          </Grid>

          {/* Divider for md+ */}
          <Grid
            item
            md={1}
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'stretch',
              justifyContent: 'center',
            }}
          >
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: 'common.white', opacity: 0.3 }}
            />
          </Grid>

          {/* Column 3 */}
          <Grid item xs={12} md={3}>
            <Stack spacing={2} sx={{ height: '100%' }}>
              <Typography variant="h5" align="center" color="secondary.contrastText">
                Ready to get started?
              </Typography>
              <Typography variant="body1" color="secondary.contrastText">
                Every journey starts with a single step. Create an account and help build a better
                understanding of local climate patterns. You can also join the newsletter for
                updates.
              </Typography>
            </Stack>
          </Grid>

          {/* Horizontal dividers for mobile between blocks */}
          <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
            <Divider sx={{ borderColor: 'common.white', opacity: 0.2, my: 1 }} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default InterestedSection;
