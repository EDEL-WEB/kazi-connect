import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authAPI } from '../../api/endpoints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faLinkedin, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { validateForm } from '../../utils/validators';
import '../../register.css';
import work from '../../img/work.svg';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    role: searchParams.get('role') === 'worker' ? 'worker' : 'customer',
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => {
    setFormData({ ...formData, [key]: e.target.value });
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateForm(formData);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      setLoading(true);
      setError('');
      const res = await authAPI.register(formData);
      const user_id = res.data?.user_id || res.data?.user?.id || res.data?.id;
      navigate('/verify-otp', { state: { user_id, email: formData.email, role: formData.role } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { icon: faUser,     key: 'full_name', type: 'text',  placeholder: 'Full Name' },
    { icon: faEnvelope, key: 'email',     type: 'email', placeholder: 'Email' },
    { icon: faPhone,    key: 'phone',     type: 'tel',   placeholder: 'Phone (+254...)' },
  ];

  const errStyle = { color: '#c62828', fontSize: '0.78rem', marginTop: '2px', marginLeft: '14px', alignSelf: 'flex-start' };
  const pwRules = [
    { label: 'At least 8 characters',          test: (v) => v.length >= 8 },
    { label: 'One uppercase letter (A-Z)',      test: (v) => /[A-Z]/.test(v) },
    { label: 'One lowercase letter (a-z)',      test: (v) => /[a-z]/.test(v) },
    { label: 'One number (0-9)',                test: (v) => /[0-9]/.test(v) },
    { label: 'One special character (!@#$%&*)', test: (v) => /[^A-Za-z0-9]/.test(v) },
  ];
  const pwBox = { width: '100%', background: '#f9f9f9', borderRadius: '10px', padding: '10px 14px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' };
  const pwRow = { display: 'flex', alignItems: 'center', gap: '8px' };
  const pwDot = { width: '18px', height: '18px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#fff', fontWeight: 700, flexShrink: 0, transition: 'background 0.2s' };

  return (
    <div className="reg-page">

      {/* ── FORM SIDE (left) ── */}
      <div className="reg-form-side">
        <form className="reg-form" onSubmit={handleSubmit}>
          <h2 className="reg-title">Create Account</h2>
          <p className="reg-subtitle">Join KaziConnect — Kenya's #1 home services platform</p>

          {error && <div className="reg-error">{error}</div>}

          {fields.map(({ icon, key, type, placeholder }) => (
            <div key={key} style={{ width: '100%', maxWidth: '380px' }}>
              <div className="reg-field">
                <span className="reg-icon"><FontAwesomeIcon icon={icon} /></span>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={formData[key]}
                  onChange={set(key)}
                  required={key !== 'country'}
                />
              </div>
              {errors[key] && <p style={errStyle}>{errors[key]}</p>}
            </div>
          ))}

          {/* Password */}
          <div style={{ width: '100%', maxWidth: '380px' }}>
            <div className="reg-field">
              <span className="reg-icon"><FontAwesomeIcon icon={faLock} /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={set('password')}
                required
              />
              <button type="button" className="reg-eye" onClick={() => setShowPassword(p => !p)}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.password && <p style={errStyle}>{errors.password}</p>}
            {formData.password && (
              <div style={{ width: '100%', background: '#f9f9f9', borderRadius: '10px', padding: '10px 14px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {pwRules.map(({ label, test }) => {
                  const passed = test(formData.password);
                  return (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0,
                        background: passed ? '#148477' : '#e0e0e0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.7rem', color: '#fff', fontWeight: 700,
                        transition: 'background 0.2s',
                      }}>
                        {passed ? '✓' : ''}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: passed ? '#148477' : '#888' }}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Role toggle */}
          <div className="reg-role-toggle">
            <button
              type="button"
              className={`reg-role-btn ${formData.role === 'customer' ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, role: 'customer' })}
            >
              🏠 Customer
            </button>
            <button
              type="button"
              className={`reg-role-btn ${formData.role === 'worker' ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, role: 'worker' })}
            >
              👷 Worker
            </button>
          </div>

          <button type="submit" className="reg-submit" disabled={loading}>
            {loading ? 'Signing up…' : 'Sign Up'}
          </button>

          <p className="reg-login-link">
            Already have an account? <Link to="/login">Log in</Link>
          </p>

          <p className="reg-social-text">Contact us via</p>
          <div className="reg-social-row">
            {[faFacebook, faInstagram, faLinkedin, faWhatsapp].map((icon, i) => (
              <a key={i} href="#" className="reg-social-icon">
                <FontAwesomeIcon icon={icon} />
              </a>
            ))}
          </div>
        </form>
      </div>

      {/* ── PANEL SIDE (right, on the green circle) ── */}
      <div className="reg-panel-side">
        <h3>{formData.role === 'worker' ? 'Join as a Worker' : 'Find Services'}</h3>
        <p>
          {formData.role === 'worker'
            ? 'Sign up to offer your skills and connect with customers across Kenya.'
            : 'Book verified workers for any home service — fast, secure, and trusted.'}
        </p>
        <button className="reg-panel-btn" onClick={() => navigate('/login')}>Log In</button>
        <img src={work} alt="KaziConnect" />
      </div>

    </div>
  );
}
