import * as React from 'react';
// import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import NavigationIcon from '@mui/icons-material/Navigation';

const SmallFloatingNavigateButton = () => {
  return (
    // <Box sx={{ '& > :not(style)': { m: 1 } }}>
      <Fab variant="extended" size="small" color="primary" aria-label="add">
        <NavigationIcon sx={{ mr: 1 }} />
      </Fab>
    {/* </Box> */}
  );
}

export default SmallFloatingNavigateButton;