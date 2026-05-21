import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../../api/endpoints';

export default function FlaggedWorkers() {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobsAPI.flaggedWorkers()
      .then(r => setWorkers(Array.isArray(r.data) ? r.data : r.data?.workers || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={s.page}>
      <h2 style={s.title}>Flagged Workers</h2>
      {loading && <div style={s.empty}>Loading...</div>}
      {!loading && workers.length === 0 && <div style={s.empty}>🚩 No flagged workers.</div>}
      {workers.length > 0 && (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead><tr>{['Worker', 'Email', 'Reason', 'Score', 'Action'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
            <tbody>
              {workers.map(w => (
                <tr key={w.id} style={s.tr}>
                  <td style={s.td}><strong>{w.full_name || w.name}</strong></td>
                  <td style={s.td}>{w.email}</td>
                  <td style={s.td}>{w.flag_reason || '—'}</td>
                  <td style={{ ...s.td, color: '#c62828', fontWeight: 700 }}>{w.verification_score ?? '—'}</td>
                  <td style={s.td}><button style={s.viewBtn} onClick={() => navigate(`/admin/users/${w.id}`)}>View</button></td>
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
  viewBtn: { padding: '5px 12px', background: '#148477', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 },
};
