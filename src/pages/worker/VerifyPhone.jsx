import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verificationAPI } from '../../api/endpoints';

export default function VerifyPhone() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await verificationAPI.verifyPhone({ otp_code: otp });
      navigate('/verification/upload-selfie');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.progress}>Step 2 of 4</div>
        <div style={styles.icon}>📱</div>
        <h2 style={styles.title}>Verify Phone</h2>
        <p style={styles.sub}>Enter the 6-digit code sent to your registered phone. Worth <strong>20 points</strong>.</p>

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
            {loading ? 'Verifying...' : 'Continue →'}
          </button>
        </form>

        <button style={styles.back} onClick={() => navigate('/verification/upload-id')}>← Back</button>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', fontFamily: 'Poppins, sans-serif', padding: '24px' },
  card: { background: '#fff', borderRadius: '16px', padding: '40px 32px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  progress: { fontSize: '0.8rem', color: '#148477', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' },
  icon: { fontSize: '2.2rem', marginBottom: '8px' },
  title: { fontSize: '1.5rem', fontWeight: 700, color: '#111', marginBottom: '6px' },
  sub: { color: '#666', fontSize: '0.9rem', marginBottom: '24px' },
  error: { background: '#ffebee', color: '#c62828', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' },
  input: { width: '100%', padding: '14px', fontSize: '1.6rem', letterSpacing: '0.4em', textAlign: 'center', border: '2px solid #e0e0e0', borderRadius: '10px', outline: 'none', marginBottom: '16px', fontFamily: 'monospace' },
  btn: { width: '100%', padding: '13px', background: '#148477', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginBottom: '12px' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 },
};
