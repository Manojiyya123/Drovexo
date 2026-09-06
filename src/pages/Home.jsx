import { Link } from 'react-router-dom';
import { Package, Bike, Shield, ArrowRight, Zap, MapPin, TrendingUp } from 'lucide-react';
import './Home.css';

const stats = [
    { label: 'Avg. Delivery Time', value: '30 min' },
    { label: 'Drops Completed', value: '50+' },
    { label: 'Rate per km', value: '₹10' },
];

const features = [
    {
        icon: <Zap size={22} />,
        title: 'Instant Dispatch',
        desc: 'Orders are assigned to the nearest available rider in seconds.',
    },
    {
        icon: <MapPin size={22} />,
        title: 'Simple Pricing',
        desc: 'Transparent ₹10/km pricing. No surge, no hidden fees.',
    },
    {
        icon: <TrendingUp size={22} />,
        title: 'Rider-First',
        desc: 'Riders earn a great share from every delivery they complete.',
    },
];

const roles = [
    {
        icon: <Package size={28} />,
        title: 'I need a delivery',
        sub: 'Customer',
        desc: 'Place an order and track it live.',
        link: '/login?role=customer',
        color: 'amber',
    },
    {
        icon: <Bike size={28} />,
        title: 'I want to deliver',
        sub: 'Rider',
        desc: 'Accept orders and earn on every delivery you complete.',
        link: '/rider-signup',
        color: 'teal',
    },
];

export default function Home() {
    return (
        <div className="home">
            {/* NAV */}
            <nav className="home-nav">
                <div className="container home-nav-inner">
                    <div className="home-logo">
                        <span className="logo-icon">⚡</span>
                        <span className="logo-text">Dro\/ex0</span>
                    </div>
                    <Link to="/login" className="btn btn-primary">
                        Get Started <ArrowRight size={16} />
                    </Link>
                </div>
            </nav>

            {/* HERO */}
            <section className="hero">
                <div className="hero-bg-grid" aria-hidden="true" />
                <div className="hero-glow" aria-hidden="true" />
                <div className="container hero-content">
                    <div className="hero-badge animate-fade-up">
                        <span className="badge-dot" />
                        Now live in your city
                    </div>
                    <h1 className="hero-title animate-fade-up" style={{ animationDelay: '0.1s' }}>
                        Delivery that moves<br />
                        <span className="hero-highlight">at the speed of trust</span>
                    </h1>
                    <p className="hero-sub animate-fade-up" style={{ animationDelay: '0.2s' }}>
                        Drovexo connects customers with local riders for fast, affordable deliveries.
                        Simple pricing. Fair rider earnings. Real results.
                    </p>
                    <div className="hero-actions animate-fade-up" style={{ animationDelay: '0.3s' }}>
                        <Link to="/login" className="btn btn-primary btn-lg">
                            Place a Delivery <ArrowRight size={18} />
                        </Link>
                        <Link to="/rider-signup" className="btn btn-ghost btn-lg">
                            Become a Rider
                        </Link>
                    </div>

                    {/* STATS */}
                    <div className="hero-stats animate-fade-up" style={{ animationDelay: '0.4s' }}>
                        {stats.map((s) => (
                            <div key={s.label} className="stat-item">
                                <span className="stat-value">{s.value}</span>
                                <span className="stat-label">{s.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="hero-kural animate-fade-up" style={{ animationDelay: '0.5s' }}>

                        <div style={{ flex: 1, position: 'relative', zIndex: 2 }}>
                            <p style={{ fontStyle: 'italic', color: 'var(--amber)', marginBottom: '12px', fontSize: '16px', lineHeight: '1.6' }}>
                                "வினைக்குரிமை நாடிய பின்றை அவனை<br />
                                அதற்குரிய னாகச் செயல்."
                            </p>
                            <p style={{ fontSize: '13.5px', color: '#ffffff', fontWeight: 600, letterSpacing: '0.5px', textAlign: 'left' }}>
                                “Think before you act; once you act, move forward.”
                            </p>
                            <p style={{ fontSize: '14px', color: 'var(--amber)', fontWeight: 700, fontStyle: 'italic', textAlign: 'right', marginTop: '4px' }}>
                                ~குறள் 517
                            </p>
                        </div>


                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">How it works</h2>
                        <p className="section-sub">From order to doorstep in three steps</p>
                    </div>
                    <div className="steps-grid">
                        {[
                            { n: '01', title: 'Place order', desc: 'Enter pickup & delivery address and distance.' },
                            { n: '02', title: 'Rider accepts', desc: 'A nearby rider picks up and is on the way.' },
                            { n: '03', title: 'Pay on delivery', desc: 'Hand cash to the rider upon delivery.' },
                        ].map((step) => (
                            <div key={step.n} className="step-card card">
                                <div className="step-number">{step.n}</div>
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-desc">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="section section-alt">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Why Drovexo?</h2>
                    </div>
                    <div className="features-grid">
                        {features.map((f) => (
                            <div key={f.title} className="feature-card card">
                                <div className="feature-icon">{f.icon}</div>
                                <h3 className="feature-title">{f.title}</h3>
                                <p className="feature-desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ROLE SELECTOR */}
            <section className="section" id="choose-role">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Choose your role</h2>
                        <p className="section-sub">Select how you use Drovexo</p>
                    </div>
                    <div className="roles-grid">
                        {roles.map((r) => (
                            <Link key={r.title} to={r.link} className={`role-card card role-${r.color}`}>
                                <div className={`role-icon-wrap role-icon-${r.color}`}>{r.icon}</div>
                                <div className={`role-badge badge badge-${r.color === 'amber' ? 'customer' : r.color === 'teal' ? 'rider' : 'admin'}`}>
                                    {r.sub}
                                </div>
                                <h3 className="role-title">{r.title}</h3>
                                <p className="role-desc">{r.desc}</p>
                                <div className="role-arrow">
                                    <ArrowRight size={18} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="home-footer">
                <div className="container home-footer-inner">
                    <div className="home-logo">
                        <span className="logo-icon">⚡</span>
                        <span className="logo-text">Dro\/ex0</span>
                    </div>
                    <p className="footer-text">© 2026 Drovexo. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
