import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FAQS = [
  { q: 'How does KaziConnect work?', a: 'Post a job, get matched with verified workers near you, pay securely via escrow, and release payment once the work is done.' },
  { q: 'How does escrow payment work?', a: 'When you book a job, your payment is held securely in escrow. The worker only receives the funds after you confirm the job is completed to your satisfaction.' },
  { q: 'How are workers verified?', a: 'Workers go through a multi-step verification: national ID upload, phone verification, facial recognition, and skill document submission. Workers scoring 80+ points are auto-approved.' },
  { q: 'What happens if I\'m not satisfied with the work?', a: 'You can raise a dispute from the job details page. Our support team will review the case and mediate a resolution within 24–48 hours.' },
  { q: 'Can I cancel a job?', a: 'Yes, you can cancel a job while it\'s still pending or accepted. Once a job is in progress, you\'ll need to raise a dispute instead.' },
  { q: 'How do I track my worker?', a: 'Once a job is in progress, you can use the "Track Worker" feature on the job details page to see the worker\'s real-time location.' },
  { q: 'What is the platform commission?', a: 'KaziConnect charges a 15% commission on each completed job. Workers receive 85% of the agreed rate.' },
  { q: 'Does it work without internet?', a: 'Yes! KaziConnect supports offline mode and USSD, so you can access key features even without a smartphone or internet connection.' },
];

export default function FAQ() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate('/')}>← Home</button>
      <div style={s.header}>
        <h1 style={s.title}>Frequently Asked Questions</h1>
        <p style={s.sub}>Everything you need to know about KaziConnect.</p>
      </div>
      <div style={s.list}>
        {FAQS.map((faq, i) => (
          <div key={i} style={s.item}>
            <button style={s.question} onClick={() => setOpen(open === i ? null : i)}>
              <span>{faq.q}</span>
              <span style={s.chevron}>{open === i ? '▲' : '▼'}</span>
            </button>
            {open === i && <div style={s.answer}>{faq.a}</div>}
          </div>
        ))}
      </div>
      <div style={s.cta}>
        <p style={s.ctaText}>Still have questions?</p>
        <button style={s.ctaBtn} onClick={() => navigate('/contact')}>Contact Us</button>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '32px 24px', maxWidth: '720px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' },
  header: { textAlign: 'center', marginBottom: '36px' },
  title: { fontSize: '2rem', fontWeight: 800, color: '#111', marginBottom: '8px' },
  sub: { color: '#666', fontSize: '1rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '40px' },
  item: { background: '#fff', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', overflow: 'hidden' },
  question: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', color: '#111', textAlign: 'left' },
  chevron: { color: '#148477', fontSize: '0.8rem', flexShrink: 0, marginLeft: '12px' },
  answer: { padding: '0 20px 16px', color: '#555', fontSize: '0.9rem', lineHeight: 1.7 },
  cta: { textAlign: 'center' },
  ctaText: { color: '#666', marginBottom: '12px' },
  ctaBtn: { padding: '11px 28px', background: '#148477', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' },
};
