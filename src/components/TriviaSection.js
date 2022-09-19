import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

const TriviaSection = () => {
  return (
    <Box
    sx={{
      bgcolor: "background.paper",
      pt: 8,
      pb: 6,
    }}
  >
    <Container maxWidth="md">
      <Typography

        variant="h3"
        align="center"
        color="text.primary"
        gutterBottom
      >
        Did you know?
      </Typography>
      <Typography

        variant="h6"
        align="center"
        color="text.secondary"
        component="p"
      >
        The Old Farmer’s Almanac has been continuously published in the United States since 1792.
        The historical data, handed down for generations, is priceless for farmers and hobby gardeners alike.
        The process of recording events and exprerience benefits everyone. An Almanac is a great resource for
        learning about the weather and climate in your area.

      </Typography>
    </Container>
  </Box>
  );
}

export default TriviaSection;