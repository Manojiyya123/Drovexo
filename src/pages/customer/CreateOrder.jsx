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
        senderPhone: '',
        receiverName: '',
        receiverPhone: ''
    });
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
                            <label className="form-label" htmlFor="vehicleReq">
                                <Bike size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                Carrier Required
                            </label>
                            <select id="vehicleReq" name="vehicleReq" className="form-input" value={form.vehicleReq} onChange={handleChange}>
                                <option value="2-wheeler">2-Wheeler</option>
                                <option value="4-wheeler">4-Wheeler</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="weight">
                                <Scale size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                Weight (kg)
                            </label>
                            <input id="weight" name="weight" type="number" max="15" step="0.5" className="form-input" placeholder="Max 15kg" value={form.weight} onChange={handleChange} required />
                        </div>
                    </div>
                </div>

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
                            <input id="receiverName" name="receiverName" className="form-input" placeholder="Name" value={form.receiverName} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="receiverPhone">
                                <Phone size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                Receiver Phone
                            </label>
                            <input id="receiverPhone" name="receiverPhone" type="tel" className="form-input" placeholder="Phone" value={form.receiverPhone} onChange={handleChange} required />
                        </div>
                    </div>
                </div>

                {/* Price preview */}
                {price !== null && (
                    <div className="price-preview" style={{ marginTop: '16px' }}>
                        <span className="price-label">Delivery charge</span>
                        <span className="price-value">₹{price.toFixed(0)}</span>
                        <span className="price-formula">{form.distance} km × ₹10</span>
                    </div>
                )}

                <div className="divider" />

                <button type="submit" className="btn btn-primary" disabled={submitted} id="submit-order-btn">
                    {submitted ? <span className="spinner" /> : <>Confirm Order <ArrowRight size={16} /></>}
                </button>
            </form>
        </MobileLayout>
    );
}
