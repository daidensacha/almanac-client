import { Paper, Typography, Grid } from '@mui/material';

function Stat({ label, value }) {
  return (
    <div>
      <Typography variant="h4" component="div">
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </div>
  );
}

export default function StatsCard() {
  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Totals
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Stat label="Plants" value="—" />
        </Grid>
        <Grid item xs={4}>
          <Stat label="Categories" value="—" />
        </Grid>
        <Grid item xs={4}>
          <Stat label="Events" value="—" />
        </Grid>
      </Grid>
    </Paper>
  );
}
