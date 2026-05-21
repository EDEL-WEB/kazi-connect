import React from 'react';

export default function Contact() {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Contact Us</h1>
      
      <form style={{ marginTop: '30px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name</label>
          <input type="text" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
          <input type="email" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Message</label>
          <textarea style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '150px' }} />
        </div>

        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#00695c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Send Message
        </button>
      </form>

      <div style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '30px' }}>
        <h3>Other Ways to Reach Us</h3>
        <p>📧 Email: support@kaziconnect.com</p>
        <p>📞 Phone: +254 700 123 456</p>
        <p>💬 WhatsApp: +254 700 123 456</p>
        <p>🕐 Available: 24/7 Support</p>
      </div>
    </div>
  );
}
