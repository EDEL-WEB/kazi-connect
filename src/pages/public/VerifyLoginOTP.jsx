import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../api/endpoints';

export default function VerifyLoginOTP() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { login } = useAuth();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!state?.user_id) { setError('Session expired. Please log in again.'); return; }
    try {
      setLoading(true);
      setError('');
      const response = await authAPI.verifyLoginOtp({ user_id: state.user_id, otp_code: otp });
      const { token, user } = response.data;
      login(token, user);
      if (user.role === 'worker') {
        if (!user.verification_status) navigate('/worker/setup');
        else if (user.verification_status === 'verified') navigate('/worker/dashboard');
        else navigate('/verification');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>🔐</div>
        <h2 style={styles.title}>Two-Factor Authentication</h2>
        <p style={styles.sub}>Enter the 6-digit code sent to your phone to complete login.</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            required
          />
          <button style={styles.btn} type="submit" disabled={loading || otp.length !== 6}>
            {loading ? 'Verifying...' : 'Confirm Login'}
          </button>
        </form>

        <p style={styles.backText}>
          <button style={styles.link} onClick={() => navigate('/login')}>← Back to login</button>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', fontFamily: 'Poppins, sans-serif' },
  card: { background: '#fff', borderRadius: '16px', padding: '40px 32px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  icon: { fontSize: '2.5rem', marginBottom: '12px' },
  title: { fontSize: '1.6rem', fontWeight: 700, color: '#111', marginBottom: '8px' },
  sub: { color: '#666', fontSize: '0.95rem', marginBottom: '24px' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' },
  input: { width: '100%', padding: '14px', fontSize: '1.6rem', letterSpacing: '0.4em', textAlign: 'center', border: '2px solid #e0e0e0', borderRadius: '10px', outline: 'none', marginBottom: '16px', fontFamily: 'monospace' },
  btn: { width: '100%', padding: '13px', background: '#148477', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' },
  backText: { marginTop: '16px' },
  link: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' },
};
