import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        // Mock authentication delay
        await new Promise(r => setTimeout(r, 1200));
        navigate('/admin/dashboard');
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-base)',
            padding: '24px'
        }}>
            <div className="card" style={{ maxWidth: '420px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '150px', height: '150px', background: 'var(--amber)', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.15 }} />

                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(245,158,11,0.1)', color: 'var(--amber)', marginBottom: '16px' }}>
                        <Shield size={32} />
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Drovexo Admin</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Secure portal for operations management</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-group">
                        <label className="form-label">Admin Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                name="email"
                                required
                                className="form-input"
                                style={{ paddingLeft: '44px' }}
                                placeholder="admin@drovexo.com"
                                value={credentials.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                name="password"
                                required
                                className="form-input"
                                style={{ paddingLeft: '44px' }}
                                placeholder="••••••••"
                                value={credentials.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ marginTop: '8px', justifyContent: 'center', width: '100%', padding: '14px' }}
                    >
                        {loading ? <span className="spinner" /> : <>Access System <ArrowRight size={18} /></>}
                    </button>
                </form>
            </div>
        </div>
    );
}
