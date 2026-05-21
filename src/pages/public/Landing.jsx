import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Landing.css';

const services = [
  { icon: '🔧', label: 'Plumbing', desc: 'Pipes, leaks & installations' },
  { icon: '⚡', label: 'Electrical', desc: 'Wiring, sockets & repairs' },
  { icon: '🪚', label: 'Carpentry', desc: 'Furniture & woodwork' },
  { icon: '🎨', label: 'Painting', desc: 'Interior & exterior' },
  { icon: '🧹', label: 'Cleaning', desc: 'Deep clean & maintenance' },
  { icon: '🔩', label: 'Mechanical', desc: 'Vehicle & machinery' },
];

const steps = [
  { n: '01', title: 'Post a Job', desc: 'Describe what you need — takes under 2 minutes.', color: '#00897b' },
  { n: '02', title: 'Get Matched', desc: 'Verified workers near you respond with rates.', color: '#1976d2' },
  { n: '03', title: 'Pay Securely', desc: 'Funds held in escrow until you approve the work.', color: '#7b1fa2' },
  { n: '04', title: 'Job Done', desc: 'Release payment and leave a review.', color: '#e65100' },
];

const trust = [
  { icon: '🔐', label: 'Escrow Payments', desc: 'Money held safely until you\'re satisfied' },
  { icon: '✅', label: 'Verified Workers', desc: 'ID-checked and background-screened' },
  { icon: '📍', label: 'Live GPS Tracking', desc: 'Know exactly where your worker is' },
  { icon: '📱', label: 'SMS & USSD', desc: 'Works even without a smartphone' },
  { icon: '🌐', label: 'Works Offline', desc: 'No internet? No problem' },
  { icon: '🛡️', label: 'Dispute Resolution', desc: '24/7 support team on standby' },
];

const testimonials = [
  { name: 'Amina W.', role: 'Homeowner, Nairobi', text: 'Found a plumber in 20 minutes. Payment was held until I confirmed the job was done. Total peace of mind.', avatar: 'A' },
  { name: 'James K.', role: 'Electrician, Mombasa', text: 'I get consistent work through KaziConnect. The escrow system means I always get paid on time.', avatar: 'J' },
  { name: 'Grace M.', role: 'Property Manager', text: 'Managing repairs across 3 buildings used to be a nightmare. KaziConnect made it simple.', avatar: 'G' },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroRef, heroVisible] = useInView(0.1);
  const [stepsRef, stepsVisible] = useInView();
  const [servicesRef, servicesVisible] = useInView();
  const [trustRef, trustVisible] = useInView();
  const [testimonialsRef, testimonialsVisible] = useInView();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="lp">
      {/* ── NAV ── */}
      <nav className={`lp-nav ${scrolled ? 'lp-nav--scrolled' : ''}`}>
        <div className="lp-nav__inner">
          <Link to="/" className="lp-nav__logo">
            <span className="lp-nav__logo-kazi">Kazi</span>Connect
          </Link>
          <div className={`lp-nav__links ${menuOpen ? 'lp-nav__links--open' : ''}`}>
            <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
            <a href="#trust" onClick={() => setMenuOpen(false)}>Why us</a>
            <button className="lp-btn lp-btn--ghost" onClick={() => { navigate('/login'); setMenuOpen(false); }}>Log in</button>
            <button className="lp-btn lp-btn--primary" onClick={() => { navigate('/register'); setMenuOpen(false); }}>Get started</button>
          </div>
          <button className="lp-nav__burger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="lp-hero" ref={heroRef}>
        <div className={`lp-hero__content ${heroVisible ? 'lp--visible' : ''}`}>
          <span className="lp-hero__pill">🇰🇪 Kenya's #1 Home Services Platform</span>
          <h1 className="lp-hero__h1">
            Skilled workers,<br />
            <span className="lp-hero__accent">at your door.</span>
          </h1>
          <p className="lp-hero__sub">
            Book verified plumbers, electricians, carpenters and more — with secure escrow payments and real-time tracking.
          </p>
          <div className="lp-hero__cta">
            <button className="lp-btn lp-btn--primary lp-btn--lg" onClick={() => navigate('/register')}>
              Book a service
            </button>
            <button className="lp-btn lp-btn--outline-white lp-btn--lg" onClick={() => navigate('/register?role=worker')}>
              Join as a worker
            </button>
          </div>
          <div className="lp-hero__stats">
            <div className="lp-hero__stat"><strong>2,400+</strong><span>Verified workers</span></div>
            <div className="lp-hero__stat-divider" />
            <div className="lp-hero__stat"><strong>18,000+</strong><span>Jobs completed</span></div>
            <div className="lp-hero__stat-divider" />
            <div className="lp-hero__stat"><strong>4.8 ★</strong><span>Average rating</span></div>
          </div>
        </div>
        <div className={`lp-hero__visual ${heroVisible ? 'lp--visible' : ''}`}>
          <div className="lp-hero__card lp-hero__card--main">
            <div className="lp-hero__card-avatar">JK</div>
            <div>
              <div className="lp-hero__card-name">James Kamau</div>
              <div className="lp-hero__card-role">⚡ Electrician · Nairobi</div>
              <div className="lp-hero__card-rating">★★★★★ <span>4.9 (127 jobs)</span></div>
            </div>
            <div className="lp-hero__card-badge">✓ Verified</div>
          </div>
          <div className="lp-hero__card lp-hero__card--escrow">
            <div className="lp-hero__card-icon">🔐</div>
            <div>
              <div className="lp-hero__card-label">Escrow held</div>
              <div className="lp-hero__card-amount">KES 3,500</div>
            </div>
          </div>
          <div className="lp-hero__card lp-hero__card--track">
            <div className="lp-hero__card-icon">📍</div>
            <div>
              <div className="lp-hero__card-label">Worker en route</div>
              <div className="lp-hero__card-eta">ETA 12 min</div>
            </div>
          </div>
        </div>
        <div className="lp-hero__bg-blob" />
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="lp-section lp-how" id="how" ref={stepsRef}>
        <div className="lp-section__inner">
          <div className="lp-section__label">Simple process</div>
          <h2 className="lp-section__h2">How KaziConnect works</h2>
          <p className="lp-section__sub">From posting a job to releasing payment — everything in one place.</p>
          <div className={`lp-steps ${stepsVisible ? 'lp--visible' : ''}`}>
            {steps.map((s, i) => (
              <div className="lp-step" key={i} style={{ '--delay': `${i * 0.1}s` }}>
                <div className="lp-step__num" style={{ background: s.color }}>{s.n}</div>
                <h3 className="lp-step__title">{s.title}</h3>
                <p className="lp-step__desc">{s.desc}</p>
                {i < steps.length - 1 && <div className="lp-step__arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="lp-section lp-services lp-section--alt" id="services" ref={servicesRef}>
        <div className="lp-section__inner">
          <div className="lp-section__label">What we offer</div>
          <h2 className="lp-section__h2">Popular services</h2>
          <p className="lp-section__sub">Hundreds of skilled professionals across every home service category.</p>
          <div className={`lp-services__grid ${servicesVisible ? 'lp--visible' : ''}`}>
            {services.map((s, i) => (
              <div className="lp-service-card" key={i} style={{ '--delay': `${i * 0.08}s` }}
                onClick={() => navigate('/categories')}>
                <div className="lp-service-card__icon">{s.icon}</div>
                <div className="lp-service-card__label">{s.label}</div>
                <div className="lp-service-card__desc">{s.desc}</div>
              </div>
            ))}
          </div>
          <div className="lp-services__more">
            <button className="lp-btn lp-btn--outline" onClick={() => navigate('/categories')}>
              Browse all categories →
            </button>
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section className="lp-section lp-trust" id="trust" ref={trustRef}>
        <div className="lp-section__inner">
          <div className="lp-section__label">Built for trust</div>
          <h2 className="lp-section__h2">Why thousands choose us</h2>
          <div className={`lp-trust__grid ${trustVisible ? 'lp--visible' : ''}`}>
            {trust.map((t, i) => (
              <div className="lp-trust-card" key={i} style={{ '--delay': `${i * 0.08}s` }}>
                <div className="lp-trust-card__icon">{t.icon}</div>
                <div className="lp-trust-card__label">{t.label}</div>
                <div className="lp-trust-card__desc">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="lp-section lp-testimonials lp-section--alt" ref={testimonialsRef}>
        <div className="lp-section__inner">
          <div className="lp-section__label">Real stories</div>
          <h2 className="lp-section__h2">What our users say</h2>
          <div className={`lp-testimonials__grid ${testimonialsVisible ? 'lp--visible' : ''}`}>
            {testimonials.map((t, i) => (
              <div className="lp-testimonial" key={i} style={{ '--delay': `${i * 0.1}s` }}>
                <p className="lp-testimonial__text">"{t.text}"</p>
                <div className="lp-testimonial__author">
                  <div className="lp-testimonial__avatar">{t.avatar}</div>
                  <div>
                    <div className="lp-testimonial__name">{t.name}</div>
                    <div className="lp-testimonial__role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="lp-cta">
        <div className="lp-cta__inner">
          <h2 className="lp-cta__h2">Ready to get started?</h2>
          <p className="lp-cta__sub">Join thousands of customers and workers already on KaziConnect.</p>
          <div className="lp-cta__btns">
            <button className="lp-btn lp-btn--white lp-btn--lg" onClick={() => navigate('/register')}>
              Book a service
            </button>
            <button className="lp-btn lp-btn--outline-white lp-btn--lg" onClick={() => navigate('/register?role=worker')}>
              Become a worker
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-footer__inner">
          <div className="lp-footer__brand">
            <div className="lp-footer__logo"><span>Kazi</span>Connect</div>
            <p>Kenya's trusted platform for home services.</p>
          </div>
          <div className="lp-footer__links">
            <div className="lp-footer__col">
              <div className="lp-footer__col-title">Platform</div>
              <Link to="/categories">Browse Services</Link>
              <Link to="/register">Sign Up</Link>
              <Link to="/login">Log In</Link>
            </div>
            <div className="lp-footer__col">
              <div className="lp-footer__col-title">Company</div>
              <Link to="/about">About</Link>
              <Link to="/faq">FAQ</Link>
              <Link to="/contact">Contact</Link>
            </div>
            <div className="lp-footer__col">
              <div className="lp-footer__col-title">Legal</div>
              <Link to="/terms">Terms</Link>
              <Link to="/privacy">Privacy</Link>
            </div>
          </div>
        </div>
        <div className="lp-footer__bottom">
          © {new Date().getFullYear()} KaziConnect. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
