import { useState, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Sidebar from '../global/Sidebar';
import Topbar from '../global/Topbar';
import { themesettings } from '../../theme';
import './Adindex.css';

export default function AdminLayout() {
  const [mode, setMode] = useState('dark');
  const theme = useMemo(() => createTheme(themesettings(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="admin-dash">
        <Sidebar />
        <Box className="content" sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <Topbar onToggleMode={() => setMode(m => m === 'dark' ? 'light' : 'dark')} />
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
