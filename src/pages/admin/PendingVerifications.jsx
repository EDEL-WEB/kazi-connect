import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verificationAPI } from '../../api/endpoints';

export default function PendingVerifications() {
  const navigate = useNavigate();
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verificationAPI.adminPending()
      .then(r => setVerifications(Array.isArray(r.data) ? r.data : r.data?.verifications || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const scoreColor = (s) => s >= 80 ? '#2e7d32' : s >= 60 ? '#e65100' : '#c62828';

  return (
    <div style={s.page}>
      <h2 style={s.title}>Pending Verifications</h2>
      {loading && <div style={s.empty}>Loading...</div>}
      {!loading && verifications.length === 0 && <div style={s.empty}>✅ No pending verifications.</div>}
      {verifications.length > 0 && (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead><tr>{['Worker', 'Score', 'ID', 'Phone', 'Selfie', 'Skills', 'Submitted', 'Action'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
            <tbody>
              {verifications.map(v => (
                <tr key={v.id} style={s.tr}>
                  <td style={s.td}><strong>{v.worker_name || v.worker_id}</strong></td>
                  <td style={{ ...s.td, color: scoreColor(v.overall_score), fontWeight: 700 }}>{v.overall_score}/100</td>
                  <td style={s.td}>{v.id_verified ? '✅' : '❌'}</td>
                  <td style={s.td}>{v.phone_verified ? '✅' : '❌'}</td>
                  <td style={s.td}>{v.face_verified ? '✅' : '❌'}</td>
                  <td style={s.td}>{v.skill_verified ? '✅' : '❌'}</td>
                  <td style={s.td}>{fmt(v.created_at)}</td>
                  <td style={s.td}><button style={s.reviewBtn} onClick={() => navigate(`/admin/verifications/${v.id}`)}>Review</button></td>
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
  reviewBtn: { padding: '5px 12px', background: '#148477', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 },
};
