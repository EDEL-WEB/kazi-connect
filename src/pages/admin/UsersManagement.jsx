import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../api/endpoints';

export default function UsersManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    adminAPI.allUsers({ search, role })
      .then(r => setUsers(Array.isArray(r.data) ? r.data : r.data?.users || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, role]);

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const roleColor = { customer: '#1976d2', worker: '#2e7d32', admin: '#c62828' };

  return (
    <div style={s.page}>
      <h2 style={s.title}>Users Management</h2>
      <div style={s.filters}>
        <input style={s.search} placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
        <select style={s.select} value={role} onChange={e => setRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="customer">Customer</option>
          <option value="worker">Worker</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      {loading && <div style={s.empty}>Loading...</div>}
      {!loading && users.length === 0 && <div style={s.empty}>No users found.</div>}
      {users.length > 0 && (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead><tr>{['Name', 'Email', 'Role', 'Phone', 'Joined', 'Actions'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={s.tr}>
                  <td style={s.td}><strong>{u.full_name}</strong></td>
                  <td style={s.td}>{u.email}</td>
                  <td style={s.td}><span style={{ ...s.badge, background: (roleColor[u.role] || '#999') + '22', color: roleColor[u.role] || '#999' }}>{u.role}</span></td>
                  <td style={s.td}>{u.phone || '—'}</td>
                  <td style={s.td}>{fmt(u.created_at)}</td>
                  <td style={s.td}><button style={s.viewBtn} onClick={() => navigate(`/admin/users/${u.id}`)}>View</button></td>
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
  filters: { display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' },
  search: { flex: 1, minWidth: '200px', padding: '10px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' },
  select: { padding: '10px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' },
  empty: { textAlign: 'center', color: '#666', padding: '40px 0' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
  th: { padding: '12px 16px', background: '#f5f5f5', textAlign: 'left', fontSize: '0.85rem', fontWeight: 700, color: '#555' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px 16px', fontSize: '0.88rem', color: '#333' },
  badge: { padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700, textTransform: 'capitalize' },
  viewBtn: { padding: '5px 12px', background: '#148477', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 },
};
