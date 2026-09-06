import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { User, Receipt, DollarSign, ChevronDown, ChevronUp, Package, ExternalLink, Search } from 'lucide-react';
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

const CUSTOMER_DEMOGRAPHICS = {
    'Anitha J': { phone: '+91 98765 43210', email: 'anitha.j@drovexo.in', gender: 'Female', joined: '12 Aug, 2025', type: 'Premium' },
    'Rahul K': { phone: '+91 87654 32109', email: 'rahul.k@drovexo.in', gender: 'Male', joined: '05 Sep, 2025', type: 'Standard' },
    'Sneha L': { phone: '+91 76543 21098', email: 'sneha.l@drovexo.in', gender: 'Female', joined: '22 Oct, 2025', type: 'Standard' },
    'Gaurav M': { phone: '+91 65432 10987', email: 'gaurav.m@drovexo.in', gender: 'Male', joined: '14 Nov, 2025', type: 'Premium' },
    'Priya D': { phone: '+91 54321 09876', email: 'priya.d@drovexo.in', gender: 'Female', joined: '01 Jan, 2026', type: 'Standard' },
    'Amit B': { phone: '+91 43210 98765', email: 'amit.b@drovexo.in', gender: 'Male', joined: '19 Feb, 2026', type: 'Standard' },
    'Rishi T': { phone: '+91 32109 87654', email: 'rishi.t@drovexo.in', gender: 'Male', joined: '25 Mar, 2026', type: 'Premium' },
    'Anjali V': { phone: '+91 21098 76543', email: 'anjali.v@drovexo.in', gender: 'Female', joined: '10 Apr, 2026', type: 'Standard' },
    'Karan J': { phone: '+91 10987 65432', email: 'karan.j@drovexo.in', gender: 'Male', joined: '30 May, 2026', type: 'Standard' },
};

export default function AdminCustomers() {
    const [expandedRow, setExpandedRow] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Generate intelligent profiles dynamically from ledger
    const customerProfiles = {};

    MOCK_ORDERS.forEach(o => {
        if (!customerProfiles[o.customer]) {
            customerProfiles[o.customer] = {
                name: o.customer,
                totalOrders: 0,
                activeOrders: 0,
                totalSpent: 0,
                lastOrder: o.timestamp
            };
        }

        customerProfiles[o.customer].totalOrders += 1;

        // Track uncompleted states
        if (o.status === 'in_progress' || o.status === 'accepted' || o.status === 'pending') {
            customerProfiles[o.customer].activeOrders += 1;
        }

        // Only count actual spent cash on delivered logic
        if (o.status === 'delivered') {
            customerProfiles[o.customer].totalSpent += o.price;
        }

        // Keep most recent timestamp
        if (new Date(o.timestamp) > new Date(customerProfiles[o.customer].lastOrder)) {
            customerProfiles[o.customer].lastOrder = o.timestamp;
        }
    });

    const profiles = Object.values(customerProfiles).sort((a, b) => b.totalOrders - a.totalOrders);

    // Process search filter dynamically against the profile string matrices
    const filteredProfiles = profiles.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const formatDisplayDate = (iso) => {
        return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Layout role="admin" title="Customer Directory" subtitle="Tracking engagement across your entire user-base">

            <div className="stats-row" style={{ marginBottom: '32px' }}>
                <div className="stat-card card">
                    <div className="stat-card-icon"><User size={20} /></div>
                    <div>
                        <div className="stat-card-value">{profiles.length}</div>
                        <div className="stat-card-label">Registered Customers</div>
                    </div>
                </div>
                <div className="stat-card card">
                    <div className="stat-card-icon td-green" style={{ background: 'rgba(34, 197, 94, 0.1)' }}><Receipt size={20} /></div>
                    <div>
                        <div className="stat-card-value td-green">{profiles.reduce((a, b) => a + b.totalOrders, 0)}</div>
                        <div className="stat-card-label">Historical Drops</div>
                    </div>
                </div>
                <div className="stat-card card">
                    <div className="stat-card-icon td-amber" style={{ background: 'rgba(245, 158, 11, 0.1)' }}><DollarSign size={20} /></div>
                    <div>
                        <div className="stat-card-value td-amber">₹{profiles.reduce((a, b) => a + b.totalSpent, 0)}</div>
                        <div className="stat-card-label">Customer LTV (Total Spend)</div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Semantic Global Search</label>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            className="form-input"
                            style={{ paddingLeft: '48px' }}
                            placeholder="Scan by Customer Name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="section-block">
                <h2 className="section-block-title">Master User List</h2>
                <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Client Profile</th>
                                <th>Total Logged Drops</th>
                                <th>Platform Expenditure</th>
                                <th>Active Live Drops</th>
                                <th>Last Ping (Latest Order)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProfiles.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                        No customer profile matching that identity matrix could be found.
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
                                                    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px', color: 'var(--amber)' }}>
                                                        {p.name.charAt(0)}
                                                    </div>
                                                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                                                </div>
                                            </td>
                                            <td><span style={{ fontWeight: 'bold' }}>{p.totalOrders}</span> <span style={{ color: 'var(--text-muted)' }}>drops</span></td>
                                            <td>₹{p.totalSpent}</td>
                                            <td>
                                                {p.activeOrders > 0
                                                    ? <span className="badge badge-requesting">{p.activeOrders} Active Flowing</span>
                                                    : <span style={{ color: 'var(--text-muted)' }}>None currently</span>
                                                }
                                            </td>
                                            <td>{formatDisplayDate(p.lastOrder)}</td>
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
                                                                    <div style={{ fontWeight: 500, color: 'var(--amber)' }}>{CUSTOMER_DEMOGRAPHICS[p.name]?.phone}</div>
                                                                </div>
                                                                <div>
                                                                    <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontSize: '11px', textTransform: 'uppercase' }}>Drovexo Email ID</div>
                                                                    <div style={{ fontWeight: 500 }}>{CUSTOMER_DEMOGRAPHICS[p.name]?.email}</div>
                                                                </div>
                                                                <div>
                                                                    <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontSize: '11px', textTransform: 'uppercase' }}>Gender Matrix</div>
                                                                    <div style={{ fontWeight: 500 }}>{CUSTOMER_DEMOGRAPHICS[p.name]?.gender}</div>
                                                                </div>
                                                                <div>
                                                                    <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontSize: '11px', textTransform: 'uppercase' }}>Platform Entry</div>
                                                                    <div style={{ fontWeight: 500 }}>{CUSTOMER_DEMOGRAPHICS[p.name]?.joined}</div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div style={{ flex: 1 }}>
                                                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 700 }}>Routing Telemetry</p>
                                                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                                                <div className="stat-card card" style={{ padding: '12px', flex: 1, minWidth: '90px', background: 'transparent' }}>
                                                                    <div className="stat-card-value text-blue" style={{ fontSize: '18px', color: '#3b82f6' }}>{p.activeOrders}</div>
                                                                    <div className="stat-card-label">In-Transit</div>
                                                                </div>
                                                                <div className="stat-card card" style={{ padding: '12px', flex: 1, minWidth: '90px', background: 'transparent' }}>
                                                                    <div className="stat-card-value td-green" style={{ fontSize: '18px' }}>₹{p.totalSpent}</div>
                                                                    <div className="stat-card-label">Total Spent</div>
                                                                </div>
                                                                <div className="stat-card card" style={{ padding: '12px', flex: 1, minWidth: '90px', background: 'transparent' }}>
                                                                    <div className="stat-card-value">{p.totalOrders}</div>
                                                                    <div className="stat-card-label">Prints</div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div style={{ paddingLeft: '24px', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
                                                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 700 }}>Isolation Node</p>
                                                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Extract isolated route table spanning this user's history.</p>
                                                            <Link to={`/admin/customer-parcels/${encodeURIComponent(p.name)}`} state={{ from: '/admin/customers' }} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center' }}>
                                                                <Package size={14} /> See Drops
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
