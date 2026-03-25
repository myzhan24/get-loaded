import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function Header() {
  return (
    <AppBar position="static" sx={{ mb: 3, backgroundColor: '#ffd100' }}>
      <Toolbar>
        <img src={`${import.meta.env.BASE_URL}Sanrio_Characters_Pompompurin_Image006.webp`} alt="Pompompurin" style={{ height: 36, marginRight: 12 }} />
        <Typography variant="h6" component="h1" sx={{ color: '#5c3d00', fontFamily: '"Lilita One", cursive', fontSize: '1.6rem', letterSpacing: '0.5px' }}>
          Get Loaded
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
