import React from 'react';

const createPlaceholderPage = (title, description = '', features = []) => {
  return () => (
    <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>{title}</h1>
      {description && <p style={{ fontSize: '16px', color: '#666', marginTop: '10px' }}>{description}</p>}
      
      {features.length > 0 && (
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h3>Available Features:</h3>
          <ul>
            {features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px', textAlign: 'center', color: '#00695c' }}>
        <p>🔨 This page is under development</p>
        <p>Full implementation coming soon...</p>
      </div>
    </div>
  );
};

export default createPlaceholderPage;
