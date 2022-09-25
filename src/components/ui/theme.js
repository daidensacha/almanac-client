import { createTheme } from "@mui/material";

const gaGreen = "#aece5f";
const gaPurple = "#ae5fcf";
const gaDarkGrey = '#212121';
const gaLightGrey = '#f5f5f5';
const gaLight = '#E8EEEE';
// const gaBlue = "#5fcae8";


const theme = createTheme({
  palette: {
    type: 'dark',
    // mode: 'light',
    common: {
      green: `${gaGreen}`,
      purple: `${gaPurple}`,
      darkGrey: `${gaDarkGrey}`,
      lightGrey: `${gaLightGrey}`,
      light: `${gaLight}`,
    },
    primary: {
      main: `${gaGreen}`,
    },
    secondary: {
      main: `${gaPurple}`,
    },
  },
  typography: {
    fontFamily: 'Lato',
  }
});

export default theme;