import MobileLayout from '../../components/MobileLayout';
import { calculateRiderEarning, calculatePlatformEarning } from '../../utils/pricing';

const EARNINGS = [
    { id: 'ORD-001', collected: 40, date: '2026-08-28' },
    { id: 'ORD-005', collected: 60, date: '2026-08-27' },
    { id: 'ORD-006', collected: 30, date: '2026-08-26' },
];

export default function RiderEarnings() {
    const total = EARNINGS.reduce((s, e) => s + calculateRiderEarning(e.collected), 0);

    return (
        <MobileLayout role="rider" title="My Earnings" subtitle="Your delivery earnings">
            {/* Big total card */}
            <div className="earnings-summary card" style={{ marginBottom: 24 }}>
                <span className="earnings-label">Total Earned</span>
                <span className="earnings-total">₹{total.toFixed(0)}</span>
                <span className="earnings-note">Your share from all completed deliveries</span>
            </div>

            {/* Delivery list — card-based for mobile instead of table */}
            <div className="section-block">
                <h2 className="section-block-title">Delivery History</h2>
                <div className="orders-list">
                    {EARNINGS.map(e => (
                        <div key={e.id} className="order-row card">
                            <div className="order-info">
                                <span className="order-id">{e.id}</span>
                                <span className="order-date">{e.date}</span>
                            </div>
                            <div className="order-meta">
                                <div style={{ textAlign: 'right' }}>
                                    <div className="order-price" style={{ color: 'var(--green)', fontSize: '1.1rem' }}>
                                        ₹{calculateRiderEarning(e.collected).toFixed(0)}
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                        Collected ₹{e.collected}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </MobileLayout>
    );
}
