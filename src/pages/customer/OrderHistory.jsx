import { useState } from 'react';
import MobileLayout from '../../components/MobileLayout';
import { User, Phone, MapPin, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

const INITIAL_ORDERS = [
    {
        id: 'ORD-001', pickup: '123 Market St', delivery: '456 Rose Ave', distance: 4, price: 40, status: 'delivered',
        createdAt: '2026-08-28 10:30 AM', acceptedAt: '2026-08-28 10:35 AM', riderName: 'Vikram Singh', riderPhone: '9876543210', dropType: 'parcel'
    },
    {
        id: 'ORD-002', pickup: '78 Park Road', delivery: '22 Lake View', distance: 7, price: 70, status: 'accepted',
        createdAt: '2026-08-29 02:15 PM', acceptedAt: '2026-08-29 02:20 PM', riderName: 'Rahul Kumar', riderPhone: '9123456789', dropType: 'person'
    },
    {
        id: 'ORD-003', pickup: '11 Temple Lane', delivery: '88 Bridge St', distance: 2, price: 20, status: 'in_progress',
        createdAt: '2026-08-29 04:00 PM', acceptedAt: null, riderName: null, riderPhone: null, dropType: 'parcel'
    },
    {
        id: 'ORD-004', pickup: '45 Sunset Blvd', delivery: '102 Main St', distance: 5, price: 50, status: 'pending',
        createdAt: '2026-08-29 03:00 PM', acceptedAt: '2026-08-29 03:05 PM', riderName: 'Suresh Menon', riderPhone: '9988776655', dropType: 'parcel'
    },
    {
        id: 'ORD-005', pickup: '99 North St', delivery: '11 South St', distance: 3, price: 30, status: 'canceled',
        createdAt: '2026-08-29 01:00 PM', acceptedAt: null, riderName: null, riderPhone: null, dropType: 'person'
    }
];

const STATUS_MAP = {
    in_progress: { label: 'Requesting', cls: 'badge-requesting' },
    accepted: { label: 'Waiting to Pickup', cls: 'badge-waiting' },
    pending: { label: 'Pending (Picked up, driving)', cls: 'badge-pending' },
    delivered: { label: <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> Delivered</div>, cls: 'badge-done' },
    canceled: { label: 'Canceled', cls: 'badge-canceled', style: {} },
};

export default function OrderHistory() {
    const [orders, setOrders] = useState(INITIAL_ORDERS);
    const [dropTypeFilter, setDropTypeFilter] = useState('all');

    const handleCancel = (id) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'canceled' } : o));
        }
    };

    const filteredOrders = orders.filter(o => dropTypeFilter === 'all' || o.dropType === dropTypeFilter);

    return (
        <MobileLayout role="customer" title="My Orders" subtitle="All deliveries">
            <div style={{ padding: '0 16px 16px', display: 'flex', gap: '12px' }}>
                <select
                    className="form-input"
                    value={dropTypeFilter}
                    onChange={e => setDropTypeFilter(e.target.value)}
                    style={{ margin: 0 }}
                >
                    <option value="all">All Drops</option>
                    <option value="parcel">Parcel Drops</option>
                    <option value="person">Person Drops</option>
                </select>
            </div>
            <div className="orders-list">
                {filteredOrders.map(o => (
                    <div key={o.id} className="order-row card" style={{ padding: '16px', gap: '12px', display: 'flex', flexDirection: 'column' }}>
                        {/* Header: ID and Status */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <span className="order-id" style={{ fontSize: '15px' }}>Drop: {o.id}</span>
                            <span className={`badge ${STATUS_MAP[o.status].cls}`} style={STATUS_MAP[o.status].style || {}}>
                                {STATUS_MAP[o.status].label}
                            </span>
                        </div>

                        {/* Route & Distance */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                            <span className="order-route" style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', lineHeight: 1.4 }}>
                                <MapPin size={12} style={{ color: 'var(--amber)', marginTop: 2, flexShrink: 0 }} />
                                <span style={{ wordBreak: 'break-word' }}>{o.pickup} → {o.delivery}</span>
                            </span>
                            <span className="order-dist" style={{ whiteSpace: 'nowrap', fontWeight: 600, color: 'var(--text-primary)' }}>₹{o.price} ({o.distance} km)</span>
                        </div>

                        {/* Timestamps */}
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={12} /> Ordered: <br />{o.createdAt}
                            </div>
                            {o.acceptedAt && o.status !== 'canceled' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <CheckCircle size={12} /> Accepted: <br />{o.acceptedAt}
                                </div>
                            )}
                        </div>

                        {/* Conditional Rider Info */}
                        {o.status === 'accepted' && o.riderName && (
                            <>
                                <div className="divider" style={{ margin: '8px 0' }} />
                                <div style={{ background: 'var(--bg-elevated)', padding: '12px', borderRadius: '8px' }}>
                                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '8px' }}>RIDER DETAILS</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <User size={14} style={{ color: 'var(--teal)' }} />
                                            <span style={{ fontSize: '13px' }}>{o.riderName}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Phone size={14} style={{ color: 'var(--green)' }} />
                                            <span style={{ fontSize: '13px' }}>{o.riderPhone}</span>
                                        </div>
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
        </MobileLayout>
    );
}
