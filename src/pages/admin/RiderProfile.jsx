import React, { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Layout from '../../components/Layout';
import { User, Phone, Mail, Truck, Calendar, ShieldCheck, MapPin, Bike, CheckCircle, Package, ShieldAlert, XOctagon } from 'lucide-react';

// Centralised demographics
const RIDER_DEMOGRAPHICS = {
    'Arjun P': { phone: '+91 99887 76655', email: 'arjun.p@drovexo.in', vehicle: 'MotorBike (Honda)', joined: '15 Jan, 2024', status: 'Active' },
    'Vikram S': { phone: '+91 88776 65544', email: 'vikram.s@drovexo.in', vehicle: 'Scooter (TVS)', joined: '03 Feb, 2024', status: 'Active' },
    'Manoj D': { phone: '+91 77665 54433', email: 'manoj.d@drovexo.in', vehicle: 'Electric Bike', joined: '12 Apr, 2025', status: 'Applicant' },
};

export default function AdminRiderProfile() {
    const { riderName } = useParams();
    const location = useLocation();
    const backPath = location.state?.from || '/admin/riders';
    const decodedName = decodeURIComponent(riderName);

    const initialProfile = RIDER_DEMOGRAPHICS[decodedName] || {
        phone: 'Unknown',
        email: 'Unknown',
        vehicle: 'Unknown',
        joined: 'Unknown',
        status: 'Unverified'
    };

    const [currentStatus, setCurrentStatus] = useState(initialProfile.status);

    const changeStatus = (newStatus) => {
        if (window.confirm(`Are you sure you want to change this operative's clearance to ${newStatus}?`)) {
            setCurrentStatus(newStatus);
            // In a real app we'd trigger a Supabase API call here to persist it.
        }
    };

    return (
        <Layout role="admin" title={`${decodedName}'s Master Profile`} subtitle="Deep dive biographical and identity telemetry">

            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to={backPath} className="btn btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    &larr; Back to Fleet Registry
                </Link>

                <Link to={`/admin/rider-drops/${riderName}`} state={{ from: `/admin/rider-profile/${riderName}` }} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <Package size={16} /> Track Runner's Drops
                </Link>
            </div>

            <div className="section-block">
                <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', padding: '40px', border: '1px solid var(--border)' }}>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px', paddingBottom: '32px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(20, 184, 166, 0.1)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', border: '2px solid var(--teal)' }}>
                            {decodedName.charAt(0)}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h1 style={{ fontSize: '28px', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {decodedName}
                                {currentStatus === 'Active' && <ShieldCheck size={24} style={{ color: 'var(--teal)' }} title="Clearance: Active Node" />}
                                {currentStatus === 'Applicant' && <ShieldAlert size={24} style={{ color: 'var(--amber)' }} title="Clearance: Vetting Required" />}
                                {currentStatus === 'Dismissed' && <XOctagon size={24} style={{ color: 'var(--red)' }} title="Clearance: Terminated" />}
                            </h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <p style={{ color: 'var(--text-muted)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Decentralized Logistics Operative</p>
                                <span className={`badge ${currentStatus === 'Active' ? 'badge-done' :
                                        currentStatus === 'Applicant' ? 'badge-waiting' :
                                            currentStatus === 'Dismissed' ? 'badge-canceled' : ''
                                    }`} style={{ fontSize: '11px', padding: '2px 8px' }}>
                                    {currentStatus}
                                </span>
                            </div>
                        </div>

                        {/* Authorization Action Terminals */}
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'var(--bg-default)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '8px', fontWeight: 600 }}>Command</div>

                            {currentStatus === 'Applicant' && (
                                <button onClick={() => changeStatus('Active')} className="btn btn-primary" style={{ background: 'var(--teal)', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                                    <CheckCircle size={14} /> Accept Application
                                </button>
                            )}

                            {currentStatus === 'Active' && (
                                <button onClick={() => changeStatus('Dismissed')} className="btn btn-primary" style={{ background: 'var(--red)', minWidth: '120px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                                    <XOctagon size={14} /> Disable Operative
                                </button>
                            )}

                            {currentStatus === 'Dismissed' && (
                                <button onClick={() => changeStatus('Active')} className="btn btn-ghost" style={{ border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                                    <CheckCircle size={14} /> Reinstate Operative
                                </button>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>

                        <div className="card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', background: 'transparent' }}>
                            <div style={{ background: 'var(--bg-default)', padding: '16px', borderRadius: '50%', border: '1px solid var(--border)' }}>
                                <Phone size={24} style={{ color: 'var(--amber)' }} />
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Registered Mobile</div>
                                <div style={{ fontSize: '16px', fontWeight: 600 }}>{initialProfile.phone}</div>
                            </div>
                        </div>

                        <div className="card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', background: 'transparent' }}>
                            <div style={{ background: 'var(--bg-default)', padding: '16px', borderRadius: '50%', border: '1px solid var(--border)' }}>
                                <Mail size={24} style={{ color: 'var(--blue)' }} />
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Drovexo Email Matrix</div>
                                <div style={{ fontSize: '16px', fontWeight: 600 }}>{initialProfile.email}</div>
                            </div>
                        </div>

                        <div className="card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', background: 'transparent' }}>
                            <div style={{ background: 'var(--bg-default)', padding: '16px', borderRadius: '50%', border: '1px solid var(--border)' }}>
                                <Bike size={24} style={{ color: 'var(--teal)' }} />
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Authorized Vehicle Node</div>
                                <div style={{ fontSize: '16px', fontWeight: 600 }}>{initialProfile.vehicle}</div>
                            </div>
                        </div>

                        <div className="card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', background: 'transparent' }}>
                            <div style={{ background: 'var(--bg-default)', padding: '16px', borderRadius: '50%', border: '1px solid var(--border)' }}>
                                <Calendar size={24} style={{ color: 'var(--green)' }} />
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Platform Entry Vector</div>
                                <div style={{ fontSize: '16px', fontWeight: 600 }}>{initialProfile.joined}</div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

        </Layout>
    );
}
