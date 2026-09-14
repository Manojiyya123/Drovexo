import { useState } from 'react';
import { User, Phone, MapPin, CheckCircle, Navigation } from 'lucide-react';
import MobileLayout from '../../components/MobileLayout';
import { calculatePrice } from '../../utils/pricing';

const STATUS_MAP = {
    pending: { label: 'Pending (Picked up, driving)', cls: 'badge-pending' },
    accepted: { label: 'Waiting to Pickup', cls: 'badge-waiting' },
    delivered: { label: 'Delivered', cls: 'badge-done' },
};

const INITIAL_DROPS = [
    {
        id: 'ORD-004', pickup: '45 Sunset Blvd', delivery: '102 Main St', distance: 5, price: 50,
        status: 'pending', customerName: 'Suresh Menon', fatherName: 'Ashok Menon', customerPhone: '9988776655',
        receiverName: 'Rahul Kumar', receiverPhone: '9123456789', dropType: 'parcel'
    },
    {
        id: 'ORD-002', pickup: '78 Park Road', delivery: '22 Lake View', distance: 7, price: 70,
        status: 'accepted', customerName: 'Anita Desai', fatherName: 'Karan Desai', customerPhone: '9555566666',
        receiverName: 'Salman Khan', receiverPhone: '9000033333', dropType: 'person'
    },
    {
        id: 'ORD-001', pickup: '123 Market St', delivery: '456 Rose Ave', distance: 4, price: 40, status: 'delivered',
        date: '2026-08-28', dropType: 'parcel'
    },
];

export default function MyDrops() {
    const user = JSON.parse(localStorage.getItem('drovexo_user') || '{}');
    const [drops, setDrops] = useState(INITIAL_DROPS);
    const [collectAmount, setCollectAmount] = useState({});
    const [verifiedDistances, setVerifiedDistances] = useState({});
    const [dropTypeFilter, setDropTypeFilter] = useState('all');

    // Filter drops first
    const filteredDrops = drops.filter(o => dropTypeFilter === 'all' || o.dropType === dropTypeFilter);

    // Sort: Pending -> Accepted -> Delivered
    const sorted = [...filteredDrops].sort((a, b) => {
        const order = { 'pending': 1, 'accepted': 2, 'delivered': 3 };
        return order[a.status] - order[b.status];
    });

    function cancelOrder(orderId) {
        if (window.confirm('Are you sure you want to cancel picking up this order? It will be sent back to other riders.')) {
            setDrops(d => d.filter(o => o.id !== orderId));
            alert('Drop cancelled and returned to the Available pool.');
        }
    }

    function markPickedUp(order) {
        const enteredStr = verifiedDistances[order.id];
        const enteredVal = enteredStr !== undefined && enteredStr !== '' ? parseFloat(enteredStr) : order.distance;

        if (isNaN(enteredVal) || enteredVal < order.distance) {
            alert(`Verified distance cannot be less than the minimum estimated distance (${order.distance} km).`);
            return;
        }

        // Recalculate price in case the distance was increased
        const newPrice = calculatePrice(enteredVal);

        setDrops(d => d.map(o => o.id === order.id ? {
            ...o,
            status: 'pending',
            distance: enteredVal,
            price: newPrice
        } : o));
    }

    function markDelivered(order) {
        const amount = parseFloat(collectAmount[order.id] || order.price);
        setDrops(d => d.map(o => o.id === order.id ? { ...o, status: 'delivered', collected: amount } : o));
    }

    return (
        <MobileLayout role="rider" title="My Drops" subtitle="Your delivery processing">
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
            <div className="section-block">
                <div className="orders-list">
                    {sorted.map(o => (
                        <div key={o.id} className="order-row card" style={{ padding: '16px', gap: '12px', display: 'flex', flexDirection: 'column', marginBottom: 12 }}>
                            {/* Header: ID and Status */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <span className="order-id" style={{ fontSize: '15px' }}>Drop: {o.id}</span>
                                <span className={`badge ${STATUS_MAP[o.status].cls}`} style={STATUS_MAP[o.status].style || {}}>
                                    {o.status === 'delivered' ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> Delivered</div>
                                    ) : STATUS_MAP[o.status].label}
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

                            {/* Conditional Detail Blocks */}
                            {o.status === 'accepted' && (
                                <>
                                    <div className="divider" style={{ margin: '8px 0' }} />
                                    <div style={{ background: 'var(--bg-elevated)', padding: '12px', borderRadius: '8px' }}>
                                        <p style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '8px' }}>CUSTOMER DETAILS (PICKUP)</p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <User size={14} style={{ color: 'var(--amber)' }} />
                                                <span style={{ fontSize: '13px' }}>{o.customerName} (D/O or S/O: {o.fatherName})</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Phone size={14} style={{ color: 'var(--green)' }} />
                                                <span style={{ fontSize: '13px' }}>{o.customerPhone}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group" style={{ width: '100%', marginTop: '12px' }}>
                                        <label className="form-label">Verified Distance (km)</label>
                                        <input
                                            type="number"
                                            inputMode="decimal"
                                            className="form-input"
                                            placeholder={`Min ${o.distance} km`}
                                            value={verifiedDistances[o.id] !== undefined ? verifiedDistances[o.id] : ''}
                                            onChange={e => setVerifiedDistances(prev => ({ ...prev, [o.id]: e.target.value }))}
                                            id={`verify-dist-${o.id}`}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                        <button
                                            className="btn btn-ghost"
                                            style={{ flex: 1, padding: '12px', borderColor: '#d32f2f', color: '#d32f2f', justifyContent: 'center' }}
                                            onClick={() => cancelOrder(o.id)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
                                            onClick={() => markPickedUp(o)}
                                            id={`pickedup-${o.id}`}
                                        >
                                            <Navigation size={16} /> Picked Up
                                        </button>
                                    </div>
                                </>
                            )}

                            {o.status === 'pending' && (
                                <>
                                    <div className="divider" style={{ margin: '8px 0' }} />
                                    <div style={{ background: 'var(--bg-elevated)', padding: '12px', borderRadius: '8px' }}>
                                        <p style={{ fontSize: '12px', fontWeight: 'bold', color: 'rgba(34, 197, 94, 0.8)', marginBottom: '8px' }}>RECEIVER DETAILS (DROPOFF)</p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <User size={14} style={{ color: 'var(--green)' }} />
                                                <span style={{ fontSize: '13px' }}>{o.receiverName}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Phone size={14} style={{ color: 'var(--amber)' }} />
                                                <span style={{ fontSize: '13px' }}>{o.receiverPhone}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group" style={{ width: '100%', marginTop: '12px' }}>
                                        <label className="form-label">Enter collected amount (₹)</label>
                                        <input
                                            type="number"
                                            inputMode="numeric"
                                            className="form-input"
                                            placeholder={`Expected ₹${o.price}`}
                                            value={collectAmount[o.id] || ''}
                                            onChange={e => setCollectAmount(c => ({ ...c, [o.id]: e.target.value }))}
                                            id={`collect-${o.id}`}
                                        />
                                    </div>
                                    <button className="btn btn-primary" onClick={() => markDelivered(o)} id={`deliver-${o.id}`} style={{ marginTop: '4px' }}>
                                        <CheckCircle size={16} /> Mark as Delivered
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </MobileLayout>
    );
}
