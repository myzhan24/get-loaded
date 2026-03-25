import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Nunito", sans-serif',
    h1: { fontFamily: '"Lilita One", cursive' },
    h2: { fontFamily: '"Lilita One", cursive' },
    h3: { fontFamily: '"Lilita One", cursive' },
    h4: { fontFamily: '"Lilita One", cursive' },
    h5: { fontFamily: '"Lilita One", cursive' },
    h6: { fontFamily: '"Lilita One", cursive' },
    subtitle2: {
      fontFamily: '"Lilita One", cursive',
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
