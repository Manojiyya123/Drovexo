import { Package, Users, TrendingUp, Bike, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import Layout from '../../components/Layout';

const TOTAL_CUSTOMERS = 142;
const TOTAL_RIDERS = 12;
const COMPLETED_ORDERS = 384;
const TOTAL_REVENUE = 15420;

const GRAPH_DATA = [
    { day: 'Mon', revenue: 1200, orders: 30 },
    { day: 'Tue', revenue: 1540, orders: 42 },
    { day: 'Wed', revenue: 1100, orders: 28 },
    { day: 'Thu', revenue: 1850, orders: 51 },
    { day: 'Fri', revenue: 2600, orders: 68 },
    { day: 'Sat', revenue: 3800, orders: 95 },
    { day: 'Sun', revenue: 4500, orders: 120 },
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
    return (
        <Layout role="admin" title="Admin Dashboard" subtitle="Operations overview">

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

            {/* Business Graph */}
            <div className="section-block card" style={{ padding: '32px 24px', marginBottom: '36px' }}>
                <h2 className="section-block-title" style={{ marginBottom: '24px' }}>Business Growth (Weekly)</h2>
                <div style={{ width: '100%', height: '320px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={GRAPH_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="day" stroke="var(--text-muted)" tick={{ fontSize: 13, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} dy={10} />
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
                            <Bar yAxisId="right" dataKey="orders" name="Total Orders" fill="var(--teal)" radius={[6, 6, 0, 0]} maxBarSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
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
