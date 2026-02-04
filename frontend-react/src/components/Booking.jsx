import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

const Booking = ({ counselor, onBack }) => {
    const { api, store, navigate } = useStore();
    const [formData, setFormData] = useState({ date: '', time: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await api('/api/appointments', 'POST', {
            cid: counselor.id,
            date: formData.date,
            time: formData.time,
            email: store.user.email
        });
        if (res && res.ok) {
            alert("Booking request sent! Now proceeding to payment.");
            // Move to payment view (simulated by a state or separate view)
            // For this migration, we'll just say it's done or navigate to a mock payment
            navigate('home'); // Simplified for now
        }
        setLoading(false);
    };

    return (
        <div className="panel">
            <button className="back-btn" onClick={onBack}>← Back</button>
            <h3>Book Appointment with {counselor.name}</h3>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', margin: '20px 0' }}>
                <img src={counselor.profileImage || '/images/Counselor.jpg'} alt={counselor.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                    <div style={{ fontWeight: 'bold' }}>{counselor.specialty || 'Mental Health Professional'}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.9em' }}>{counselor.education}</div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid two">
                    <label>Select Date<input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required /></label>
                    <label>Select Time<input type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} required /></label>
                </div>
                <button type="submit" className="btn-formal" style={{ width: '100%', marginTop: '20px' }} disabled={loading}>
                    Confirm and Pay
                </button>
            </form>
        </div>
    );
};

export default Booking;
