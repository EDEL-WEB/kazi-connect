import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../api/endpoints';

export default function SendSMS() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await adminAPI.sendSms(form);
      setSuccess('SMS sent successfully!');
      setForm({ phone: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send SMS.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate('/admin/sms')}>← SMS Center</button>
      <div style={s.card}>
        <h2 style={s.title}>Send SMS</h2>
        {error && <div style={s.error}>{error}</div>}
        {success && <div style={s.success}>{success}</div>}
        <form onSubmit={handleSubmit}>
          <label style={s.label}>Phone Number</label>
          <input style={s.input} type="tel" placeholder="+254712345678" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
          <label style={s.label}>Message</label>
          <textarea style={s.textarea} rows={4} placeholder="Type your message…" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
          <div style={s.charCount}>{form.message.length}/160 characters</div>
          <button style={s.btn} type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send SMS'}</button>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '480px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  title: { fontSize: '1.3rem', fontWeight: 700, color: '#111', marginBottom: '20px' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.9rem' },
  success: { background: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.9rem' },
  label: { display: 'block', fontWeight: 600, fontSize: '0.9rem', color: '#333', marginBottom: '6px' },
  input: { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', marginBottom: '16px' },
  textarea: { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', marginBottom: '4px', resize: 'vertical' },
  charCount: { fontSize: '0.8rem', color: '#888', marginBottom: '16px', textAlign: 'right' },
  btn: { width: '100%', padding: '12px', background: '#148477', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' },
};
