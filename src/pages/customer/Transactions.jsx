import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentsAPI } from '../../api/endpoints';

export default function Transactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    paymentsAPI.transactions()
      .then(r => setTransactions(Array.isArray(r.data) ? r.data : r.data?.transactions || []))
      .catch(() => setError('Failed to load transactions.'))
      .finally(() => setLoading(false));
  }, []);

  const money = (v) => v != null ? `KSh ${Number(v).toLocaleString()}` : '—';
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('/wallet')}>← Wallet</button>
        <h2 style={s.title}>Transactions</h2>
      </div>
      {error && <div style={s.error}>{error}</div>}
      {loading && <div style={s.empty}>Loading...</div>}
      {!loading && transactions.length === 0 && <div style={s.empty}>No transactions yet.</div>}
      {transactions.length > 0 && (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead><tr>{['Date', 'Type', 'Amount', 'Status', 'Description'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr key={i} style={s.tr}>
                  <td style={s.td}>{fmt(tx.created_at)}</td>
                  <td style={{ ...s.td, textTransform: 'capitalize' }}>{tx.type || tx.transaction_type}</td>
                  <td style={{ ...s.td, color: tx.type === 'credit' ? '#2e7d32' : '#c62828', fontWeight: 700 }}>
                    {tx.type === 'credit' ? '+' : '-'}{money(tx.amount)}
                  </td>
                  <td style={{ ...s.td, textTransform: 'capitalize' }}>{tx.status}</td>
                  <td style={s.td}>{tx.description || '—'}</td>
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
  page: { padding: '24px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' },
  title: { fontSize: '1.4rem', fontWeight: 700, color: '#111' },
  error: { background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
  empty: { textAlign: 'center', color: '#666', padding: '60px 0' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
  th: { padding: '12px 16px', background: '#f5f5f5', textAlign: 'left', fontSize: '0.85rem', fontWeight: 700, color: '#555' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px 16px', fontSize: '0.9rem', color: '#333' },
};
