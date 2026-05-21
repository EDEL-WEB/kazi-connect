import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../api/endpoints';

const statusColor = { pending: '#f59e0b', accepted: '#3b82f6', in_progress: '#8b5cf6', completed: '#10b981', cancelled: '#ef4444', disputed: '#ec4899' };

export default function AllJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    adminAPI.allJobs({ status })
      .then(r => setJobs(Array.isArray(r.data) ? r.data : r.data?.jobs || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status]);

  const money = (v) => v != null ? `KSh ${Number(v).toLocaleString()}` : '—';
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={s.title}>All Jobs</h2>
        <select style={s.select} value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {Object.keys(statusColor).map(st => <option key={st} value={st}>{st.replace('_', ' ')}</option>)}
        </select>
      </div>
      {loading && <div style={s.empty}>Loading...</div>}
      {!loading && jobs.length === 0 && <div style={s.empty}>No jobs found.</div>}
      {jobs.length > 0 && (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead><tr>{['Title', 'Location', 'Status', 'Budget', 'Date', 'Action'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
            <tbody>
              {jobs.map(j => (
                <tr key={j.id} style={s.tr}>
                  <td style={s.td}><strong>{j.title}</strong></td>
                  <td style={s.td}>{j.location}</td>
                  <td style={s.td}><span style={{ ...s.badge, background: (statusColor[j.status] || '#999') + '22', color: statusColor[j.status] || '#999' }}>{j.status?.replace('_', ' ')}</span></td>
                  <td style={s.td}>{money(j.budget)}</td>
                  <td style={s.td}>{fmt(j.created_at)}</td>
                  <td style={s.td}><button style={s.viewBtn} onClick={() => navigate(`/admin/jobs/${j.id}`)}>Monitor</button></td>
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' },
  title: { fontSize: '1.4rem', fontWeight: 700, color: '#111' },
  select: { padding: '9px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' },
  empty: { textAlign: 'center', color: '#666', padding: '40px 0' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
  th: { padding: '12px 16px', background: '#f5f5f5', textAlign: 'left', fontSize: '0.85rem', fontWeight: 700, color: '#555' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px 16px', fontSize: '0.88rem', color: '#333' },
  badge: { padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700, textTransform: 'capitalize' },
  viewBtn: { padding: '5px 12px', background: '#148477', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 },
};
