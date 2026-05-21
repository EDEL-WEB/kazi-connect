import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', background: '#f0f4f8' }}>
      <div style={{ fontSize: 80 }}>🔍</div>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#1a1a1a', margin: '16px 0 8px' }}>404</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>Page not found</p>
      <Link to="/" style={{ background: '#00695c', color: 'white', padding: '12px 28px', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>Go Home</Link>
    </div>
  );
}
