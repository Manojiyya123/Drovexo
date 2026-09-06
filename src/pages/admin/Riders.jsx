import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Bike, Navigation, DollarSign, ExternalLink, PlayCircle, ChevronDown, ChevronUp, Search, Route, User } from 'lucide-react';
import { calculateRiderEarning } from '../../utils/pricing';
import { Link } from 'react-router-dom';

const today = new Date();
const yesterday = new Date(Date.now() - 86400000);

const formatTimestamp = (date, hr, min) => {
    const d = new Date(date);
    d.setHours(hr, min, 0, 0);
    return d.toISOString();
}

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

const RIDER_DEMOGRAPHICS = {
    'Arjun P': { phone: '+91 99887 76655', email: 'arjun.p@drovexo.in', vehicle: 'MotorBike (Honda)', joined: '15 Jan, 2024', status: 'Active' },
    'Vikram S': { phone: '+91 88776 65544', email: 'vikram.s@drovexo.in', vehicle: 'Scooter (TVS)', joined: '03 Feb, 2024', status: 'Active' },
    'Manoj D': { phone: '+91 77665 54433', email: 'manoj.d@drovexo.in', vehicle: 'Electric Bike', joined: '12 Apr, 2025', status: 'Applicant' },
};

export default function AdminRiders() {
    const [expandedRow, setExpandedRow] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // Generate intelligent profiles dynamically from ledger filtering OUT the unassigned null state '—'
    const validDrops = MOCK_ORDERS.filter(o => o.rider !== '—');

    const riderProfiles = {};

    validDrops.forEach(o => {
        if (!riderProfiles[o.rider]) {
            riderProfiles[o.rider] = {
                name: o.rider,
                totalDrops: 0,
                activeDrops: 0,
                historicalPayout: 0,
                totalDistance: 0
            };
        }

        // Track actively running states to determine online-status
        if (o.status === 'in_progress' || o.status === 'accepted' || o.status === 'pending') {
            riderProfiles[o.rider].activeDrops += 1;
        }

        // Aggregate lifetime value vectors on successfully completed jumps
        if (o.status === 'delivered') {
            riderProfiles[o.rider].totalDrops += 1;
            riderProfiles[o.rider].historicalPayout += calculateRiderEarning(o.price);
            riderProfiles[o.rider].totalDistance += o.distance;
        }
    });

    const profiles = Object.values(riderProfiles).sort((a, b) => b.totalDrops - a.totalDrops);

    const filteredProfiles = profiles.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const riderStatus = RIDER_DEMOGRAPHICS[p.name]?.status || 'Unknown';
        const matchesStatus = statusFilter === 'All' || riderStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <Layout role="admin" title="Rider Fleet Registry" subtitle="Manage and monitor your decentralized logistics force">

            <div className="stats-row" style={{ marginBottom: '32px' }}>
                <div className="stat-card card">
                    <div className="stat-card-icon"><Bike size={20} /></div>
                    <div>
                        <div className="stat-card-value">{profiles.length}</div>
                        <div className="stat-card-label">Registered Fleet Size</div>
                    </div>
                </div>
                <div className="stat-card card">
                    <div className="stat-card-icon td-teal" style={{ background: 'rgba(20, 184, 166, 0.1)' }}><PlayCircle size={20} /></div>
                    <div>
                        <div className="stat-card-value td-teal">{profiles.filter(p => p.activeDrops > 0).length}</div>
                        <div className="stat-card-label">Active Runners Online</div>
                    </div>
                </div>
                <div className="stat-card card">
                    <div className="stat-card-icon td-amber" style={{ background: 'rgba(245, 158, 11, 0.1)' }}><Navigation size={20} /></div>
                    <div>
                        <div className="stat-card-value td-amber">{profiles.reduce((a, b) => a + b.totalDistance, 0)} km</div>
                        <div className="stat-card-label">Decentralized Range Mapped</div>
                    </div>
                </div>
                <div className="stat-card card">
                    <div className="stat-card-icon td-green" style={{ background: 'rgba(34, 197, 94, 0.1)' }}><DollarSign size={20} /></div>
                    <div>
                        <div className="stat-card-value td-green">₹{profiles.reduce((a, b) => a + b.historicalPayout, 0)}</div>
                        <div className="stat-card-label">Capital Flow (Paid out)</div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div className="form-group" style={{ margin: 0, flex: 2, minWidth: '250px' }}>
                        <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Semantic Global Search</label>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                className="form-input"
                                style={{ paddingLeft: '48px' }}
                                placeholder="Scan by Rider Identity..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-group" style={{ margin: 0, flex: 1, minWidth: '150px' }}>
                        <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Account Clearance</label>
                        <select
                            className="form-input"
                            style={{ cursor: 'pointer' }}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Operations</option>
                            <option value="Active">Active Nodes</option>
                            <option value="Applicant">Pending Applicants</option>
                            <option value="Dismissed">Dismissed Runners</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="section-block">
                <h2 className="section-block-title">Active Fleet Registry</h2>
                <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Rider Identity</th>
                                <th>Platform Status</th>
                                <th>Account Clearance</th>
                                <th>All-Time Drops Completed</th>
                                <th>Aggregate Earning Payouts</th>
                                <th>Action Terminal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProfiles.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                        No rider node matching that identity matrix could be found on the network.
                                    </td>
                                </tr>
                            ) : (
                                filteredProfiles.map((p, idx) => (
                                    <React.Fragment key={p.name}>
                                        <tr
                                            style={{ cursor: 'pointer', background: expandedRow === p.name ? 'var(--bg-elevated)' : 'transparent', transition: 'background 0.2s' }}
                                            onClick={() => setExpandedRow(expandedRow === p.name ? null : p.name)}
                                        >
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    {expandedRow === p.name ? <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />}
                                                    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px', color: 'var(--teal)' }}>
                                                        {p.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>RID-00{idx + 1}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {p.activeDrops > 0
                                                    ? <span className="badge badge-pending" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><PlayCircle size={12} /> {p.activeDrops} Active Streams</span>
                                                    : <span className="badge" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>Offline Standby</span>
                                                }
                                            </td>
                                            <td>
                                                <span className={`badge ${RIDER_DEMOGRAPHICS[p.name]?.status === 'Active' ? 'badge-done' :
                                                    RIDER_DEMOGRAPHICS[p.name]?.status === 'Applicant' ? 'badge-waiting' :
                                                        RIDER_DEMOGRAPHICS[p.name]?.status === 'Dismissed' ? 'badge-canceled' : ''
                                                    }`}>
                                                    {RIDER_DEMOGRAPHICS[p.name]?.status || 'Unknown'}
                                                </span>
                                            </td>
                                            <td><span style={{ fontWeight: 'bold' }}>{p.totalDrops}</span> completed drops</td>
                                            <td className="td-green">₹{p.historicalPayout}</td>
                                            <td>
                                                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>View Panel ▼</span>
                                            </td>
                                        </tr>

                                        {/* Slide Down Accordion */}
                                        {expandedRow === p.name && (
                                            <tr style={{ background: 'var(--bg-elevated)' }}>
                                                <td colSpan={5} style={{ padding: '0 16px 20px 16px', borderTop: 'none' }}>
                                                    <div style={{ display: 'flex', gap: '32px', background: 'var(--bg-default)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', alignItems: 'center' }}>

                                                        <div style={{ flex: 1, paddingRight: '24px', borderRight: '1px solid var(--border)' }}>
                                                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 700 }}>Identity Core</p>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
                                                                <div>
                                                                    <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontSize: '11px', textTransform: 'uppercase' }}>Phone Active</div>
                                                                    <div style={{ fontWeight: 500, color: 'var(--amber)' }}>{RIDER_DEMOGRAPHICS[p.name]?.phone}</div>
                                                                </div>
                                                                <div>
                                                                    <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontSize: '11px', textTransform: 'uppercase' }}>Registration Email</div>
                                                                    <div style={{ fontWeight: 500 }}>{RIDER_DEMOGRAPHICS[p.name]?.email}</div>
                                                                </div>
                                                                <div>
                                                                    <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontSize: '11px', textTransform: 'uppercase' }}>Authorized Vehicle</div>
                                                                    <div style={{ fontWeight: 500 }}>{RIDER_DEMOGRAPHICS[p.name]?.vehicle}</div>
                                                                </div>
                                                                <div>
                                                                    <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontSize: '11px', textTransform: 'uppercase' }}>Network Entry</div>
                                                                    <div style={{ fontWeight: 500 }}>{RIDER_DEMOGRAPHICS[p.name]?.joined}</div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div style={{ flex: 1 }}>
                                                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 700 }}>Logistics Telemetry</p>
                                                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                                                <div className="stat-card card" style={{ padding: '12px', flex: 1, minWidth: '90px', background: 'transparent' }}>
                                                                    <div className="stat-card-value text-blue" style={{ fontSize: '18px', color: '#3b82f6' }}>{p.activeDrops}</div>
                                                                    <div className="stat-card-label">Active Jumps</div>
                                                                </div>
                                                                <div className="stat-card card" style={{ padding: '12px', flex: 1, minWidth: '90px', background: 'transparent' }}>
                                                                    <div className="stat-card-value td-green" style={{ fontSize: '18px' }}>₹{p.historicalPayout}</div>
                                                                    <div className="stat-card-label">Capital Flow</div>
                                                                </div>
                                                                <div className="stat-card card" style={{ padding: '12px', flex: 1, minWidth: '90px', background: 'transparent' }}>
                                                                    <div className="stat-card-value">{p.totalDistance} <span style={{ fontSize: '12px', fontWeight: 'normal' }}>km</span></div>
                                                                    <div className="stat-card-label">Distance Mapped</div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div style={{ paddingLeft: '24px', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start', minWidth: '220px' }}>
                                                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 700 }}>Isolation Nodes</p>
                                                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Branch off into deep-dive telemetry nodes for this logistics operative.</p>
                                                            <Link to={`/admin/rider-profile/${encodeURIComponent(p.name)}`} state={{ from: '/admin/riders' }} className="btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                                                                View Master Profile
                                                            </Link>
                                                            <Link to={`/admin/rider-drops/${encodeURIComponent(p.name)}`} state={{ from: '/admin/riders' }} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center' }}>
                                                                <Route size={14} /> View Rider Drops
                                                            </Link>
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
