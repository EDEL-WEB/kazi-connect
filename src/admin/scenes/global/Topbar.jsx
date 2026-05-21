import { Box, IconButton, useTheme } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { tokens } from '../../theme';

export default function Topbar({ onToggleMode }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      p={1}
      sx={{ backgroundColor: colors.primary[400] }}
    >
      <IconButton onClick={onToggleMode}>
        {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
      <IconButton onClick={handleLogout}>
        <LogoutIcon />
      </IconButton>
    </Box>
  );
}
