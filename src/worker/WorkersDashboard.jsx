import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tab,
  Tabs,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Work as WorkIcon,
  CalendarMonth as CalendarIcon,
  AccountBalanceWallet as WalletIcon,
  Star as StarIcon,
  Message as MessageIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import './workersDashboard.css';

const drawerWidth = 280;

// Mock data for the dashboard
const earningsData = [
  { day: 'Mon', amount: 120 },
  { day: 'Tue', amount: 200 },
  { day: 'Wed', amount: 150 },
  { day: 'Thu', amount: 280 },
  { day: 'Fri', amount: 220 },
  { day: 'Sat', amount: 350 },
  { day: 'Sun', amount: 180 },
];

const jobCategoryData = [
  { name: 'Cleaning', value: 45, color: '#00695c' },
  { name: 'Plumbing', value: 25, color: '#00897b' },
  { name: 'Painting', value: 20, color: '#26a69a' },
  { name: 'Tutoring', value: 10, color: '#4db6ac' },
];

const upcomingJobs = [
  {
    id: 1,
    client: 'Sarah Johnson',
    service: 'Home Cleaning',
    date: '2026-04-09',
    time: '09:00 AM',
    location: 'Kilimani, Nairobi',
    status: 'confirmed',
    amount: 2500,
    duration: '3 hours',
  },
  {
    id: 2,
    client: 'Michael Ochieng',
    service: 'Office Cleaning',
    date: '2026-04-10',
    time: '02:00 PM',
    location: 'Westlands, Nairobi',
    status: 'pending',
    amount: 3500,
    duration: '4 hours',
  },
  {
    id: 3,
    client: 'Grace Muthoni',
    service: 'Deep Cleaning',
    date: '2026-04-11',
    time: '10:00 AM',
    location: 'Karen, Nairobi',
    status: 'confirmed',
    amount: 4500,
    duration: '5 hours',
  },
];

const recentReviews = [
  {
    id: 1,
    client: 'John Kamau',
    rating: 5,
    comment: 'Excellent work! Very thorough and professional.',
    date: '2026-04-05',
    service: 'Home Cleaning',
  },
  {
    id: 2,
    client: 'Mary Wanjiku',
    rating: 4,
    comment: 'Good job, arrived on time and completed quickly.',
    date: '2026-04-03',
    service: 'Plumbing Repair',
  },
  {
    id: 3,
    client: 'Peter Njoroge',
    rating: 5,
    comment: 'Amazing attention to detail. Will hire again!',
    date: '2026-04-01',
    service: 'Office Cleaning',
  },
];

const calendarEvents = [
  {
    title: 'Home Cleaning - Sarah J.',
    date: '2026-04-09',
    start: '09:00',
    end: '12:00',
    color: '#00695c',
  },
  {
    title: 'Office Cleaning - Michael O.',
    date: '2026-04-10',
    start: '14:00',
    end: '18:00',
    color: '#00897b',
  },
  {
    title: 'Deep Cleaning - Grace M.',
    date: '2026-04-11',
    start: '10:00',
    end: '15:00',
    color: '#00695c',
  },
];

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function WorkersDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [currentView, setCurrentView] = useState('dashboard');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'jobs', label: 'My Jobs', icon: <WorkIcon /> },
    { id: 'calendar', label: 'Calendar', icon: <CalendarIcon /> },
    { id: 'earnings', label: 'Earnings', icon: <WalletIcon /> },
    { id: 'reviews', label: 'Reviews', icon: <StarIcon /> },
    { id: 'messages', label: 'Messages', icon: <MessageIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  const drawer = (
    <Box>
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #00695c 0%, #00897b 100%)',
          color: 'white',
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mb: 2,
            border: '3px solid white',
            fontSize: '2rem',
          }}
        >
          JD
        </Avatar>
        <Typography variant="h6" fontWeight="bold">
          John Doe
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Professional Cleaner
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 0.5 }}>
          <StarIcon sx={{ color: '#ffd700', fontSize: 18 }} />
          <Typography variant="body2" fontWeight="bold">
            4.8
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            (127 reviews)
          </Typography>
        </Box>
      </Box>

      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={currentView === item.id}
              onClick={() => setCurrentView(item.id)}
              sx={{
                mx: 2,
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: '#e0f2f1',
                  color: '#00695c',
                  '&:hover': { backgroundColor: '#b2dfdb' },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: currentView === item.id ? '#00695c' : 'inherit',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: currentView === item.id ? 600 : 400 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mx: 2, my: 2 }} />

      <List>
        <ListItem disablePadding>
          <ListItemButton sx={{ mx: 2, borderRadius: 2, color: '#d32f2f' }}>
            <ListItemIcon sx={{ color: '#d32f2f', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>

      <Box sx={{ p: 3, mt: 'auto' }}>
        <Card sx={{ backgroundColor: '#f5f5f5', borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Profile Completion
            </Typography>
            <LinearProgress
              variant="determinate"
              value={85}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#00695c',
                  borderRadius: 4,
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              85% Complete
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );

  const renderDashboard = () => (
    <Box>
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              background: 'linear-gradient(135deg, #00695c 0%, #00897b 100%)',
              color: 'white',
              boxShadow: '0 8px 32px rgba(0, 105, 92, 0.3)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Total Earnings
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    KSh 24,500
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 0.5 }}>
                    <TrendingUpIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption">+12% this week</Typography>
                  </Box>
                </Box>
                <WalletIcon sx={{ fontSize: 40, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
              color: 'white',
              boxShadow: '0 8px 32px rgba(21, 101, 192, 0.3)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Jobs Completed
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    127
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 0.5 }}>
                    <TrendingUpIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption">+5 this week</Typography>
                  </Box>
                </Box>
                <WorkIcon sx={{ fontSize: 40, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              background: 'linear-gradient(135deg, #e65100 0%, #f57c00 100%)',
              color: 'white',
              boxShadow: '0 8px 32px rgba(230, 81, 0, 0.3)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Pending Jobs
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    8
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 0.5 }}>
                    <TrendingDownIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption">3 need confirmation</Typography>
                  </Box>
                </Box>
                <TimeIcon sx={{ fontSize: 40, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              background: 'linear-gradient(135deg, #6a1b9a 0%, #8e24aa 100%)',
              color: 'white',
              boxShadow: '0 8px 32px rgba(106, 27, 154, 0.3)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Rating
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    4.8/5
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 0.5 }}>
                    <StarIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption">Top rated worker</Typography>
                  </Box>
                </Box>
                <StarIcon sx={{ fontSize: 40, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Tables */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Earnings Overview
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="day" stroke="#666" />
                    <YAxis stroke="#666" />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#00695c"
                      strokeWidth={3}
                      dot={{ fill: '#00695c', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, fill: '#00897b' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Job Categories
              </Typography>
              <Box sx={{ height: 250, display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={jobCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {jobCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ mt: 2 }}>
                {jobCategoryData.map((category) => (
                  <Box
                    key={category.name}
                    sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: category.color,
                      }}
                    />
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {category.name}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {category.value}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Upcoming Jobs
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#00695c',
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#00897b' },
                  }}
                >
                  View All Jobs
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Client</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Service</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date & Time</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {upcomingJobs.map((job) => (
                      <TableRow key={job.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, backgroundColor: '#00695c' }}>
                              {job.client.charAt(0)}
                            </Avatar>
                            <Typography variant="body2" fontWeight={500}>
                              {job.client}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{job.service}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="body2">{job.date}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {job.time}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationIcon sx={{ fontSize: 16, color: '#666' }} />
                            <Typography variant="body2">{job.location}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold" color="#00695c">
                            KSh {job.amount.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={job.status}
                            size="small"
                            sx={{
                              textTransform: 'capitalize',
                              backgroundColor: job.status === 'confirmed' ? '#e8f5e9' : '#fff3e0',
                              color: job.status === 'confirmed' ? '#2e7d32' : '#ef6c00',
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Accept">
                              <IconButton
                                size="small"
                                sx={{ color: '#2e7d32', '&:hover': { backgroundColor: '#e8f5e9' } }}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Decline">
                              <IconButton
                                size="small"
                                sx={{ color: '#d32f2f', '&:hover': { backgroundColor: '#ffebee' } }}
                              >
                                <CancelIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderJobs = () => (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        My Jobs
      </Typography>
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTabs-flexContainer': { px: 2, pt: 2 },
          }}
        >
          <Tab label="Upcoming" sx={{ textTransform: 'none', fontWeight: 600 }} />
          <Tab label="Completed" sx={{ textTransform: 'none', fontWeight: 600 }} />
          <Tab label="Cancelled" sx={{ textTransform: 'none', fontWeight: 600 }} />
        </Tabs>
        <TabPanel value={activeTab} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Client</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Service</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {upcomingJobs.map((job) => (
                  <TableRow key={job.id} hover>
                    <TableCell>{job.client}</TableCell>
                    <TableCell>{job.service}</TableCell>
                    <TableCell>{job.date}</TableCell>
                    <TableCell>KSh {job.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={job.status}
                        size="small"
                        sx={{
                          backgroundColor: job.status === 'confirmed' ? '#e8f5e9' : '#fff3e0',
                          color: job.status === 'confirmed' ? '#2e7d32' : '#ef6c00',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: '#00695c',
                          color: '#00695c',
                          textTransform: 'none',
                          '&:hover': { backgroundColor: '#e0f2f1', borderColor: '#00695c' },
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
            Completed jobs will appear here
          </Typography>
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
            Cancelled jobs will appear here
          </Typography>
        </TabPanel>
      </Card>
    </Box>
  );

  const renderCalendar = () => (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        My Calendar
      </Typography>
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', p: 3 }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={calendarEvents}
          height="auto"
          eventClick={(info) => {
            alert(`Job: ${info.event.title}`);
          }}
        />
      </Card>
    </Box>
  );

  const renderEarnings = () => (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Earnings
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #00695c 0%, #00897b 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Balance</Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ my: 2 }}>
                KSh 24,500
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: 'white',
                  color: '#00695c',
                  fontWeight: 'bold',
                  '&:hover': { backgroundColor: '#f5f5f5' },
                }}
              >
                Withdraw
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Earnings History
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="amount" stroke="#00695c" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderReviews = () => (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Customer Reviews
      </Typography>
      <Grid container spacing={3}>
        {recentReviews.map((review) => (
          <Grid item xs={12} md={4} key={review.id}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ backgroundColor: '#00695c' }}>{review.client.charAt(0)}</Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {review.client}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {review.date}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <StarIcon sx={{ color: '#ffd700', fontSize: 18 }} />
                    <Typography variant="body2" fontWeight="bold" sx={{ ml: 0.5 }}>
                      {review.rating}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={review.service}
                  size="small"
                  sx={{ backgroundColor: '#e0f2f1', color: '#00695c', mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary">
                  "{review.comment}"
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'jobs':
        return renderJobs();
      case 'calendar':
        return renderCalendar();
      case 'earnings':
        return renderEarnings();
      case 'reviews':
        return renderReviews();
      default:
        return renderDashboard();
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            border: 'none',
            boxShadow: '4px 0 20px rgba(0,0,0,0.08)',
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
        }}
      >
        {/* App Bar */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            backgroundColor: 'transparent',
            color: 'text.primary',
            mb: 3,
          }}
        >
          <Toolbar sx={{ px: { xs: 0, sm: 0 } }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h5" fontWeight="bold" sx={{ flexGrow: 1, color: '#00695c' }}>
              {menuItems.find((item) => item.id === currentView)?.label || 'Dashboard'}
            </Typography>
            <IconButton sx={{ mr: 1 }}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Avatar sx={{ backgroundColor: '#00695c' }}>JD</Avatar>
          </Toolbar>
        </AppBar>

        {/* Content */}
        {renderContent()}
      </Box>
    </Box>
  );
}
