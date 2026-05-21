import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
import "./Index.css";
import logo from "./img/logo.png";
import ad from "./img/ad.jpg";
import { Link } from "react-router-dom";
import plumberImg from "./img/plumber.jpg";
import electricianImg from "./img/electrician.jpg";
import janitorImg from "./img/janitor.jpg";
import carpenterImg from "./img/carpenter.jpg";
import painterImg from "./img/painter.jpg";
import mechanicImg from "./img/mechanic.jpg";

// Real worker photos (people only)
import w_cleaner    from "./img/istockphoto-2221093529-612x612.jpg";
import w_mechanic   from "./img/mechanic.jpg";
import w_plumber    from "./img/plumber.jpg";
import w_electrician from "./img/electrician.jpg";
import w_gardener   from "./img/gardener.jpg";
import w_beauty     from "./img/beauty.jpg";
import w_cctv       from "./img/cctv.jpg";
import w_tvrepair   from "./img/tvrepair.jpg";
import w_t1         from "./img/istockphoto-2203460677-612x612.jpg"; // testimonial 1
import w_t2         from "./img/istockphoto-1994874421-612x612.jpg"; // testimonial 2
import w_t3         from "./img/istockphoto-2231666493-612x612.jpg"; // testimonial 3
import w_join1      from "./img/istockphoto-2209069685-612x612.jpg"; // join worker card
import w_join2      from "./img/customer.jpg";

function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`kc-header ${scrolled ? "kc-header--scrolled" : ""}`}>
      <nav className="kc-nav">
        <a href="/" className="kc-nav__logo">
          <img src={logo} alt="Kazi Connect" />
        </a>
        <ul
          className={`kc-nav__links ${isMobile ? "kc-nav__links--open" : ""}`}
          onClick={() => setIsMobile(false)}
        >
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><Link to="/login" className="kc-nav__cta">Get Started</Link></li>
        </ul>
        <button
          className={`kc-nav__burger ${isMobile ? "open" : ""}`}
          onClick={() => setIsMobile(!isMobile)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </nav>
    </header>
  );
}

function Index() {
  const scrollRef = useRef(null);
  const mapRef = useRef(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setMapVisible(true); },
      { threshold: 0.2 }
    );
    if (mapRef.current) observer.observe(mapRef.current);
    return () => observer.disconnect();
  }, []);

  const workers = [
    { img: w_electrician, role: "Electrician",      rating: "4.9", jobs: 187 },
    { img: w_cleaner,     role: "Cleaner",          rating: "4.8", jobs: 134 },
    { img: w_plumber,     role: "Plumber",          rating: "4.9", jobs: 203 },
    { img: w_gardener,    role: "Gardener",         rating: "4.7", jobs: 89  },
    { img: w_beauty,      role: "Beauty Tech",      rating: "5.0", jobs: 112 },
    { img: w_mechanic,    role: "Mechanic",         rating: "4.8", jobs: 176 },
    { img: w_cctv,        role: "CCTV Installation",rating: "4.9", jobs: 95  },
    { img: w_tvrepair,    role: "TV Repair",        rating: "4.7", jobs: 68  },
  ];

  const testimonials = [
    { img: w_t1, name: "Amina W.",  role: "Homeowner, Nairobi",   text: "Found a plumber in 20 minutes. Payment was held until I confirmed the job was done. Total peace of mind." },
    { img: w_t2, name: "James K.",  role: "Electrician, Mombasa", text: "I get consistent work through KaziConnect. The escrow system means I always get paid on time." },
    { img: w_t3, name: "Grace M.",  role: "Property Manager",     text: "Managing repairs across 3 buildings used to be a nightmare. KaziConnect made it simple." },
  ];

  const Footer = () => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
      const t = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(t);
    }, []);
    return (
      <footer className={`kc-footer ${visible ? "kc-footer--visible" : ""}`}>
        <div className="kc-footer__inner">
          <div className="kc-footer__brand">
            <img src={logo} alt="Kazi Connect" className="kc-footer__logo" />
            <p>Connecting workers and customers seamlessly across Kenya.</p>
          </div>
          <div className="kc-footer__col">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/register?role=worker">Join as Worker</Link>
            <Link to="/login">Join as Customer</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="kc-footer__col">
            <h4>Contact Us</h4>
            <p>support@kaziconnect.com</p>
            <p>+254 700 000 000</p>
          </div>
        </div>
        <div className="kc-footer__bottom">
          &copy; {new Date().getFullYear()} Kazi Connect. All rights reserved.
        </div>
      </footer>
    );
  };

  return (
    <div className="kc-page" id="home">
      <Navbar />

      {/* ── HERO ── */}
      <section className={`kc-hero ${heroVisible ? "kc-hero--visible" : ""}`}>
        <div className="kc-hero__text">
          <span className="kc-hero__pill">🇰🇪 Kenya's Home Services Platform</span>
          <h1>Welcome To<br /><span className="kc-hero__accent">Kazi Connect</span></h1>
          <p>
            Need a trusted fundi, cleaner, electrician, mover, or technician?
            Looking for jobs, clients, or your next hustle opportunity?
            <strong>Kazi Connect</strong> is Kenya's digital marketplace where skilled workers meet real customers — fast, secure, and trusted across all 47 counties.
          </p>
          <div className="kc-hero__btns">
            <Link to="/register?role=worker" className="kc-btn kc-btn--primary">Join as Worker</Link>
            <Link to="/login" className="kc-btn kc-btn--outline">Find Services</Link>
          </div>
          <div className="kc-hero__stats">
            <div className="kc-stat"><strong>2,400+</strong><span>Verified Workers</span></div>
            <div className="kc-stat__divider" />
            <div className="kc-stat"><strong>18K+</strong><span>Jobs Done</span></div>
            <div className="kc-stat__divider" />
            <div className="kc-stat"><strong>4.8★</strong><span>Avg Rating</span></div>
          </div>
        </div>
        <div className="kc-hero__image">
          <img src={ad} alt="Kazi Connect worker" />
          <div className="kc-hero__badge kc-hero__badge--1">
            <span className="kc-badge-check">✓</span>
            <div><strong>Verified Worker</strong><small>ID checked &amp; rated</small></div>
          </div>
          <div className="kc-hero__badge kc-hero__badge--2">
            <span className="kc-badge-lock">🔐</span>
            <div><strong>Secure Escrow</strong><small>Pay after completion</small></div>
          </div>
        </div>
      </section>

      {/* ── WHY SECTION ── */}
      <section className="kc-why" id="about">
        <div className="kc-section__inner">
          <span className="kc-label">Why us</span>
          <h2>Why Join Kazi Connect?</h2>
          <blockquote className="kc-quote">
            Kazi Connect is designed to make work and service access simple, fast, and direct for everyone.
            For workers, the platform provides instant visibility based on skills and location.
            For customers, it's easy to find the right professional — with real reviews, transparent pricing,
            and the ability to compare and hire confidently.
          </blockquote>
          <div className="kc-features">
            {[
              { icon: "🔐", title: "Escrow Payments",    desc: "Money held safely until you're satisfied" },
              { icon: "✅", title: "Verified Workers",   desc: "ID-checked and background-screened" },
              { icon: "📍", title: "Live GPS Tracking",  desc: "Know exactly where your worker is" },
              { icon: "⭐", title: "Trusted Reviews",    desc: "Real ratings from real customers" },
              { icon: "📱", title: "SMS Support",        desc: "Works even without a smartphone" },
              { icon: "🛡️", title: "Dispute Resolution", desc: "24/7 support team on standby" },
            ].map((f, i) => (
              <div className="kc-feature" key={i}>
                <div className="kc-feature__icon">{f.icon}</div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKERS GRID ── */}
      <section className="kc-workers" id="workers">
        <div className="kc-section__inner">
          <span className="kc-label">Our professionals</span>
          <h2>Meet Our Workers</h2>
          <p className="kc-section__sub">Verified, skilled, and ready to help — right in your neighbourhood.</p>
          <div className="kc-workers__grid">
            {workers.map((w, i) => (
              <div className="kc-worker-card" key={i}>
                <div className="kc-worker-card__img-wrap">
                  <img src={w.img} alt={w.role} />
                  <span className="kc-worker-card__verified">Verified</span>
                </div>
                <div className="kc-worker-card__info">
                  <div className="kc-worker-card__role">{w.role}</div>
                  <div className="kc-worker-card__meta">
                    <span className="kc-worker-card__rating">★ {w.rating}</span>
                    <span className="kc-worker-card__jobs">{w.jobs} jobs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAROUSEL ── */}
      <section className="kc-services" id="services">
        <div className="kc-section__inner">
          <span className="kc-label">What we offer</span>
          <h2>Top Categories</h2>
          <p className="kc-section__sub">Hundreds of skilled professionals across every home service category.</p>
          <div className="kc-carousel">
            <button className="kc-carousel__btn kc-carousel__btn--left"
              onClick={() => scrollRef.current.scrollBy({ left: -320, behavior: "smooth" })}>&#8249;</button>
            <div className="kc-carousel__track" ref={scrollRef}>
              {[
                { img: plumberImg,     label: "Plumber" },
                { img: electricianImg, label: "Electrician" },
                { img: janitorImg,     label: "Janitor" },
                { img: carpenterImg,   label: "Carpenter" },
                { img: painterImg,     label: "Painter" },
                { img: mechanicImg,    label: "Mechanic" },
              ].map(({ img, label }) => (
                <div className="kc-carousel__card" key={label}>
                  <img src={img} alt={label} />
                  <div className="kc-carousel__card-label">{label}</div>
                </div>
              ))}
            </div>
            <button className="kc-carousel__btn kc-carousel__btn--right"
              onClick={() => scrollRef.current.scrollBy({ left: 320, behavior: "smooth" })}>&#8250;</button>
          </div>
        </div>
      </section>

      {/* ── MAP ── */}
      <section className={`kc-map ${mapVisible ? "kc-map--visible" : ""}`} ref={mapRef} id="contact">
        <div className="kc-section__inner">
          <span className="kc-label kc-label--light">Coverage</span>
          <h2 className="kc-map__title">Find Services Near You</h2>
          <p className="kc-map__sub">Currently available in these cities across Kenya.</p>
          <div className="kc-map__container">
            <MapContainer
              center={[0.0236, 37.9062]}
              zoom={6}
              style={{ width: "100%", height: "450px", borderRadius: "16px" }}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {[
                { name: "Nairobi",  pos: [-1.2921, 36.8219] },
                { name: "Mombasa",  pos: [-4.0435, 39.6682] },
                { name: "Kisumu",   pos: [-0.1022, 34.7617] },
                { name: "Nakuru",   pos: [-0.3031, 36.0800] },
                { name: "Eldoret",  pos: [0.5143,  35.2698] },
                { name: "Thika",    pos: [-1.0332, 37.0693] },
                { name: "Nyeri",    pos: [-0.4167, 36.9500] },
                { name: "Kisii",    pos: [-0.6817, 34.7667] },
              ].map(({ name, pos }) => (
                <Marker key={name} position={pos}>
                  <Popup>{name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="kc-testimonials">
        <div className="kc-section__inner">
          <span className="kc-label">Real stories</span>
          <h2>What Our Users Say</h2>
          <div className="kc-testimonials__grid">
            {testimonials.map((t) => (
              <div className="kc-testimonial" key={t.name}>
                <p className="kc-testimonial__text">"{t.text}"</p>
                <div className="kc-testimonial__author">
                  <img src={t.img} alt={t.name} className="kc-testimonial__avatar" />
                  <div>
                    <div className="kc-testimonial__name">{t.name}</div>
                    <div className="kc-testimonial__role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOIN SECTION ── */}
      <section className="kc-join">
        <div className="kc-section__inner">
          <span className="kc-label">Get started</span>
          <h2>Join Kazi Connect Today</h2>
          <p className="kc-section__sub">Whether you're looking for work or services, we've got you covered.</p>
          <div className="kc-join__cards">
            <div className="kc-join__card">
              <img src={w_join1} alt="Worker" className="kc-join__card-img" />
              <div className="kc-join__icon">👷</div>
              <h3>As a Worker</h3>
              <p>Sign up to offer your skills and connect with customers in your area.</p>
              <Link to="/register?role=worker" className="kc-btn kc-btn--primary">Join as a Worker</Link>
            </div>
            <div className="kc-join__card kc-join__card--alt">
              <img src={w_join2} alt="Customer" className="kc-join__card-img" />
              <div className="kc-join__icon">🏠</div>
              <h3>As a Customer</h3>
              <p>Find reliable local workers for your tasks and projects easily.</p>
              <Link to="/login" className="kc-btn kc-btn--white">Find Services</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Index;
