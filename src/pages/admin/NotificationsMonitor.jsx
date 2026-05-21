import React, { useState, useEffect } from 'react';
import { notificationsAPI } from '../../api/endpoints';

export default function NotificationsMonitor() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationsAPI.pending()
      .then(r => setNotifications(Array.isArray(r.data) ? r.data : []))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (d) => d ? new Date(d).toLocaleString('en-KE') : '—';

  return (
    <div style={s.page}>
      <h2 style={s.title}>Notifications Monitor</h2>
      {loading && <div style={s.empty}>Loading...</div>}
      {!loading && notifications.length === 0 && <div style={s.empty}>🔔 No pending notifications.</div>}
      {notifications.length > 0 && (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead><tr>{['Type', 'Message', 'User', 'Created'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
            <tbody>
              {notifications.map(n => (
                <tr key={n.id} style={s.tr}>
                  <td style={s.td}><span style={s.typeBadge}>{n.type || n.title}</span></td>
                  <td style={s.td}>{n.message}</td>
                  <td style={s.td}>{n.user_id || '—'}</td>
                  <td style={s.td}>{fmt(n.created_at)}</td>
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
  typeBadge: { background: '#e3f2fd', color: '#1565c0', padding: '3px 10px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 700 },
};
