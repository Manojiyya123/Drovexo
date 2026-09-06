import { useState } from 'react';
import { Bike, Package, DollarSign, User, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../../components/MobileLayout';
import { calculateRiderEarning } from '../../utils/pricing';

const STATUS_MAP = {
    in_progress: { label: 'Requesting', cls: 'badge-requesting' },
};

const AVAILABLE_ORDERS = [
    {
        id: 'ORD-003', pickup: '11 Temple Lane', delivery: '88 Bridge St', distance: 2, price: 20,
        status: 'in_progress', customerName: 'Priya Patel', fatherName: 'Rajesh Patel', customerPhone: '9111122222',
        receiverName: 'Kamal Haasan', receiverPhone: '9999911111'
    },
    {
        id: 'ORD-006', pickup: '34 Ocean Drive', delivery: '12 Palm Court', distance: 5, price: 50,
        status: 'in_progress', customerName: 'Arjun Reddy', fatherName: 'Krishnan Reddy', customerPhone: '9333344444',
        receiverName: 'Vijay Varma', receiverPhone: '9888800000'
    },
];

const MY_COMPLETED = [
    { id: 'ORD-001', price: 40, collected: 40, date: '2026-08-28' },
];

export default function RiderDashboard() {
    const user = JSON.parse(localStorage.getItem('drovexo_user') || '{}');
    const navigate = useNavigate();
    const [available, setAvailable] = useState(AVAILABLE_ORDERS);

    // Hardcoded stats based on initial state for the mock presentation
    const activeCount = 2; // ORD-002, ORD-004 which live in Drops view
    const totalEarned = MY_COMPLETED.reduce((s, o) => s + calculateRiderEarning(o.collected), 0);

    function handleAcceptClick(order) {
        setAvailable(a => a.filter(o => o.id !== order.id));
        alert('Drop Accepted! Redirecting you to My Drops to process it.');
        navigate('/rider/drops');
    }

    return (
        <MobileLayout role="rider" title={`Hey, ${user.name?.split(' ')[0] || 'Rider'} 🏍️`} subtitle="Find your next delivery">
            {/* Stats */}
            <div className="stats-row">
                <div className="stat-card card">
                    <div className="stat-card-icon stat-icon-amber"><Package size={20} /></div>
                    <div>
                        <div className="stat-card-value">{available.length}</div>
                        <div className="stat-card-label">Available</div>
                    </div>
                </div>
                <div className="stat-card card" onClick={() => navigate('/rider/drops')} style={{ cursor: 'pointer' }}>
                    <div className="stat-card-icon stat-icon-teal"><Bike size={20} /></div>
                    <div>
                        <div className="stat-card-value">{activeCount}</div>
                        <div className="stat-card-label">Active</div>
                    </div>
                </div>
                <div className="stat-card card" onClick={() => navigate('/rider/earnings')} style={{ cursor: 'pointer' }}>
                    <div className="stat-card-icon stat-icon-green"><DollarSign size={20} /></div>
                    <div>
                        <div className="stat-card-value">₹{totalEarned.toFixed(0)}</div>
                        <div className="stat-card-label">Earned Today</div>
                    </div>
                </div>
            </div>

            {/* Available Orders */}
            <div className="section-block">
                <h2 className="section-block-title">Available Drops</h2>
                {available.length === 0
                    ? <p className="empty-msg">No drops requesting riders right now.</p>
                    : available.map(o => (
                        <div key={o.id} className="order-row card" style={{ padding: '16px', gap: '12px', display: 'flex', flexDirection: 'column', marginBottom: 12 }}>
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

                            <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => handleAcceptClick(o)} id={`accept-${o.id}`}>
                                Accept Delivery
                            </button>
                        </div>
                    ))
                }
            </div>
        </MobileLayout>
    );
}
