import React from 'react';

export default function Unauthorized() {
  return (
    <div style={{ padding: '60px 20px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '72px', color: '#ddd' }}>403</h1>
      <h2>Access Denied</h2>
      <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
        You don't have permission to access this resource.
      </p>
      <a href="/" style={{ padding: '10px 20px', backgroundColor: '#d32f2f', color: 'white', borderRadius: '4px', textDecoration: 'none' }}>
        Go Back Home
      </a>
    </div>
  );
}
