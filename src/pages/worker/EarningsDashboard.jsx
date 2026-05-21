import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentsAPI, jobsAPI } from '../../api/endpoints';

export default function EarningsDashboard() {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([paymentsAPI.wallet(), paymentsAPI.transactions(), jobsAPI.myJobs()])
      .then(([w, t, j]) => {
        setWallet(w.data);
        setTransactions(Array.isArray(t.data) ? t.data : t.data?.transactions || []);
        setJobs(j.data?.jobs || j.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const money = (v) => v != null ? `KSh ${Number(v).toLocaleString()}` : '—';
  const completed = jobs.filter(j => j.status === 'completed');
  const totalEarned = wallet?.total_earned ?? transactions.filter(t => t.type === 'credit').reduce((a, t) => a + Number(t.amount || 0), 0);

  if (loading) return <div style={s.center}>Loading...</div>;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('/worker/dashboard')}>← Dashboard</button>
        <h2 style={s.title}>Earnings</h2>
      </div>

      <div style={s.stats}>
        {[
          { label: 'Available Balance', value: money(wallet?.balance), bg: 'linear-gradient(135deg,#00695c,#00897b)' },
          { label: 'Total Earned', value: money(totalEarned), bg: 'linear-gradient(135deg,#1565c0,#1976d2)' },
          { label: 'Jobs Completed', value: completed.length, bg: 'linear-gradient(135deg,#2e7d32,#388e3c)' },
          { label: 'Avg per Job', value: completed.length ? money(Math.round(totalEarned / completed.length)) : '—', bg: 'linear-gradient(135deg,#e65100,#f57c00)' },
        ].map((s2, i) => (
          <div key={i} style={{ ...s.statCard, background: s2.bg }}>
            <div style={s.statLabel}>{s2.label}</div>
            <div style={s.statValue}>{s2.value}</div>
          </div>
        ))}
      </div>

      <h3 style={s.sectionTitle}>Recent Earnings</h3>
      {transactions.length === 0 ? (
        <div style={s.empty}>No transactions yet.</div>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead><tr>{['Date', 'Type', 'Amount', 'Status'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
            <tbody>
              {transactions.slice(0, 10).map((tx, i) => (
                <tr key={i} style={s.tr}>
                  <td style={s.td}>{tx.created_at ? new Date(tx.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }) : '—'}</td>
                  <td style={{ ...s.td, textTransform: 'capitalize' }}>{tx.type || tx.transaction_type}</td>
                  <td style={{ ...s.td, color: '#00695c', fontWeight: 700 }}>{money(tx.amount)}</td>
                  <td style={{ ...s.td, textTransform: 'capitalize' }}>{tx.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  center: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' },
  title: { fontSize: '1.4rem', fontWeight: 700, color: '#111' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '14px', marginBottom: '28px' },
  statCard: { borderRadius: '12px', padding: '18px', color: '#fff' },
  statLabel: { fontSize: '0.8rem', opacity: 0.85, marginBottom: '6px' },
  statValue: { fontSize: '1.4rem', fontWeight: 800 },
  sectionTitle: { fontSize: '1rem', fontWeight: 700, color: '#333', marginBottom: '12px' },
  empty: { textAlign: 'center', color: '#666', padding: '40px 0' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
  th: { padding: '12px 16px', background: '#f5f5f5', textAlign: 'left', fontSize: '0.85rem', fontWeight: 700, color: '#555' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px 16px', fontSize: '0.9rem', color: '#333' },
};
