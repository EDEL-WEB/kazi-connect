import { useEffect, useState, useMemo } from 'react';
import {
  Box, Grid, Typography, useTheme, CircularProgress,
  Table, TableBody, TableCell, TableHead, TableRow, Paper, Chip,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GavelIcon from '@mui/icons-material/Gavel';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { ResponsiveLine } from '@nivo/line';
import { tokens } from '../../admin/theme';
import {
  adminAPI, jobsAPI, usersAPI, escrowAPI,
  verificationAPI, paymentsAPI,
} from '../../api/endpoints';

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ title, value, icon, color, loading }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Paper
      sx={{
        p: 3, display: 'flex', alignItems: 'center', gap: 2,
        backgroundColor: colors.primary[400], borderRadius: 2,
      }}
    >
      <Box sx={{ color, fontSize: 40 }}>{icon}</Box>
      <Box>
        <Typography variant="h6" color={colors.grey[300]}>{title}</Typography>
        {loading
          ? <CircularProgress size={20} />
          : <Typography variant="h4" fontWeight="bold" color={colors.grey[100]}>{value ?? '—'}</Typography>
        }
      </Box>
    </Paper>
  );
}

// ── Job status chip ────────────────────────────────────────────────────────
const statusColor = {
  pending: 'warning', active: 'info', completed: 'success',
  cancelled: 'error', disputed: 'error',
};

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentTx, setRecentTx] = useState([]);
  const [commissionData, setCommissionData] = useState([]);
  const [pendingVerif, setPendingVerif] = useState(null);
  const [disputes, setDisputes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const results = await Promise.allSettled([
          adminAPI.stats(),
          adminAPI.allJobs({ limit: 8, sort: 'newest' }),
          adminAPI.recentTransactions(),
          adminAPI.commissionSummary(),
          verificationAPI.adminPending(),
          escrowAPI.status('disputes'), // fallback — may 404
        ]);

        if (results[0].status === 'fulfilled') setStats(results[0].value.data);
        if (results[1].status === 'fulfilled') {
          const d = results[1].value.data;
          setRecentJobs(Array.isArray(d) ? d : d?.jobs ?? []);
        }
        if (results[2].status === 'fulfilled') {
          const d = results[2].value.data;
          setRecentTx(Array.isArray(d) ? d : d?.transactions ?? []);
        }
        if (results[3].status === 'fulfilled') {
          const d = results[3].value.data;
          // Expect [{month, commission}] or similar
          const raw = Array.isArray(d) ? d : d?.data ?? [];
          if (raw.length) {
            setCommissionData([{
              id: 'Commission',
              color: colors.greenAccent[500],
              data: raw.map(r => ({ x: r.month ?? r.date ?? r.label, y: r.commission ?? r.amount ?? r.value })),
            }]);
          }
        }
        if (results[4].status === 'fulfilled') {
          const d = results[4].value.data;
          setPendingVerif(Array.isArray(d) ? d.length : d?.count ?? d?.total ?? 0);
        }
        // disputes count from stats fallback
      } catch (e) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const statCards = useMemo(() => [
    {
      title: 'Total Users',
      value: stats?.totalUsers ?? stats?.users,
      icon: <PeopleIcon fontSize="inherit" />,
      color: colors.blueAccent[400],
    },
    {
      title: 'Total Jobs',
      value: stats?.totalJobs ?? stats?.jobs,
      icon: <WorkIcon fontSize="inherit" />,
      color: colors.greenAccent[400],
    },
    {
      title: 'Revenue (KES)',
      value: stats?.totalRevenue != null
        ? `KES ${Number(stats.totalRevenue).toLocaleString()}`
        : stats?.revenue != null
          ? `KES ${Number(stats.revenue).toLocaleString()}`
          : null,
      icon: <AttachMoneyIcon fontSize="inherit" />,
      color: colors.greenAccent[300],
    },
    {
      title: 'Pending Verifications',
      value: pendingVerif ?? stats?.pendingVerifications,
      icon: <VerifiedUserIcon fontSize="inherit" />,
      color: colors.redAccent[400],
    },
    {
      title: 'Open Disputes',
      value: stats?.openDisputes ?? stats?.disputes,
      icon: <GavelIcon fontSize="inherit" />,
      color: colors.redAccent[300],
    },
  ], [stats, pendingVerif, colors]);

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" color={colors.grey[100]} mb={3}>
        Admin Dashboard
      </Typography>

      {error && (
        <Typography color="error" mb={2}>{error}</Typography>
      )}

      {/* Stat Cards */}
      <Grid container spacing={2} mb={4}>
        {statCards.map(card => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={card.title}>
            <StatCard {...card} loading={loading} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Commission Chart */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2, backgroundColor: colors.primary[400], borderRadius: 2, height: 300 }}>
            <Typography variant="h6" color={colors.grey[200]} mb={1}>Commission Over Time</Typography>
            {commissionData.length > 0 ? (
              <ResponsiveLine
                data={commissionData}
                margin={{ top: 10, right: 20, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                axisBottom={{ tickRotation: -30 }}
                axisLeft={{ format: v => `${v}` }}
                colors={[colors.greenAccent[500]]}
                pointSize={6}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                enableArea
                theme={{
                  axis: { ticks: { text: { fill: colors.grey[300] } } },
                  grid: { line: { stroke: colors.grey[700] } },
                }}
              />
            ) : (
              <Box display="flex" alignItems="center" justifyContent="center" height="80%">
                {loading
                  ? <CircularProgress />
                  : <Typography color={colors.grey[500]}>No commission data available</Typography>
                }
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, backgroundColor: colors.primary[400], borderRadius: 2 }}>
            <Typography variant="h6" color={colors.grey[200]} mb={1}>Recent Transactions</Typography>
            {loading ? (
              <CircularProgress />
            ) : recentTx.length === 0 ? (
              <Typography color={colors.grey[500]}>No transactions yet</Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: colors.greenAccent[400] }}>User</TableCell>
                    <TableCell sx={{ color: colors.greenAccent[400] }}>Amount</TableCell>
                    <TableCell sx={{ color: colors.greenAccent[400] }}>Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentTx.slice(0, 6).map((tx, i) => (
                    <TableRow key={tx._id ?? tx.id ?? i}>
                      <TableCell sx={{ color: colors.grey[200] }}>
                        {tx.user?.name ?? tx.userName ?? tx.userId ?? '—'}
                      </TableCell>
                      <TableCell sx={{ color: colors.greenAccent[400] }}>
                        KES {Number(tx.amount ?? tx.cost ?? 0).toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ color: colors.grey[300] }}>
                        {tx.type ?? tx.transactionType ?? '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        </Grid>

        {/* Recent Jobs */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, backgroundColor: colors.primary[400], borderRadius: 2 }}>
            <Typography variant="h6" color={colors.grey[200]} mb={1}>Recent Jobs</Typography>
            {loading ? (
              <CircularProgress />
            ) : recentJobs.length === 0 ? (
              <Typography color={colors.grey[500]}>No jobs yet</Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {['ID', 'Customer', 'Category', 'Status', 'Amount', 'Date'].map(h => (
                      <TableCell key={h} sx={{ color: colors.greenAccent[400] }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentJobs.map((job, i) => (
                    <TableRow key={job._id ?? job.id ?? i}>
                      <TableCell sx={{ color: colors.grey[400], fontSize: 11 }}>
                        {(job._id ?? job.id ?? '').toString().slice(-6)}
                      </TableCell>
                      <TableCell sx={{ color: colors.grey[200] }}>
                        {job.customer?.name ?? job.customerName ?? '—'}
                      </TableCell>
                      <TableCell sx={{ color: colors.grey[300] }}>
                        {job.category?.name ?? job.categoryName ?? job.category ?? '—'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={job.status ?? '—'}
                          color={statusColor[job.status] ?? 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ color: colors.greenAccent[400] }}>
                        {job.amount != null ? `KES ${Number(job.amount).toLocaleString()}` : '—'}
                      </TableCell>
                      <TableCell sx={{ color: colors.grey[400], fontSize: 11 }}>
                        {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
