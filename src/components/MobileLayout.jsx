import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import './MobileLayout.css';

const NAV = {
    customer: [
        { to: '/customer', icon: '🏠', label: 'Home' },
        { to: '/customer/order/new', icon: '➕', label: 'New Drop' },
        { to: '/customer/orders', icon: '📋', label: 'Orders' },
    ],
    rider: [
        { to: '/rider', icon: '🏠', label: 'Home' },
        { to: '/rider/drops', icon: '📋', label: 'My Drops' },
        { to: '/rider/earnings', icon: '💰', label: 'Earnings' },
    ],
};

export default function MobileLayout({ children, role, title, subtitle, action }) {
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('drovexo_user') || '{}');
    const links = NAV[role] || [];

    function logout() {
        localStorage.removeItem('drovexo_user');
        navigate('/');
    }

    return (
        <div className="ml-root">
            {/* Top header */}
            <header className="ml-header">
                <div className="ml-header-left">
                    <span className="ml-logo">⚡ Dro\/ex0</span>
                    {subtitle && <span className="ml-sub">{subtitle}</span>}
                </div>
                <div className="ml-header-right">
                    {action}
                    <button className="ml-logout" onClick={logout} id="logout-btn" aria-label="Logout">
                        <LogOut size={18} />
                    </button>
                </div>
            </header>

            {/* Page title */}
            <div className="ml-page-title">
                <h1>{title}</h1>
                <span className={`badge badge-${role === 'customer' ? 'customer' : 'rider'}`}>
                    {user.name || role}
                </span>
            </div>

            {/* Scrollable body */}
            <main className="ml-body">
                {children}
            </main>

            {/* Bottom nav */}
            <nav className="ml-bottom-nav">
                {links.map(link => {
                    const active = location.pathname === link.to;
                    return (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`ml-nav-item ${active ? 'ml-nav-active' : ''}`}
                        >
                            <span className="ml-nav-icon">{link.icon}</span>
                            <span className="ml-nav-label">{link.label}</span>
                        </Link>
                    );
                })}
                <button className="ml-nav-item" onClick={logout}>
                    <span className="ml-nav-icon"><LogOut size={20} /></span>
                    <span className="ml-nav-label">Logout</span>
                </button>
            </nav>
        </div>
    );
}
