import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, jobsAPI } from '../../api/endpoints';

export default function Disputes() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.allJobs({ status: 'disputed' })
      .then(r => setJobs(Array.isArray(r.data) ? r.data : r.data?.jobs || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const money = (v) => v != null ? `KSh ${Number(v).toLocaleString()}` : '—';

  return (
    <div style={s.page}>
      <h2 style={s.title}>Disputes</h2>
      {loading && <div style={s.empty}>Loading...</div>}
      {!loading && jobs.length === 0 && <div style={s.empty}>✅ No active disputes.</div>}
      {jobs.length > 0 && (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead><tr>{['Job', 'Location', 'Amount', 'Date', 'Action'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
            <tbody>
              {jobs.map(j => (
                <tr key={j.id} style={s.tr}>
                  <td style={s.td}><strong>{j.title}</strong></td>
                  <td style={s.td}>{j.location}</td>
                  <td style={s.td}>{money(j.budget)}</td>
                  <td style={s.td}>{fmt(j.created_at)}</td>
                  <td style={s.td}><button style={s.resolveBtn} onClick={() => navigate(`/admin/disputes/${j.id}`)}>Resolve</button></td>
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
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
  th: { padding: '12px 16px', background: '#f5f5f5', textAlign: 'left', fontSize: '0.85rem', fontWeight: 700, color: '#555' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px 16px', fontSize: '0.88rem', color: '#333' },
  resolveBtn: { padding: '5px 12px', background: '#e65100', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 },
};
