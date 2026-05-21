import { useState } from 'react';
import { Sidebar as ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, Typography, useTheme } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CategoryIcon from '@mui/icons-material/Category';
import GavelIcon from '@mui/icons-material/Gavel';
import FlagIcon from '@mui/icons-material/Flag';
import SmsIcon from '@mui/icons-material/Sms';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BarChartIcon from '@mui/icons-material/BarChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import MenuIcon from '@mui/icons-material/Menu';
import { tokens } from '../../theme';

const navItems = [
  { title: 'Dashboard', to: '/admin', icon: <DashboardIcon /> },
  { title: 'Users', to: '/admin/users', icon: <PeopleIcon /> },
  { title: 'Jobs', to: '/admin/jobs', icon: <WorkIcon /> },
  { title: 'Verifications', to: '/admin/verifications', icon: <VerifiedUserIcon /> },
  { title: 'Categories', to: '/admin/categories', icon: <CategoryIcon /> },
  { title: 'Disputes', to: '/admin/disputes', icon: <GavelIcon /> },
  { title: 'Flagged Workers', to: '/admin/flagged-workers', icon: <FlagIcon /> },
  { title: 'SMS Center', to: '/admin/sms', icon: <SmsIcon /> },
  { title: 'Notifications', to: '/admin/notifications', icon: <NotificationsIcon /> },
  { title: 'Reports', to: '/admin/reports', icon: <BarChartIcon /> },
  { title: 'Commission', to: '/admin/commission', icon: <AttachMoneyIcon /> },
  { title: "Africa's Talking", to: '/admin/africastalking', icon: <PhoneAndroidIcon /> },
];

export default function Sidebar() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Box sx={{ display: 'flex', height: '100vh', position: 'sticky', top: 0 }}>
      <ProSidebar
        collapsed={collapsed}
        backgroundColor={colors.primary[400]}
        rootStyles={{ border: 'none', height: '100%' }}
      >
        <Menu
          menuItemStyles={{
            button: ({ active }) => ({
              backgroundColor: active ? colors.greenAccent[700] : 'transparent',
              color: colors.grey[100],
              '&:hover': { backgroundColor: colors.greenAccent[800], color: '#fff' },
            }),
          }}
        >
          {/* Header */}
          <MenuItem
            icon={collapsed ? <MenuIcon /> : undefined}
            onClick={() => setCollapsed(!collapsed)}
            style={{ margin: '10px 0' }}
          >
            {!collapsed && (
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" fontWeight="bold" color={colors.greenAccent[500]}>
                  KAZI ADMIN
                </Typography>
                <MenuIcon onClick={() => setCollapsed(!collapsed)} sx={{ cursor: 'pointer' }} />
              </Box>
            )}
          </MenuItem>

          {navItems.map(({ title, to, icon }) => (
            <MenuItem
              key={to}
              icon={icon}
              component={<Link to={to} />}
              active={location.pathname === to}
            >
              {title}
            </MenuItem>
          ))}
        </Menu>
      </ProSidebar>
    </Box>
  );
}
