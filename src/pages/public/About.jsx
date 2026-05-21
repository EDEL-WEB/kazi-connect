import React from 'react';

export default function About() {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>About KaziConnect</h1>
      
      <section style={{ marginTop: '30px' }}>
        <h2>Our Mission</h2>
        <p>
          KaziConnect connects skilled household service workers with customers through a secure,
          transparent, and accessible platform. We enable trust through verification, escrow payments,
          and real-time tracking.
        </p>
      </section>

      <section>
        <h2>How Escrow Works</h2>
        <p>
          Customers pay securely into escrow. The amount is held until the job is completed.
          Once satisfied, customers release payment to the worker. If disputes arise, our team mediates.
        </p>
      </section>

      <section>
        <h2>Safety & Trust</h2>
        <ul>
          <li>✅ Verified worker profiles with ID checks</li>
          <li>✅ Worker ratings and reviews</li>
          <li>✅ Secure payment via escrow</li>
          <li>✅ Real-time GPS tracking</li>
          <li>✅ Dispute resolution team</li>
          <li>✅ Customer support available 24/7</li>
        </ul>
      </section>

      <section>
        <h2>Contact Us</h2>
        <p>Email: support@kaziconnect.com</p>
        <p>Phone: +254 700 123 456</p>
      </section>
    </div>
  );
}
