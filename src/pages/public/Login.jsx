import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../api/endpoints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faLinkedin, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../../login.css';
import order from '../../img/order.svg';
import kazlogo from '../../img/kazlogo.png';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { state } = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success] = useState(state?.message || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const response = await authAPI.login(formData);
      const { token, user } = response.data;
      login(token, user);
      if (user.role === 'worker') {
        if (!user.is_verified && !user.profile_created) {
          navigate('/worker/setup');
        } else if (!user.is_verified) {
          navigate('/verification');
        } else {
          navigate('/worker/dashboard');
        }
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (msg.toLowerCase().includes('verif') || msg.toLowerCase().includes('not active') || msg.toLowerCase().includes('not verified')) {
        setError('Your account is not yet verified. Please check your email for the OTP code.');
      } else {
        setError(msg || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* ── PANEL SIDE (left, on the circle) ── */}
      <div className="login-panel-side">
        <h3>New here?</h3>
        <p>Sign up now and connect with skilled workers or find your next job across Kenya.😊</p>
        <button className="login-panel-btn" onClick={() => navigate('/register')}>Sign Up</button>
        <img src={order} alt="KaziConnect" />
      </div>

      {/* ── FORM SIDE (right) ── */}
      <div className="login-form-side">
        <form className="login-form" onSubmit={handleSubmit}>
          <img src={kazlogo} alt="KaziConnect" style={{ width: '80px', marginBottom: '8px' }} />
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Log in to your KaziConnect account</p>

          {error && (
            <div className="login-error">
              ⚠️ {error}
              {error.includes('not yet verified') && (
                <div style={{ marginTop: '6px' }}>
                  <Link to="/verify-otp" style={{ color: '#c62828', fontWeight: 600, fontSize: '0.82rem' }}>
                    Resend verification code →
                  </Link>
                </div>
              )}
            </div>
          )}
          {success && <div className="login-success">✅ {success}</div>}

          <div className="login-field">
            <span className="login-icon"><FontAwesomeIcon icon={faEnvelope} /></span>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="login-field">
            <span className="login-icon"><FontAwesomeIcon icon={faLock} /></span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <button type="button" className="login-eye" onClick={() => setShowPassword(p => !p)}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? 'Logging in…' : 'Log In'}
          </button>

          <p className="login-register-link">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>

          <p className="login-social-text">Contact us via</p>
          <div className="login-social-row">
            {[faFacebook, faInstagram, faLinkedin, faWhatsapp].map((icon, i) => (
              <a key={i} href="#" className="login-social-icon">
                <FontAwesomeIcon icon={icon} />
              </a>
            ))}
          </div>
        </form>
      </div>

    </div>
  );
}
