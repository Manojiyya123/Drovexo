import React, { useState } from 'react';
import { ChevronDown, ChevronUp, User, Navigation, MapPin, Bike, ArrowLeft } from 'lucide-react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Layout from '../../components/Layout';
import { calculateRiderEarning, calculatePlatformEarning } from '../../utils/pricing';

const STATUS_MAP = {
    in_progress: { label: 'Requesting', cls: 'badge-requesting' },
    accepted: { label: 'Waiting to Pickup', cls: 'badge-waiting' },
    pending: { label: 'Pending (Picked up)', cls: 'badge-pending' },
    delivered: { label: 'Delivered', cls: 'badge-done' },
    canceled: { label: 'Canceled', cls: 'badge-canceled' },
};

// Generate some robust mock orders tracking datetime
const today = new Date();
const yesterday = new Date(Date.now() - 86400000);

const formatTimestamp = (date, hr, min) => {
    const d = new Date(date);
    d.setHours(hr, min, 0, 0);
    return d.toISOString();
}

const MOCK_ORDERS = [
    { id: 'ORD-011', timestamp: formatTimestamp(today, 17, 30), customer: 'Anitha J', rider: 'Arjun P', price: 150, status: 'delivered', pickup: 'Cyber City', delivery: 'Palm Woods', distance: 15, dropType: 'person' },
    { id: 'ORD-010', timestamp: formatTimestamp(today, 16, 45), customer: 'Rahul K', rider: 'Vikram S', price: 90, status: 'in_progress', pickup: '44 IT Park Rd', delivery: '10 Beach Ave', distance: 9, dropType: 'person' },
    { id: 'ORD-009', timestamp: formatTimestamp(today, 15, 30), customer: 'Sneha L', rider: 'Arjun P', price: 50, status: 'pending', pickup: 'Sector 4, Market', delivery: 'Blue Towers', distance: 5, dropType: 'parcel' },
    { id: 'ORD-008', timestamp: formatTimestamp(today, 14, 25), customer: 'Gaurav M', rider: '—', price: 40, status: 'canceled', pickup: 'City Mall', delivery: 'West End', distance: 4, dropType: 'parcel' },
    { id: 'ORD-007', timestamp: formatTimestamp(today, 12, 10), customer: 'Priya D', rider: 'Vikram S', price: 120, status: 'accepted', pickup: 'Airport Road', delivery: 'Hotel Taj', distance: 12, dropType: 'person' },
    { id: 'ORD-006', timestamp: formatTimestamp(today, 9, 15), customer: 'Amit B', rider: 'Arjun P', price: 30, status: 'delivered', pickup: 'Grocery Hub', delivery: 'Alpha Society', distance: 3, dropType: 'parcel' },
    { id: 'ORD-005', timestamp: formatTimestamp(yesterday, 19, 45), customer: 'Rishi T', rider: 'Vikram S', price: 60, status: 'delivered', pickup: 'Metro Station', delivery: 'Sunrise Apt', distance: 6, dropType: 'person' },
    { id: 'ORD-004', timestamp: formatTimestamp(yesterday, 18, 20), customer: 'Anjali V', rider: 'Manoj D', price: 70, status: 'delivered', pickup: 'Tech City', delivery: 'Hill View', distance: 7, dropType: 'parcel' },
    { id: 'ORD-003', timestamp: formatTimestamp(yesterday, 16, 10), customer: 'Karan J', rider: 'Vikram S', price: 110, status: 'delivered', pickup: 'Warehouse B', delivery: 'Downtown', distance: 11, dropType: 'person' },
];

export default function AdminRiderDrops() {
    const { riderName } = useParams();
    const location = useLocation();
    const [statusFilter, setStatusFilter] = useState('all');
    const [dropTypeFilter, setDropTypeFilter] = useState('all');
    const [dateFilterType, setDateFilterType] = useState('today');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [expandedRow, setExpandedRow] = useState(null);

    // Filter explicitly bounded to the URL parameter Rider Name!
    const RIDER_ORDERS = MOCK_ORDERS.filter(o => o.rider === decodeURIComponent(riderName));

    const todayStr = today.toISOString().split('T')[0];

    // Filter logic FIRST so stats can dynamically compute based on what's caught in the filter!
    let baseFilteredOrders = RIDER_ORDERS.filter(o => {
        // Evaluate the DATE filter logic independently of the status, so stats can still reflect ALL statuses for that date
        const orderDateStr = o.timestamp.split('T')[0];
        if (dateFilterType === 'today') {
            if (orderDateStr !== todayStr) return false;
        } else if (dateFilterType === 'range') {
            if (dateRange.start && orderDateStr < dateRange.start) return false;
            if (dateRange.end && orderDateStr > dateRange.end) return false;
        }

        if (dropTypeFilter !== 'all' && o.dropType !== dropTypeFilter) return false;

        return true;
    });

    // Compute top level stats out of the DATE filtered orders
    const stats = {
        total: baseFilteredOrders.length,
        in_progress: baseFilteredOrders.filter(o => o.status === 'in_progress').length,
        accepted: baseFilteredOrders.filter(o => o.status === 'accepted').length,
        pending: baseFilteredOrders.filter(o => o.status === 'pending').length,
        delivered: baseFilteredOrders.filter(o => o.status === 'delivered').length,
        canceled: baseFilteredOrders.filter(o => o.status === 'canceled').length
    };

    let totalDeliveredRevenue = 0;
    baseFilteredOrders.forEach(o => {
        if (o.status === 'delivered') totalDeliveredRevenue += o.price;
    });
    const riderEarned = calculateRiderEarning(totalDeliveredRevenue);
    const platformEarned = calculatePlatformEarning(totalDeliveredRevenue);

    // Now apply Status Filter for the visual Table!
    const filteredOrders = baseFilteredOrders.filter(o => {
        if (statusFilter !== 'all' && o.status !== statusFilter) return false;
        return true;
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Time wise string sorting (descending)

    const toggleRow = (id) => {
        if (expandedRow === id) setExpandedRow(null);
        else setExpandedRow(id);
    };

    const formatDisplayTime = (iso) => {
        return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDisplayDate = (iso) => {
        return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const backPath = location.state?.from || '/admin/orders';
    let backText = 'Back';
    if (backPath === '/admin/orders') backText = 'Back to Drops';
    else if (backPath === '/admin/report') backText = 'Back to Revenue Report';
    else if (backPath === '/admin/riders') backText = 'Back to Fleet Registry';
    else if (backPath.includes('/admin/rider-profile')) backText = 'Back to Master Profile';

    return (
        <Layout role="admin" title={`Rider: ${decodeURIComponent(riderName)}'s Drops`} subtitle="Deep dive tracking isolation into this runner's metrics">

            <div style={{ marginBottom: '24px' }}>
                <Link to={backPath} className="btn btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <ArrowLeft size={16} /> {backText}
                </Link>
            </div>

            {/* Top Level Global Stats */}
            <div className="stats-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', marginBottom: '24px' }}>
                <div className="stat-card card" style={{ padding: '16px' }}>
                    <div>
                        <div className="stat-card-value">{stats.total}</div>
                        <div className="stat-card-label">Total</div>
                    </div>
                </div>
                <div className="stat-card card" style={{ padding: '16px' }}>
                    <div>
                        <div className="stat-card-value td-green">{stats.delivered}</div>
                        <div className="stat-card-label">Delivered</div>
                    </div>
                </div>
                <div className="stat-card card" style={{ padding: '16px' }}>
                    <div>
                        <div className="stat-card-value text-blue" style={{ color: '#3b82f6' }}>{stats.in_progress}</div>
                        <div className="stat-card-label">Requesting</div>
                    </div>
                </div>
                <div className="stat-card card" style={{ padding: '16px' }}>
                    <div>
                        <div className="stat-card-value td-amber" style={{ color: 'var(--amber)' }}>{stats.accepted}</div>
                        <div className="stat-card-label">Waiting</div>
                    </div>
                </div>
                <div className="stat-card card" style={{ padding: '16px' }}>
                    <div>
                        <div className="stat-card-value td-teal" style={{ color: 'var(--teal)' }}>{stats.pending}</div>
                        <div className="stat-card-label">Pending</div>
                    </div>
                </div>
                <div className="stat-card card" style={{ padding: '16px' }}>
                    <div>
                        <div className="stat-card-value td-red" style={{ color: 'var(--error)' }}>{stats.canceled}</div>
                        <div className="stat-card-label">Canceled</div>
                    </div>
                </div>
            </div>

            <div className="stats-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '24px' }}>
                <div className="stat-card card" style={{ padding: '16px', borderLeft: '4px solid var(--green)' }}>
                    <div>
                        <div className="stat-card-value td-green">₹{riderEarned.toFixed(0)}</div>
                        <div className="stat-card-label" style={{ fontWeight: 600 }}>Rider Payload Earning (80%)</div>
                    </div>
                </div>
                <div className="stat-card card" style={{ padding: '16px', borderLeft: '4px solid var(--teal)' }}>
                    <div>
                        <div className="stat-card-value td-teal">₹{platformEarned.toFixed(0)}</div>
                        <div className="stat-card-label" style={{ fontWeight: 600 }}>Drovexo Platform Inc. (20%)</div>
                    </div>
                </div>
            </div>

            {/* Filter Controls */}
            <div className="card" style={{ padding: '20px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start' }}>

                <div className="form-group" style={{ flex: 1, minWidth: '150px', margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Status Filter</label>
                    <div className="select-wrap">
                        <select className="form-input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                            <option value="all">All States</option>
                            <option value="in_progress">Requesting</option>
                            <option value="accepted">Waiting to Pickup</option>
                            <option value="pending">Pending (Driving)</option>
                            <option value="delivered">Delivered</option>
                            <option value="canceled">Canceled</option>
                        </select>
                        <ChevronDown className="select-icon" size={16} />
                    </div>
                </div>

                <div className="form-group" style={{ flex: 1, minWidth: '150px', margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Drop Type Filter</label>
                    <div className="select-wrap">
                        <select className="form-input" value={dropTypeFilter} onChange={e => setDropTypeFilter(e.target.value)}>
                            <option value="all">All Drops</option>
                            <option value="person">Person Drops</option>
                            <option value="parcel">Parcel Drops</option>
                        </select>
                        <ChevronDown className="select-icon" size={16} />
                    </div>
                </div>

                <div className="form-group" style={{ flex: 1, minWidth: '150px', margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Date Filter</label>
                    <div className="select-wrap">
                        <select className="form-input" value={dateFilterType} onChange={e => setDateFilterType(e.target.value)}>
                            <option value="today">Today</option>
                            <option value="all">All Time</option>
                            <option value="range">Custom Date Range</option>
                        </select>
                        <ChevronDown className="select-icon" size={16} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', flex: 2, minWidth: '280px', opacity: dateFilterType === 'range' ? 1 : 0.5 }}>
                    <div className="form-group" style={{ flex: 1, margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Start Date</label>
                        <input type="date" className="form-input" disabled={dateFilterType !== 'range'} value={dateRange.start} onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))} />
                    </div>
                    <div className="form-group" style={{ flex: 1, margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>End Date</label>
                        <input type="date" className="form-input" disabled={dateFilterType !== 'range'} value={dateRange.end} onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))} />
                    </div>
                </div>
            </div>

            {/* Orders Data Table */}
            <div className="section-block">
                <div className="table-wrap">
                    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ width: 40, paddingRight: 0 }}></th>
                                <th>Drop ID</th>
                                <th>Date & Time</th>
                                <th>Customer</th>
                                <th>Price</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                        No payload drops logged for {decodeURIComponent(riderName)} during this timeline.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map(o => (
                                    <React.Fragment key={o.id}>
                                        <tr
                                            style={{ cursor: 'pointer', background: expandedRow === o.id ? 'var(--bg-elevated)' : 'transparent', transition: 'background 0.2s' }}
                                            onClick={() => toggleRow(o.id)}
                                        >
                                            <td style={{ paddingRight: 0, paddingLeft: '20px' }}>
                                                {expandedRow === o.id ? <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />}
                                            </td>
                                            <td style={{ fontWeight: expandedRow === o.id ? 'bold' : 'normal' }}>{o.id}</td>
                                            <td>{formatDisplayDate(o.timestamp)} • {formatDisplayTime(o.timestamp)}</td>
                                            <td>{o.customer}</td>
                                            <td>₹{o.price}</td>
                                            <td><span className={`badge ${STATUS_MAP[o.status].cls}`}>{STATUS_MAP[o.status].label}</span></td>
                                        </tr>
                                        {expandedRow === o.id && (
                                            <tr style={{ background: 'var(--bg-elevated)' }}>
                                                <td colSpan={6} style={{ padding: '0 16px 20px 16px', borderTop: 'none' }}>
                                                    <div style={{ display: 'flex', gap: '32px', background: 'var(--bg-default)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>

                                                        {/* Route Block */}
                                                        <div style={{ flex: 1 }}>
                                                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 700 }}>Logistics Data</p>
                                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                                                                <MapPin size={14} style={{ color: 'var(--amber)', marginTop: 2, flexShrink: 0 }} />
                                                                <span style={{ fontSize: '13px' }}><strong>Pickup:</strong> {o.pickup}</span>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '16px' }}>
                                                                <Navigation size={14} style={{ color: 'var(--teal)', marginTop: 2, flexShrink: 0 }} />
                                                                <span style={{ fontSize: '13px' }}><strong>Dropoff:</strong> {o.delivery}</span>
                                                            </div>
                                                            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Total Distance computed at <strong>{o.distance} km</strong></div>
                                                        </div>

                                                        {/* People Block */}
                                                        <div style={{ flex: 1 }}>
                                                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 700 }}>Chain of Custody</p>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                                                <div className="stat-card-icon" style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}><User size={14} /></div>
                                                                <div>
                                                                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{o.customer}</div>
                                                                    <div style={{ fontSize: '11px', color: 'var(--amber)' }}>Ordering Customer</div>
                                                                </div>
                                                            </div>

                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <div className="stat-card-icon" style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}><Bike size={14} /></div>
                                                                <div>
                                                                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{o.rider}</div>
                                                                    <div style={{ fontSize: '11px', color: 'var(--teal)' }}>Assigned Rider</div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}
