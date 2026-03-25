import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Lilita One", cursive',
    subtitle2: {
      fontSize: '1.1rem',
    },
  },
  palette: {
    primary: {
      main: '#8d6531',
    },
    secondary: {
      main: '#c75b39',
    },
    success: {
      main: '#2e7d6e',
    },
    warning: {
      main: '#c75b39',
    },
  },
});

export default theme;
