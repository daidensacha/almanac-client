import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

const AboutSection = () => {
  return (
    <Box
    sx={{
      bgcolor: "background.paper",
      pt: 8,
      pb: 6,
    }}
  >

    <Container maxWidth="md">
      <Grid container spacing={4}>

        <Grid item xs={12} md={6}>
            <Typography
            variant="h3"
            sx={{textAlign:"center", color:"text.primary"}}
            gutterBottom
          >
            About Me
          </Typography>
          <Typography
            variant="body1"
            component="p"
            sx={{ px: 4, color:"text.secondary", textAlign:"justify", mb:2}}
          >
            Take the man out of the country, but you cant  take the country out of the man.
          </Typography>
          <Typography
            variant="body2"
            component="p"
            sx={{ px: 4, color:"text.secondary", textAlign:""}}
          >
            I'm a hobby gardener who enjoys growing my own fruit, herbs and vegetables.
            My forebears were farmers who migrated from Germany to Australia in the early 1800's where our family still has farms.
            I couldn't find an app to keep a garden journal, so I decided to make one. <br/>
            I hope you find the app as useful as I do. Let me know!
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
        </Grid>
      </Grid>
    </Container>
  </Box>
  );
}

export default AboutSection;