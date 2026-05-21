import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../api/endpoints';

export default function CommissionAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminAPI.commissionSummary()
      .then(r => setData(r.data))
      .catch(() => setError('Failed to load commission data.'))
      .finally(() => setLoading(false));
  }, []);

  const money = (v) => v != null ? `KSh ${Number(v).toLocaleString()}` : '—';

  return (
    <div style={s.page}>
      <h2 style={s.title}>Commission Analytics</h2>
      {error && <div style={s.error}>{error}</div>}
      {loading && <div style={s.empty}>Loading...</div>}
      {data && (
        <>
          <div style={s.statsGrid}>
            {[
              { label: 'Total Commission', value: money(data.total_commission), bg: 'linear-gradient(135deg,#00695c,#00897b)' },
              { label: 'This Month', value: money(data.monthly_commission), bg: 'linear-gradient(135deg,#1565c0,#1976d2)' },
              { label: 'Total Jobs', value: data.total_jobs ?? '—', bg: 'linear-gradient(135deg,#2e7d32,#388e3c)' },
              { label: 'Avg Commission/Job', value: money(data.avg_commission), bg: 'linear-gradient(135deg,#e65100,#f57c00)' },
            ].map((c, i) => (
              <div key={i} style={{ ...s.statCard, background: c.bg }}>
                <div style={s.statLabel}>{c.label}</div>
                <div style={s.statValue}>{c.value}</div>
              </div>
            ))}
          </div>
          <div style={s.infoBox}>
            <strong>Platform Commission Rate: 15%</strong>
            <p style={s.infoText}>Workers receive 85% of the agreed rate. KaziConnect retains 15% as a service fee on each completed job.</p>
          </div>
        </>
      )}
    </div>
  );
}

const s = {
  page: { padding: '24px', fontFamily: 'Poppins, sans-serif' },
  title: { fontSize: '1.4rem', fontWeight: 700, color: '#111', marginBottom: '20px' },
  error: { background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
  empty: { textAlign: 'center', color: '#666', padding: '40px 0' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' },
  statCard: { borderRadius: '12px', padding: '18px', color: '#fff' },
  statLabel: { fontSize: '0.8rem', opacity: 0.85, marginBottom: '6px' },
  statValue: { fontSize: '1.5rem', fontWeight: 800 },
  infoBox: { background: '#f0faf9', borderRadius: '10px', padding: '16px 20px', color: '#333' },
  infoText: { color: '#555', fontSize: '0.9rem', marginTop: '6px' },
};
