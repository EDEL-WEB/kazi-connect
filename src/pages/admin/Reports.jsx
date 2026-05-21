import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../api/endpoints';

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminAPI.stats(), adminAPI.recentTransactions()])
      .then(([s, t]) => {
        setStats(s.data);
        setTransactions(Array.isArray(t.data) ? t.data : t.data?.transactions || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const money = (v) => v != null ? `KSh ${Number(v).toLocaleString()}` : '—';
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <div style={s.page}>
      <h2 style={s.title}>Reports</h2>
      {loading && <div style={s.empty}>Loading...</div>}
      {stats && (
        <div style={s.statsGrid}>
          {[
            { label: 'Total Users', value: stats.total_users ?? '—', bg: 'linear-gradient(135deg,#1565c0,#1976d2)' },
            { label: 'Total Jobs', value: stats.total_jobs ?? '—', bg: 'linear-gradient(135deg,#2e7d32,#388e3c)' },
            { label: 'Completed Jobs', value: stats.completed_jobs ?? '—', bg: 'linear-gradient(135deg,#00695c,#00897b)' },
            { label: 'Total Revenue', value: money(stats.total_revenue), bg: 'linear-gradient(135deg,#4a148c,#7b1fa2)' },
          ].map((c, i) => (
            <div key={i} style={{ ...s.statCard, background: c.bg }}>
              <div style={s.statLabel}>{c.label}</div>
              <div style={s.statValue}>{c.value}</div>
            </div>
          ))}
        </div>
      )}
      <h3 style={s.sectionTitle}>Recent Transactions</h3>
      {transactions.length === 0 && !loading && <div style={s.empty}>No transactions.</div>}
      {transactions.length > 0 && (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead><tr>{['Date', 'Type', 'Amount', 'Status'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr key={i} style={s.tr}>
                  <td style={s.td}>{fmt(tx.created_at)}</td>
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
  page: { padding: '24px', fontFamily: 'Poppins, sans-serif' },
  title: { fontSize: '1.4rem', fontWeight: 700, color: '#111', marginBottom: '20px' },
  empty: { textAlign: 'center', color: '#666', padding: '40px 0' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px', marginBottom: '28px' },
  statCard: { borderRadius: '12px', padding: '18px', color: '#fff' },
  statLabel: { fontSize: '0.8rem', opacity: 0.85, marginBottom: '6px' },
  statValue: { fontSize: '1.5rem', fontWeight: 800 },
  sectionTitle: { fontSize: '1rem', fontWeight: 700, color: '#333', marginBottom: '12px' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
  th: { padding: '12px 16px', background: '#f5f5f5', textAlign: 'left', fontSize: '0.85rem', fontWeight: 700, color: '#555' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px 16px', fontSize: '0.88rem', color: '#333' },
};
