import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Ruler, ArrowRight, Package, Scale, Phone, User as UserIcon, Bike } from 'lucide-react';
import { useState, useEffect } from 'react';
import MobileLayout from '../../components/MobileLayout';
import { calculatePrice } from '../../utils/pricing';

export default function CreateOrder() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        pickup: '',
        delivery: '',
        distance: '',
        itemType: 'Grocery',
        vehicleReq: '2-wheeler',
        weight: '',
        dropType: 'parcel',
        senderPhone: '',
        receiverName: '',
        receiverPhone: ''
    });
    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);

    const price = form.distance ? calculatePrice(parseFloat(form.distance)) : null;

    function handleChange(e) {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitted(true);
        await new Promise(r => setTimeout(r, 800));
        navigate('/customer');
    }

    return (
        <MobileLayout role="customer" title="New Order" subtitle="Enter delivery details">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {step === 1 ? (
                    <div className="section-block" style={{ display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '60vh', justifyContent: 'center' }}>
                        <h2 className="section-block-title" style={{ textAlign: 'center', fontSize: '20px', marginBottom: '8px' }}>What do you want to book?</h2>

                        <div
                            className={`card ${form.dropType === 'parcel' ? 'selected' : ''}`}
                            style={{
                                padding: '24px',
                                cursor: 'pointer',
                                border: form.dropType === 'parcel' ? '2px solid var(--amber)' : '2px solid var(--border)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                background: form.dropType === 'parcel' ? 'rgba(245, 158, 11, 0.05)' : 'var(--bg-elevated)',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => {
                                setForm(f => ({ ...f, dropType: 'parcel' }));
                            }}
                        >
                            <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '16px', borderRadius: '12px', color: 'var(--amber)' }}>
                                <Package size={32} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>Parcel Drop</h3>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Deliver goods, documents, or groceries securely.</p>
                            </div>
                        </div>

                        <div
                            className={`card ${form.dropType === 'person' ? 'selected' : ''}`}
                            style={{
                                padding: '24px',
                                cursor: 'pointer',
                                border: form.dropType === 'person' ? '2px solid var(--teal)' : '2px solid var(--border)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                background: form.dropType === 'person' ? 'rgba(20, 184, 166, 0.05)' : 'var(--bg-elevated)',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => {
                                setForm(f => ({ ...f, dropType: 'person' }));
                            }}
                        >
                            <div style={{ background: 'rgba(20, 184, 166, 0.2)', padding: '16px', borderRadius: '12px', color: 'var(--teal)' }}>
                                <UserIcon size={32} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>Person Drop</h3>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Book a comfortable and affordable ride for yourself.</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="btn btn-primary"
                            style={{
                                marginTop: '16px',
                                padding: '16px',
                                fontSize: '16px',
                                display: 'flex',
                                justifyContent: 'center',
                                background: form.dropType === 'parcel' ? 'var(--amber)' : 'var(--teal)'
                            }}
                            onClick={() => setStep(2)}
                        >
                            Proceed with {form.dropType === 'parcel' ? 'Parcel' : 'Person'} Drop <ArrowRight size={18} />
                        </button>
                    </div>
                ) : (
                    <>
                        <button
                            type="button"
                            className="btn btn-ghost"
                            style={{ padding: '8px 12px', alignSelf: 'flex-start', fontSize: '13px', marginBottom: '8px' }}
                            onClick={() => setStep(1)}
                        >
                            ← Back to Drop Type
                        </button>

                        <div className="section-block" style={{ marginBottom: '8px' }}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="pickup">
                                    <MapPin size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                    Pickup Address
                                </label>
                                <input id="pickup" name="pickup" className="form-input" placeholder="Origin address details" value={form.pickup} onChange={handleChange} required />
                            </div>

                            <div className="form-group" style={{ marginTop: '16px' }}>
                                <label className="form-label" htmlFor="delivery">
                                    <Navigation size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                    Delivery Address
                                </label>
                                <input id="delivery" name="delivery" className="form-input" placeholder="Destination address details" value={form.delivery} onChange={handleChange} required />
                            </div>

                            <div className="form-group" style={{ marginTop: '16px' }}>
                                <label className="form-label" htmlFor="distance">
                                    <Ruler size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                    Distance (km)
                                </label>
                                <input
                                    id="distance"
                                    name="distance"
                                    type="number"
                                    inputMode="decimal"
                                    min="0.1"
                                    step="0.1"
                                    className="form-input"
                                    placeholder="e.g. 5"
                                    value={form.distance}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="divider" style={{ margin: '8px 0' }} />

                        <div className="section-block" style={{ marginBottom: '8px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                                {form.dropType === 'parcel' && (
                                    <>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="itemType">
                                                <Package size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                                Item Type
                                            </label>
                                            <select id="itemType" name="itemType" className="form-input" value={form.itemType} onChange={handleChange}>
                                                <option value="Grocery">Grocery</option>
                                                <option value="Electronic Item">Electronic Item</option>
                                                <option value="Medicine">Medicine</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="weight">
                                                <Scale size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                                Weight (kg)
                                            </label>
                                            <input id="weight" name="weight" type="number" max="15" step="0.5" className="form-input" placeholder="Max 15kg" value={form.weight} onChange={handleChange} required />
                                        </div>
                                    </>
                                )}

                                <div className="form-group">
                                    <label className="form-label" htmlFor="vehicleReq">
                                        <Bike size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                        Carrier Required
                                    </label>
                                    <select id="vehicleReq" name="vehicleReq" className="form-input" value={form.vehicleReq} onChange={handleChange}>
                                        <option value="2-wheeler">2-Wheeler</option>
                                        <option value="4-wheeler" disabled>4-Wheeler (Currently Not Available)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {form.dropType === 'parcel' && (
                            <>
                                <div className="divider" style={{ margin: '8px 0' }} />

                                <div className="section-block" style={{ marginBottom: '8px' }}>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="senderPhone">
                                            <Phone size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                            Sender Phone (Optional)
                                        </label>
                                        <input id="senderPhone" name="senderPhone" type="tel" className="form-input" placeholder="Your alternative phone no" value={form.senderPhone} onChange={handleChange} />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', marginTop: '16px' }}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="receiverName">
                                                <UserIcon size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                                Receiver Name
                                            </label>
                                            <input id="receiverName" name="receiverName" className="form-input" placeholder="Name" value={form.receiverName} onChange={handleChange} required={form.dropType === 'parcel'} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="receiverPhone">
                                                <Phone size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                                Receiver Phone
                                            </label>
                                            <input id="receiverPhone" name="receiverPhone" type="tel" className="form-input" placeholder="Phone" value={form.receiverPhone} onChange={handleChange} required={form.dropType === 'parcel'} />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Price preview */}
                        {price !== null && (
                            <div className="price-preview" style={{ marginTop: '16px' }}>
                                <span className="price-label">Delivery charge</span>
                                <span className="price-value">₹{price.toFixed(0)}</span>
                                <span className="price-formula">{form.distance} km × ₹10</span>
                            </div>
                        )}

                        <div className="divider" />

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitted}
                            id="submit-order-btn"
                            style={{ background: form.dropType === 'parcel' ? 'var(--amber)' : 'var(--teal)' }}
                        >
                            {submitted ? <span className="spinner" /> : <>Confirm Order <ArrowRight size={16} /></>}
                        </button>
                    </>
                )}
            </form>
        </MobileLayout>
    );
}
