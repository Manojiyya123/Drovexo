import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '../services/supabase';
import { hashPassword } from '../utils/hash';
import './Auth.css';
import './Signup.css';

export default function RiderSignup() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // 16 Fields Total
    const [form, setForm] = useState({
        // Step 1: Personal (7)
        firstName: '',
        lastName: '',
        gender: 'Male',
        email: '',
        phone: '',
        password: '',
        riderId: '',
        address: '',
        // Step 2: Vehicle & Verification (5)
        vehicleType: '2-wheeler',
        vehicleModel: '',
        vehicleNumber: '',
        adharNo: '',
        licenseNo: '',
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    }

    function nextStep() {
        setError('');
        // Basic validation per step
        if (step === 1) {
            if (!form.firstName || !form.lastName || !form.phone || !form.email || !form.password) {
                setError('Please fill in all required personal details.');
                return;
            }
        }
        setStep(s => s + 1);
    }

    function prevStep() {
        setError('');
        setStep(s => s - 1);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if (step === 2) {
            if (!form.vehicleModel || !form.vehicleNumber || !form.adharNo || !form.licenseNo) {
                setError('Please fill in all vehicle and verification details before submitting.');
                return;
            }
        }

        setLoading(true);

        try {
            import { hashPassword } from '../utils/hash';

            const hashedPassword = await hashPassword(form.password);

            // 1. Direct table insert bypassing Supabase Auth
            const { error: dbError } = await supabase.from('riders').insert({
                rider_id: form.riderId,
                first_name: form.firstName,
                last_name: form.lastName,
                gender: form.gender,
                mobile_no: form.phone,
                email_id: form.email,
                password: hashedPassword,
                vehicle_type: form.vehicleType,
                vehicle_model: form.vehicleModel,
                vehicle_registration_number: form.vehicleNumber,
                adhar_no: form.adharNo,
                license_no: form.licenseNo,
                // Status defaults to 'pending' from schema!
            });

            if (dbError) {
                console.error("Rider Profile creation error:", dbError);
                throw new Error(dbError.message || "Failed to create rider profile.");
            }

            // Successfully created
            alert('Rider application submitted successfully! Welcome to the team.');
            navigate('/login');
        } catch (err) {
            setError(err.message || "An error occurred during rider signup.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-bg-glow" aria-hidden="true" />

            <div className="auth-card card signup-card">
                <Link to="/" className="auth-back">← Back to home</Link>

                <div className="auth-logo" style={{ marginBottom: 16 }}>
                    <span>⚡</span>
                    <span>Dro\/ex0</span>
                </div>

                <h1 className="auth-title">Rider Application</h1>
                <div className="step-indicator">
                    Step {step} of 2: {step === 1 ? 'Personal Info' : 'Vehicle & IDs'}
                </div>

                {error && <p className="auth-error" style={{ marginBottom: 16 }}>{error}</p>}

                {/* Form Container */}
                <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>

                    {/* STEP 1: Personal Info */}
                    {step === 1 && (
                        <div className="form-group-list">
                            <div className="signup-row">
                                <div className="form-group">
                                    <label className="form-label">First Name *</label>
                                    <input name="firstName" className="form-input" value={form.firstName} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Last Name *</label>
                                    <input name="lastName" className="form-input" value={form.lastName} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Gender</label>
                                <select name="gender" className="form-input" value={form.gender} onChange={handleChange}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Rider ID (Username) *</label>
                                <input name="riderId" className="form-input" value={form.riderId} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Mobile Number *</label>
                                <input name="phone" type="tel" className="form-input" value={form.phone} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email Address *</label>
                                <input name="email" type="email" className="form-input" value={form.email} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password *</label>
                                <input name="password" type="password" className="form-input" value={form.password} onChange={handleChange} required minLength={6} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Full Address</label>
                                <textarea name="address" className="form-input" style={{ resize: 'vertical', minHeight: 80 }} value={form.address} onChange={handleChange}></textarea>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Vehicle Info */}
                    {step === 2 && (
                        <div className="form-group-list">
                            <div className="form-group">
                                <label className="form-label">Vehicle Type *</label>
                                <select name="vehicleType" className="form-input" value={form.vehicleType} onChange={handleChange}>
                                    <option value="2-wheeler">2-Wheeler (Bike/Scooter)</option>
                                    <option value="3-wheeler">3-Wheeler (Auto/Rickshaw)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Vehicle Model *</label>
                                <input name="vehicleModel" className="form-input" placeholder="e.g. Honda Activa 6G" value={form.vehicleModel} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Vehicle Registration Number *</label>
                                <input name="vehicleNumber" className="form-input" placeholder="e.g. MH 12 AB 1234" value={form.vehicleNumber} onChange={handleChange} style={{ textTransform: 'uppercase' }} required />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Aadhaar Number *</label>
                                <input name="adharNo" className="form-input" placeholder="12-digit Aadhaar" value={form.adharNo} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Driving License Number *</label>
                                <input name="licenseNo" className="form-input" placeholder="DL Number" value={form.licenseNo} onChange={handleChange} required />
                            </div>
                        </div>
                    )}

                    <div className="divider" style={{ margin: '24px 0 16px' }} />

                    {/* Navigation Buttons */}
                    <div style={{ display: 'flex', gap: 12 }}>
                        {step > 1 && (
                            <button type="button" className="btn btn-ghost" onClick={prevStep} style={{ flex: 1, justifyContent: 'center' }}>
                                <ArrowLeft size={16} /> Back
                            </button>
                        )}

                        {step < 2 ? (
                            <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
                                Continue <ArrowRight size={16} />
                            </button>
                        ) : (
                            <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} disabled={loading}>
                                {loading ? <span className="spinner" /> : <>Submit Application <ArrowRight size={16} /></>}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
