import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import './Auth.css';

// Demo users — replace with real Supabase auth when keys are configured
const DEMO_USERS = {
    'customer@demo.com': { password: 'demo123', role: 'customer', name: 'Arun Kumar' },
    'rider@demo.com': { password: 'demo123', role: 'rider', name: 'Vikram Singh' },
};

export default function Auth() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const defaultRole = searchParams.get('role') || 'customer';

    const [email, setEmail] = useState(`${defaultRole}@demo.com`);
    const [password, setPassword] = useState('demo123');
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        await new Promise(r => setTimeout(r, 600)); // simulate network

        const user = DEMO_USERS[email.toLowerCase()];
        if (!user || user.password !== password) {
            setError('Invalid email or password.');
            setLoading(false);
            return;
        }

        // Store session in localStorage (replace with Supabase session)
        localStorage.setItem('drovexo_user', JSON.stringify({ email, role: user.role, name: user.name }));
        navigate(`/${user.role}`);
    }

    return (
        <div className="auth-page">
            <div className="auth-bg-glow" aria-hidden="true" />

            <div className="auth-card card">
                <Link to="/" className="auth-back">
                    ← Back to home
                </Link>

                <div className="auth-logo">
                    <span>⚡</span>
                    <span>Dro\/ex0</span>
                </div>

                <h1 className="auth-title">Welcome back</h1>
                <p className="auth-sub">Sign in to your account to continue</p>

                {/* Demo hint */}
                <div className="auth-demo-box">
                    <p className="auth-demo-label">Demo credentials</p>
                    <div className="auth-demo-roles">
                        {Object.entries(DEMO_USERS).map(([e, u]) => (
                            <button
                                key={e}
                                type="button"
                                className={`auth-demo-btn ${email === e ? 'active' : ''}`}
                                onClick={() => { setEmail(e); setPassword(u.password); }}
                            >
                                {u.role}
                            </button>
                        ))}
                    </div>
                </div>

                <form className="auth-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="auth-email">Email</label>
                        <div className="input-wrap">
                            <Mail size={16} className="input-icon" />
                            <input
                                id="auth-email"
                                type="email"
                                className="form-input input-icon-pad"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="auth-password">Password</label>
                        <div className="input-wrap">
                            <Lock size={16} className="input-icon" />
                            <input
                                id="auth-password"
                                type={showPw ? 'text' : 'password'}
                                className="form-input input-icon-pad input-icon-pad-right"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                            <button type="button" className="input-eye" onClick={() => setShowPw(p => !p)}>
                                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {error && <p className="auth-error">{error}</p>}

                    <button type="submit" className="btn btn-primary auth-submit" disabled={loading} id="login-btn">
                        {loading ? <span className="spinner" /> : <>Sign in <ArrowRight size={16} /></>}
                    </button>

                    {email.includes('rider') ? (
                        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', margin: '12px 0 0' }}>
                            Want to join the fleet?{' '}
                            <Link to="/rider-signup" style={{ color: 'var(--teal)', fontWeight: 600 }}>Apply as rider</Link>
                        </p>
                    ) : (
                        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', margin: '12px 0 0' }}>
                            New customer?{' '}
                            <Link to="/signup" style={{ color: 'var(--amber)', fontWeight: 600 }}>Create an account</Link>
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
