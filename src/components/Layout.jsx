import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ChevronRight } from 'lucide-react';
import './Layout.css';

export default function Layout({ children, role, title, subtitle }) {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('drovexo_user') || '{}');

    function logout() {
        localStorage.removeItem('drovexo_user');
        navigate('/');
    }

    const navLinks = {
        customer: [
            { to: '/customer', label: 'Dashboard' },
            { to: '/customer/order/new', label: 'New Drop' },
            { to: '/customer/orders', label: 'Drop History' },
        ],
        rider: [
            { to: '/rider', label: 'Dashboard' },
            { to: '/rider/earnings', label: 'Earnings' },
        ],
        admin: [
            { to: '/admin/dashboard', label: 'Dashboard' },
            { to: '/admin/customers', label: 'Customers' },
            { to: '/admin/riders', label: 'Riders' },
            { to: '/admin/report', label: 'Revenue Report' },
            { to: '/admin/orders', label: 'All Drops' },
        ],
    };

    const roleColor = { customer: 'amber', rider: 'teal', admin: 'purple' }[role];

    return (
        <div className="layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <Link to="/" className="sidebar-logo">
                        <span>⚡</span>
                        <span>Dro\/ex0</span>
                    </Link>
                    <span className={`badge badge-${role === 'customer' ? 'customer' : role === 'rider' ? 'rider' : 'admin'}`}>
                        {role}
                    </span>
                </div>
                <nav className="sidebar-nav">
                    {(navLinks[role] || []).map(link => (
                        <Link key={link.to} to={link.to} className="sidebar-link">
                            <ChevronRight size={14} />
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className={`sidebar-avatar sidebar-avatar-${roleColor}`}>
                            {(user.name || 'U')[0].toUpperCase()}
                        </div>
                        <div className="sidebar-user-info">
                            <span className="sidebar-user-name">{user.name || 'User'}</span>
                            <span className="sidebar-user-email">{user.email || ''}</span>
                        </div>
                    </div>
                    <button className="sidebar-logout" onClick={logout} id="logout-btn">
                        <LogOut size={16} />
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="main-content">
                <header className="page-header">
                    <div>
                        <h1 className="page-title">{title}</h1>
                        {subtitle && <p className="page-sub">{subtitle}</p>}
                    </div>
                </header>
                <div className="page-body">
                    {children}
                </div>
            </main>
        </div>
    );
}
