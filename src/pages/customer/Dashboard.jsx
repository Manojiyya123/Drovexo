import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, TrendingUp, PlusCircle, User, Phone, MapPin, XCircle, CheckCircle } from 'lucide-react';
import MobileLayout from '../../components/MobileLayout';

const INITIAL_ORDERS = [
    {
        id: 'ORD-001', pickup: '123 Market St', delivery: '456 Rose Ave', distance: 4, price: 40, status: 'delivered',
        createdAt: '2026-08-28 10:30 AM', acceptedAt: '2026-08-28 10:35 AM', riderName: 'Vikram Singh', riderPhone: '9876543210'
    },
    {
        id: 'ORD-002', pickup: '78 Park Road', delivery: '22 Lake View', distance: 7, price: 70, status: 'accepted',
        createdAt: '2026-08-29 02:15 PM', acceptedAt: '2026-08-29 02:20 PM', riderName: 'Rahul Kumar', riderPhone: '9123456789'
    },
    {
        id: 'ORD-003', pickup: '11 Temple Lane', delivery: '88 Bridge St', distance: 2, price: 20, status: 'in_progress',
        createdAt: '2026-08-29 04:00 PM', acceptedAt: null, riderName: null, riderPhone: null
    },
    {
        id: 'ORD-004', pickup: '45 Sunset Blvd', delivery: '102 Main St', distance: 5, price: 50, status: 'pending',
        createdAt: '2026-08-29 03:00 PM', acceptedAt: '2026-08-29 03:05 PM', riderName: 'Suresh Menon', riderPhone: '9988776655'
    },
    {
        id: 'ORD-005', pickup: '99 North St', delivery: '11 South St', distance: 3, price: 30, status: 'canceled',
        createdAt: '2026-08-29 01:00 PM', acceptedAt: null, riderName: null, riderPhone: null
    }
];

const STATUS_MAP = {
    in_progress: { label: 'Requesting', cls: 'badge-requesting' },
    accepted: { label: 'Waiting to Pickup', cls: 'badge-waiting' },
    pending: { label: 'Pending (Picked up, driving)', cls: 'badge-pending' },
    delivered: { label: <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> Delivered</div>, cls: 'badge-done' },
    canceled: { label: 'Canceled', cls: 'badge-canceled', style: {} },
};

export default function CustomerDashboard() {
    const user = JSON.parse(localStorage.getItem('drovexo_user') || '{}');
    const [orders, setOrders] = useState(INITIAL_ORDERS);

    const active = orders.filter(o => o.status !== 'delivered' && o.status !== 'canceled');
    const totalSpend = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.price, 0);

    const handleCancel = (id) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'canceled' } : o));
        }
    };

    return (
        <MobileLayout role="customer" title={`Hello, ${user.name?.split(' ')[0] || 'Customer'} 👋`} subtitle="Your deliveries">
            {/* Stats */}
            <div className="stats-row">
                <div className="stat-card card">
                    <div className="stat-card-icon stat-icon-amber"><Package size={20} /></div>
                    <div>
                        <div className="stat-card-value">{orders.length}</div>
                        <div className="stat-card-label">Total Drops</div>
                    </div>
                </div>
                <div className="stat-card card">
                    <div className="stat-card-icon stat-icon-teal"><Clock size={20} /></div>
                    <div>
                        <div className="stat-card-value">{active.length}</div>
                        <div className="stat-card-label">Active</div>
                    </div>
                </div>
                <div className="stat-card card">
                    <div className="stat-card-icon stat-icon-green"><TrendingUp size={20} /></div>
                    <div>
                        <div className="stat-card-value">₹{totalSpend}</div>
                        <div className="stat-card-label">Total Spent</div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <Link to="/customer/order/new" className="btn btn-primary new-order-btn" id="new-order-btn">
                <PlusCircle size={18} /> Place New Order
            </Link>

            {/* Recent Orders */}
            <div className="section-block">
                <div className="section-block-header">
                    <h2 className="section-block-title">Recent Drops</h2>
                    <Link to="/customer/orders" style={{ fontSize: '13px', color: 'var(--amber)' }}>View all</Link>
                </div>
                <div className="orders-list">
                    {orders.slice(0, 3).map(o => (
                        <div key={o.id} className="order-row card" style={{ padding: '16px', gap: '12px', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <span className="order-id" style={{ fontSize: '15px' }}>Drop: {o.id}</span>
                                <span className={`badge ${STATUS_MAP[o.status].cls}`} style={STATUS_MAP[o.status].style || {}}>
                                    {STATUS_MAP[o.status].label}
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                                <span className="order-route" style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', lineHeight: 1.4 }}>
                                    <MapPin size={12} style={{ color: 'var(--amber)', marginTop: 2, flexShrink: 0 }} />
                                    <span style={{ wordBreak: 'break-word' }}>{o.pickup} → {o.delivery}</span>
                                </span>
                                <span className="order-dist" style={{ whiteSpace: 'nowrap', fontWeight: 600, color: 'var(--text-primary)' }}>₹{o.price}</span>
                            </div>

                            {/* Conditional Rider Info */}
                            {o.status === 'accepted' && o.riderName && (
                                <>
                                    <div className="divider" style={{ margin: '8px 0' }} />
                                    <div style={{ background: 'var(--bg-elevated)', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <User size={14} style={{ color: 'var(--teal)' }} />
                                            <span style={{ fontSize: '13px' }}>{o.riderName}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Phone size={14} style={{ color: 'var(--green)' }} />
                                            <span style={{ fontSize: '13px' }}>{o.riderPhone}</span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Cancel Button */}
                            {(o.status === 'in_progress' || o.status === 'accepted') && (
                                <button
                                    onClick={() => handleCancel(o.id)}
                                    style={{
                                        marginTop: '8px', padding: '8px', borderRadius: '6px', border: '1px solid #d32f2f',
                                        color: '#d32f2f', background: 'transparent', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', gap: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer'
                                    }}
                                >
                                    <XCircle size={14} /> Cancel Drop
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </MobileLayout>
    );
}
