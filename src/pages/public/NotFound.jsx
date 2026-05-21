import React from 'react';

export default function NotFound() {
  return (
    <div style={{ padding: '60px 20px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '72px', color: '#ddd' }}>404</h1>
      <h2>Page Not Found</h2>
      <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a href="/" style={{ padding: '10px 20px', backgroundColor: '#00695c', color: 'white', borderRadius: '4px', textDecoration: 'none' }}>
        Go Back Home
      </a>
    </div>
  );
}
