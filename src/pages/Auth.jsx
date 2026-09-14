import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../services/supabase';
import './Auth.css';

export default function Auth() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const defaultRole = searchParams.get('role') || 'customer';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Authenticate with Supabase
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            // 2. Determine Role (Check riders table first)
            const { data: riderData } = await supabase
                .from('riders')
                .select('rider_id, first_name, last_name, status')
                .eq('email_id', email)
                .single();

            if (riderData) {
                if (riderData.status !== 'approved') {
                    throw new Error(`Your rider account is currently: ${riderData.status}. You cannot login yet.`);
                }
                localStorage.setItem('drovexo_user', JSON.stringify({
                    email,
                    role: 'rider',
                    name: `${riderData.first_name} ${riderData.last_name || ''}`.trim()
                }));
                navigate('/rider');
                return;
            }

            // 3. Not a rider? Check customers table
            const { data: customerData } = await supabase
                .from('customers')
                .select('first_name, last_name')
                .eq('email', email)
                .single();

            if (customerData) {
                localStorage.setItem('drovexo_user', JSON.stringify({
                    email,
                    role: 'customer',
                    name: `${customerData.first_name} ${customerData.last_name || ''}`.trim()
                }));
                navigate('/customer');
            } else {
                throw new Error("No customer or rider profile found for this authenticated email. Please contact support.");
            }

        } catch (err) {
            setError(err.message || "Invalid email or password.");
        } finally {
            setLoading(false);
        }
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

                {/* Removed Demo Credentials for Security */}

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
