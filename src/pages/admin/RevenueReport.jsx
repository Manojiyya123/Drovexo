import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { calculateRiderEarning, calculatePlatformEarning } from '../../utils/pricing';
import { ChevronDown, ChevronUp, Bike, Package, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const today = new Date();
const yesterday = new Date(Date.now() - 86400000);

const formatTimestamp = (date, hr, min) => {
    const d = new Date(date);
    d.setHours(hr, min, 0, 0);
    return d.toISOString();
}

// Unified mock data pool matching Orders & Rider Drops
const MOCK_ORDERS = [
    { id: 'ORD-011', timestamp: formatTimestamp(today, 17, 30), customer: 'Anitha J', rider: 'Arjun P', price: 150, status: 'delivered', pickup: 'Cyber City', delivery: 'Palm Woods', distance: 15 },
    { id: 'ORD-010', timestamp: formatTimestamp(today, 16, 45), customer: 'Rahul K', rider: 'Vikram S', price: 90, status: 'in_progress', pickup: '44 IT Park Rd', delivery: '10 Beach Ave', distance: 9 },
    { id: 'ORD-009', timestamp: formatTimestamp(today, 15, 30), customer: 'Sneha L', rider: 'Arjun P', price: 50, status: 'pending', pickup: 'Sector 4, Market', delivery: 'Blue Towers', distance: 5 },
    { id: 'ORD-008', timestamp: formatTimestamp(today, 14, 25), customer: 'Gaurav M', rider: '—', price: 40, status: 'canceled', pickup: 'City Mall', delivery: 'West End', distance: 4 },
    { id: 'ORD-007', timestamp: formatTimestamp(today, 12, 10), customer: 'Priya D', rider: 'Vikram S', price: 120, status: 'accepted', pickup: 'Airport Road', delivery: 'Hotel Taj', distance: 12 },
    { id: 'ORD-006', timestamp: formatTimestamp(today, 9, 15), customer: 'Amit B', rider: 'Arjun P', price: 30, status: 'delivered', pickup: 'Grocery Hub', delivery: 'Alpha Society', distance: 3 },
    { id: 'ORD-005', timestamp: formatTimestamp(yesterday, 19, 45), customer: 'Rishi T', rider: 'Vikram S', price: 60, status: 'delivered', pickup: 'Metro Station', delivery: 'Sunrise Apt', distance: 6 },
    { id: 'ORD-004', timestamp: formatTimestamp(yesterday, 18, 20), customer: 'Anjali V', rider: 'Manoj D', price: 70, status: 'delivered', pickup: 'Tech City', delivery: 'Hill View', distance: 7 },
    { id: 'ORD-003', timestamp: formatTimestamp(yesterday, 16, 10), customer: 'Karan J', rider: 'Vikram S', price: 110, status: 'delivered', pickup: 'Warehouse B', delivery: 'Downtown', distance: 11 },
];

export default function RevenueReport() {
    const [dateFilterType, setDateFilterType] = useState('today');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [expandedRow, setExpandedRow] = useState(null);

    const todayStr = today.toISOString().split('T')[0];

    // Core Filtering Logic (Date only)
    const dateFilteredLogs = MOCK_ORDERS.filter(o => {
        const orderDateStr = o.timestamp.split('T')[0];
        if (dateFilterType === 'today') {
            if (orderDateStr !== todayStr) return false;
        } else if (dateFilterType === 'range') {
            if (dateRange.start && orderDateStr < dateRange.start) return false;
            if (dateRange.end && orderDateStr > dateRange.end) return false;
        }
        return o.rider !== '—'; // Ignore unassigned orders for rider ledger
    });

    // Grouping Engine: Compute Revenue & Pipeline Dynamically!
    const riderGroups = {};
    dateFilteredLogs.forEach(o => {
        if (!riderGroups[o.rider]) {
            riderGroups[o.rider] = {
                name: o.rider,
                totalRides: 0,
                collected: 0,
                pipeline: { in_progress: 0, accepted: 0, pending: 0, delivered: 0, canceled: 0 }
            };
        }

        // Count into pipeline regardless of state
        if (riderGroups[o.rider].pipeline[o.status] !== undefined) {
            riderGroups[o.rider].pipeline[o.status] += 1;
        }

        // Only count as a "Ride" and add to "Collected Revenue" if DELIVERED!
        if (o.status === 'delivered') {
            riderGroups[o.rider].totalRides += 1;
            riderGroups[o.rider].collected += o.price;
        }
    });

    const groupedRiders = Object.values(riderGroups).sort((a, b) => b.collected - a.collected);

    // Global Stats computed from the grouped data
    const totalDeliveries = groupedRiders.reduce((s, r) => s + r.totalRides, 0);
    const totalRevenue = groupedRiders.reduce((s, r) => s + r.collected, 0);
    const riderPayouts = groupedRiders.reduce((s, r) => s + calculateRiderEarning(r.collected), 0);
    const platformIncome = groupedRiders.reduce((s, r) => s + calculatePlatformEarning(r.collected), 0);

    const toggleRow = (id) => {
        if (expandedRow === id) setExpandedRow(null);
        else setExpandedRow(id);
    };

    return (
        <Layout role="admin" title="Revenue Report" subtitle="Financial analytics across your ledger">

            {/* Top Stats computed dynamically */}
            <div className="stats-row" style={{ marginBottom: '24px' }}>
                <div className="stat-card card">
                    <div><div className="stat-card-value">{totalDeliveries}</div><div className="stat-card-label">Orders Delivered</div></div>
                </div>
                <div className="stat-card card">
                    <div><div className="stat-card-value">₹{totalRevenue}</div><div className="stat-card-label">Gross Revenue</div></div>
                </div>
                <div className="stat-card card">
                    <div><div className="stat-card-value td-green">₹{riderPayouts.toFixed(0)}</div><div className="stat-card-label">Rider Payouts</div></div>
                </div>
                <div className="stat-card card">
                    <div><div className="stat-card-value" style={{ color: 'var(--teal)' }}>₹{platformIncome.toFixed(0)}</div><div className="stat-card-label">Platform Profit</div></div>
                </div>
            </div>

            {/* Filter Controls (Mirrored from Orders) */}
            <div className="card" style={{ padding: '20px', marginBottom: '36px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start' }}>
                <div className="form-group" style={{ flex: 1, minWidth: '200px', margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Calculation Window</label>
                    <div className="select-wrap">
                        <select className="form-input" value={dateFilterType} onChange={e => setDateFilterType(e.target.value)}>
                            <option value="today">Today (Default)</option>
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

            <div className="section-block">
                <h2 className="section-block-title">Rider Performance Ledger</h2>
                <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{ width: 40, paddingRight: 0 }}></th>
                                <th>Rider</th>
                                <th>Total Rides (Completed)</th>
                                <th>Total Collected</th>
                                <th>Rider Payout (80%)</th>
                                <th>Platform Cut (20%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedRiders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                        No active riders in the selected timeline.
                                    </td>
                                </tr>
                            ) : (
                                groupedRiders.map(r => (
                                    <React.Fragment key={r.name}>
                                        <tr
                                            style={{ cursor: 'pointer', background: expandedRow === r.name ? 'var(--bg-elevated)' : 'transparent', transition: 'background 0.2s' }}
                                            onClick={() => toggleRow(r.name)}
                                        >
                                            <td style={{ paddingRight: 0, paddingLeft: '20px' }}>
                                                {expandedRow === r.name ? <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />}
                                            </td>
                                            <td style={{ fontWeight: expandedRow === r.name ? 'bold' : 'normal' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div className="stat-card-icon" style={{ width: 24, height: 24, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', color: 'var(--teal)' }}><Bike size={12} /></div>
                                                    {r.name}
                                                </div>
                                            </td>
                                            <td>{r.totalRides}</td>
                                            <td>₹{r.collected}</td>
                                            <td className="td-green">₹{calculateRiderEarning(r.collected).toFixed(0)}</td>
                                            <td className="td-muted">₹{calculatePlatformEarning(r.collected).toFixed(0)}</td>
                                        </tr>

                                        {/* Rider Accordion Slide-down */}
                                        {expandedRow === r.name && (
                                            <tr style={{ background: 'var(--bg-elevated)' }}>
                                                <td colSpan={6} style={{ padding: '0 16px 20px 16px', borderTop: 'none' }}>
                                                    <div style={{ display: 'flex', gap: '32px', background: 'var(--bg-default)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', alignItems: 'center' }}>

                                                        <div style={{ flex: 1 }}>
                                                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 700 }}>Real-Time Pipeline for {r.name}</p>

                                                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                                                <div className="stat-card card" style={{ padding: '12px', flex: 1, minWidth: '100px', background: 'transparent' }}>
                                                                    <div className="stat-card-value text-blue" style={{ fontSize: '20px', color: '#3b82f6' }}>{r.pipeline.in_progress}</div>
                                                                    <div className="stat-card-label">Requesting</div>
                                                                </div>
                                                                <div className="stat-card card" style={{ padding: '12px', flex: 1, minWidth: '100px', background: 'transparent' }}>
                                                                    <div className="stat-card-value td-amber" style={{ fontSize: '20px', color: 'var(--amber)' }}>{r.pipeline.accepted}</div>
                                                                    <div className="stat-card-label">Waiting</div>
                                                                </div>
                                                                <div className="stat-card card" style={{ padding: '12px', flex: 1, minWidth: '100px', background: 'transparent' }}>
                                                                    <div className="stat-card-value td-teal" style={{ fontSize: '20px', color: 'var(--teal)' }}>{r.pipeline.pending}</div>
                                                                    <div className="stat-card-label">Pending</div>
                                                                </div>
                                                                <div className="stat-card card" style={{ padding: '12px', flex: 1, minWidth: '100px', background: 'transparent' }}>
                                                                    <div className="stat-card-value td-green" style={{ fontSize: '20px' }}>{r.pipeline.delivered}</div>
                                                                    <div className="stat-card-label">Delivered</div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div style={{ paddingLeft: '24px', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
                                                            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Deep dive into all individual drops isolated exclusively for this rider.</p>
                                                            <Link to={`/admin/rider-drops/${encodeURIComponent(r.name)}`} state={{ from: '/admin/report' }} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                                Show All Drops
                                                                <ExternalLink size={14} />
                                                            </Link>
                                                        </div>

                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                            {groupedRiders.length > 0 && (
                                <tr className="table-total" style={{ background: 'var(--bg-elevated)', borderTop: '1px solid var(--border)' }}>
                                    <td colSpan={2}></td>
                                    <td><strong>{totalDeliveries}</strong></td>
                                    <td><strong>₹{totalRevenue}</strong></td>
                                    <td className="td-green"><strong>₹{riderPayouts.toFixed(0)}</strong></td>
                                    <td className="td-teal"><strong>₹{platformIncome.toFixed(0)}</strong></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}
