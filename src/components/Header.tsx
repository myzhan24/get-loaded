import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

export default function Header() {
  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Toolbar>
        <LocalShippingIcon sx={{ mr: 1.5 }} />
        <Typography variant="h6" component="h1">
          Get Loaded
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
