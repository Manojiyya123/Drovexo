import React, { useState } from 'react';
import { Package, Users, TrendingUp, Bike, Calendar, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LineChart, Line } from 'recharts';
import Layout from '../../components/Layout';

const TOTAL_CUSTOMERS = 142;
const TOTAL_RIDERS = 12;
const COMPLETED_ORDERS = 384;
const TOTAL_REVENUE = 15420;

const WEEKLY_DATA = [
    { name: 'Mon', revenue: 1200, orders: 30, personDrops: 18, parcelDrops: 12 },
    { name: 'Tue', revenue: 1540, orders: 42, personDrops: 25, parcelDrops: 17 },
    { name: 'Wed', revenue: 1100, orders: 28, personDrops: 15, parcelDrops: 13 },
    { name: 'Thu', revenue: 1850, orders: 51, personDrops: 30, parcelDrops: 21 },
    { name: 'Fri', revenue: 2600, orders: 68, personDrops: 40, parcelDrops: 28 },
    { name: 'Sat', revenue: 3800, orders: 95, personDrops: 60, parcelDrops: 35 },
    { name: 'Sun', revenue: 4500, orders: 120, personDrops: 80, parcelDrops: 40 },
];

const MONTHLY_DATA = [
    { name: 'Week 1', revenue: 8500, orders: 240, personDrops: 140, parcelDrops: 100 },
    { name: 'Week 2', revenue: 11200, orders: 310, personDrops: 180, parcelDrops: 130 },
    { name: 'Week 3', revenue: 14500, orders: 380, personDrops: 220, parcelDrops: 160 },
    { name: 'Week 4', revenue: 16800, orders: 420, personDrops: 250, parcelDrops: 170 },
];

const YEARLY_DATA = [
    { name: 'Jan', revenue: 35000, orders: 900, personDrops: 600, parcelDrops: 300 },
    { name: 'Feb', revenue: 38000, orders: 980, personDrops: 650, parcelDrops: 330 },
    { name: 'Mar', revenue: 42000, orders: 1050, personDrops: 700, parcelDrops: 350 },
    { name: 'Apr', revenue: 45000, orders: 1120, personDrops: 740, parcelDrops: 380 },
    { name: 'May', revenue: 51000, orders: 1280, personDrops: 850, parcelDrops: 430 },
    { name: 'Jun', revenue: 58000, orders: 1450, personDrops: 960, parcelDrops: 490 },
];

const ALL_ORDERS = [
    { id: 'ORD-001', customer: 'Arun Kumar', rider: 'Vikram Singh', distance: 4, price: 40, status: 'delivered', date: '2026-08-28' },
    { id: 'ORD-005', customer: 'Manish Pandey', rider: '—', distance: 6, price: 60, status: 'canceled', date: '2026-08-29' },
    { id: 'ORD-002', customer: 'Anita Desai', rider: 'Vikram Singh', distance: 7, price: 70, status: 'accepted', date: '2026-08-29' },
    { id: 'ORD-004', customer: 'Suresh Menon', rider: 'Vikram Singh', distance: 5, price: 50, status: 'pending', date: '2026-08-29' },
    { id: 'ORD-003', customer: 'Priya Patel', rider: '—', distance: 2, price: 20, status: 'in_progress', date: '2026-08-29' },
];

const STATUS_MAP = {
    in_progress: { label: 'Requesting', cls: 'badge-requesting' },
    accepted: { label: 'Waiting to Pickup', cls: 'badge-waiting' },
    pending: { label: 'Pending (Picked up, driving)', cls: 'badge-pending' },
    delivered: { label: 'Delivered', cls: 'badge-done' },
    canceled: { label: 'Canceled', cls: 'badge-canceled' },
};

export default function AdminDashboard() {
    const [dateFilter, setDateFilter] = useState('weekly');
    const [customRange, setCustomRange] = useState({ start: '', end: '' });

    let activeData = WEEKLY_DATA;
    if (dateFilter === 'monthly') activeData = MONTHLY_DATA;
    if (dateFilter === 'yearly') activeData = YEARLY_DATA;
    // Assuming custom filter would dynamically generate data in a real setup, falling back to weekly here for mock.

    return (
        <Layout role="admin" title="Admin Dashboard" subtitle="Operations overview">

            {/* Global Date Filter Controls */}
            <div className="card" style={{ padding: '20px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start' }}>
                <div className="form-group" style={{ flex: 1, minWidth: '200px', margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Date Scope</label>
                    <div className="select-wrap">
                        <select className="form-input" value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
                            <option value="weekly">Past 7 Days (Weekly)</option>
                            <option value="monthly">Past 4 Weeks (Monthly)</option>
                            <option value="yearly">Past Year (Yearly)</option>
                            <option value="custom">Custom Date Range</option>
                        </select>
                        <ChevronDown className="select-icon" size={16} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', flex: 2, minWidth: '280px', opacity: dateFilter === 'custom' ? 1 : 0.5 }}>
                    <div className="form-group" style={{ flex: 1, margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Start Date</label>
                        <input type="date" className="form-input" disabled={dateFilter !== 'custom'} value={customRange.start} onChange={e => setCustomRange(prev => ({ ...prev, start: e.target.value }))} />
                    </div>
                    <div className="form-group" style={{ flex: 1, margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>End Date</label>
                        <input type="date" className="form-input" disabled={dateFilter !== 'custom'} value={customRange.end} onChange={e => setCustomRange(prev => ({ ...prev, end: e.target.value }))} />
                    </div>
                </div>
            </div>

            {/* New Stats Row */}
            <div className="stats-row">
                <div className="stat-card card">
                    <div className="stat-card-icon stat-icon-purple"><Users size={20} /></div>
                    <div>
                        <div className="stat-card-value">{TOTAL_CUSTOMERS}</div>
                        <div className="stat-card-label">Customers Available</div>
                    </div>
                </div>
                <div className="stat-card card">
                    <div className="stat-card-icon stat-icon-teal"><Bike size={20} /></div>
                    <div>
                        <div className="stat-card-value">{TOTAL_RIDERS}</div>
                        <div className="stat-card-label">Riders Available</div>
                    </div>
                </div>
                <div className="stat-card card">
                    <div className="stat-card-icon stat-icon-amber"><Package size={20} /></div>
                    <div>
                        <div className="stat-card-value">{COMPLETED_ORDERS}</div>
                        <div className="stat-card-label">Orders Completed</div>
                    </div>
                </div>
                <div className="stat-card card">
                    <div className="stat-card-icon stat-icon-purple" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' }}><Calendar size={20} /></div>
                    <div>
                        <div className="stat-card-value">120</div>
                        <div className="stat-card-label">Today's Drops</div>
                    </div>
                </div>
                <div className="stat-card card">
                    <div className="stat-card-icon stat-icon-green"><TrendingUp size={20} /></div>
                    <div>
                        <div className="stat-card-value">₹{TOTAL_REVENUE}</div>
                        <div className="stat-card-label">Total Revenue</div>
                    </div>
                </div>
            </div>

            {/* Business Graphs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '36px' }}>

                {/* Revenue and Orders Setup */}
                <div className="section-block card" style={{ padding: '32px 24px' }}>
                    <h2 className="section-block-title" style={{ marginBottom: '24px', textTransform: 'capitalize' }}>Business Growth ({dateFilter})</h2>
                    <div style={{ width: '100%', height: '320px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 13, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis yAxisId="left" stroke="var(--text-muted)" tick={{ fontSize: 13, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} dx={-10} />
                                <YAxis yAxisId="right" orientation="right" stroke="var(--text-muted)" tick={{ fontSize: 13, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} dx={10} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff', boxShadow: '0 8px 16px rgba(0,0,0,0.4)', padding: '12px' }}
                                    itemStyle={{ color: '#fff', fontWeight: 600, paddingBottom: '4px' }}
                                    labelStyle={{ color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 700 }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                                <Bar yAxisId="left" dataKey="revenue" name="Revenue (₹)" fill="var(--amber)" radius={[6, 6, 0, 0]} maxBarSize={40} />
                                <Bar yAxisId="right" dataKey="orders" name="Total Orders" fill="rgba(255, 255, 255, 0.2)" radius={[6, 6, 0, 0]} maxBarSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Drop Type Split */}
                <div className="section-block card" style={{ padding: '32px 24px' }}>
                    <h2 className="section-block-title" style={{ marginBottom: '24px', textTransform: 'capitalize' }}>Drop Type Growth ({dateFilter})</h2>
                    <div style={{ width: '100%', height: '320px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 13, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis stroke="var(--text-muted)" tick={{ fontSize: 13, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff', boxShadow: '0 8px 16px rgba(0,0,0,0.4)', padding: '12px' }}
                                    itemStyle={{ color: '#fff', fontWeight: 600, paddingBottom: '4px' }}
                                    labelStyle={{ color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 700 }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                                <Line type="monotone" dataKey="personDrops" name="Person Drops" stroke="var(--teal)" strokeWidth={3} dot={{ r: 4, fill: 'var(--teal)', strokeWidth: 2, stroke: 'var(--bg-base)' }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="parcelDrops" name="Parcel Drops" stroke="var(--amber)" strokeWidth={3} dot={{ r: 4, fill: 'var(--amber)', strokeWidth: 2, stroke: 'var(--bg-base)' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* All Orders Table */}
            <div className="section-block">
                <div className="section-block-header">
                    <h2 className="section-block-title">Recent Orders Hub</h2>
                    <Link to="/admin/report" className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '13px' }}>
                        View Revenue Report
                    </Link>
                </div>
                <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Drop ID</th>
                                <th>Customer</th>
                                <th>Rider</th>
                                <th>Distance</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ALL_ORDERS.map(o => (
                                <tr key={o.id}>
                                    <td>{o.id}</td>
                                    <td>{o.customer}</td>
                                    <td>{o.rider}</td>
                                    <td>{o.distance} km</td>
                                    <td>₹{o.price}</td>
                                    <td><span className={`badge ${STATUS_MAP[o.status].cls}`}>{STATUS_MAP[o.status].label}</span></td>
                                    <td>{o.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}
