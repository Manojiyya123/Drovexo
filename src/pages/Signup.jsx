import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Users, Phone, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { supabase } from '../services/supabase';
import { hashPassword } from '../utils/hash';
import './Auth.css';
import './Signup.css';

export default function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        gender: 'Male',
        mobile: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (form.mobile.length < 10) {
            setError('Enter a valid 10-digit mobile number.');
            return;
        }

        setLoading(true);

        try {
            const hashedPassword = await hashPassword(form.password);

            // 1. Direct table insert bypassing Supabase Auth
            const { error: dbError } = await supabase.from('customers').insert({
                email: form.email,
                first_name: form.firstName,
                last_name: form.lastName,
                gender: form.gender,
                phone_no: form.mobile,
                password: hashedPassword
            });

            if (dbError) {
                console.error("Profile creation error:", dbError);
                throw new Error(dbError.message || "Failed to create customer profile.");
            }


            // Successfully created.
            // In a real app we'd rely on Supabase session for routing, but here we redirect.
            alert("Account created successfully!");
            navigate('/login');
        } catch (err) {
            setError(err.message || "An error occurred during signup.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-bg-glow" aria-hidden="true" />

            <div className="auth-card card signup-card">
                <Link to="/login" className="auth-back">← Back to login</Link>

                <div className="auth-logo">
                    <span>⚡</span>
                    <span>Dro\/ex0</span>
                </div>

                <h1 className="auth-title">Create account</h1>
                <p className="auth-sub">Sign up as a customer to place deliveries</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="signup-row">
                        <div className="form-group">
                            <label className="form-label" htmlFor="firstName">
                                <User size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                First Name
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                className="form-input"
                                placeholder="Your first name"
                                value={form.firstName}
                                onChange={handleChange}
                                required
                                autoComplete="given-name"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="lastName">
                                <Users size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                Last Name
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                className="form-input"
                                placeholder="Your last name"
                                value={form.lastName}
                                onChange={handleChange}
                                required
                                autoComplete="family-name"
                            />
                        </div>
                    </div>

                    {/* Mobile and Gender Row */}
                    <div className="signup-row">
                        <div className="form-group">
                            <label className="form-label" htmlFor="mobile">
                                <Phone size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                Mobile Number
                            </label>
                            <div className="input-wrap">
                                <span className="mobile-prefix">+91</span>
                                <input
                                    id="mobile"
                                    name="mobile"
                                    type="tel"
                                    inputMode="numeric"
                                    maxLength={10}
                                    className="form-input mobile-input"
                                    placeholder="9876543210"
                                    value={form.mobile}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="gender">
                                <Users size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                Gender
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                className="form-input"
                                value={form.gender}
                                onChange={handleChange}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="su-email">
                            <Mail size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                            Email Address
                        </label>
                        <div className="input-wrap">
                            <Mail size={16} className="input-icon" />
                            <input
                                id="su-email"
                                name="email"
                                type="email"
                                className="form-input input-icon-pad"
                                placeholder="you@email.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="su-password">
                            <Lock size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                            Password
                        </label>
                        <div className="input-wrap">
                            <Lock size={16} className="input-icon" />
                            <input
                                id="su-password"
                                name="password"
                                type={showPw ? 'text' : 'password'}
                                className="form-input input-icon-pad input-icon-pad-right"
                                placeholder="Min. 6 characters"
                                minLength={6}
                                value={form.password}
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
                            />
                            <button type="button" className="input-eye" onClick={() => setShowPw(p => !p)}>
                                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="confirm-password">
                            <Lock size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                            Confirm Password
                        </label>
                        <div className="input-wrap">
                            <Lock size={16} className="input-icon" />
                            <input
                                id="confirm-password"
                                name="confirmPassword"
                                type={showConfirm ? 'text' : 'password'}
                                className="form-input input-icon-pad input-icon-pad-right"
                                placeholder="Repeat password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
                            />
                            <button type="button" className="input-eye" onClick={() => setShowConfirm(p => !p)}>
                                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {error && <p className="auth-error">{error}</p>}

                    <button
                        type="submit"
                        className="btn btn-primary auth-submit"
                        disabled={loading}
                        id="signup-btn"
                    >
                        {loading ? <span className="spinner" /> : <>Create Account <ArrowRight size={16} /></>}
                    </button>

                    <p className="signup-login-link">
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--amber)' }}>Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
