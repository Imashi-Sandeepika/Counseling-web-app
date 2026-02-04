import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

const CounselorInterview = () => {
    const { navigate, setStore, store } = useStore();
    const [formData, setFormData] = useState({ date: '', time: '' });
    const [loading, setLoading] = useState(false);

    const isBooked = store.counselorInterviewed;

    const handleBook = async (e) => {
        e.preventDefault();
        if (!formData.date || !formData.time) {
            alert("Please select a date and time.");
            return;
        }
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setStore(prev => ({ ...prev, counselorInterviewed: true }));
            setLoading(false);
            alert("Interview request sent successfully! You have passed this stage.");
        }, 1000);
    };

    return (
        <section className="view active">
            <div className="panel">
                <button className="back-btn" onClick={() => navigate('register-counselor')}>← Back to Registration</button>
                <h2>Counselor Interview Session</h2>

                <div style={{ marginTop: '20px' }}>
                    <p>The interview is a critical part of our verification process. During this session, we will discuss your approach, ethical standards, and experience.</p>

                    <div style={{ marginTop: '30px', padding: '30px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '16px', textAlign: 'center' }}>
                        {isBooked ? (
                            <div style={{ padding: '20px' }}>
                                <div style={{ fontSize: '3em', marginBottom: '15px' }}>✅</div>
                                <h3 style={{ color: 'var(--good)' }}>Interview Session Verified</h3>
                                <p style={{ color: 'var(--muted)' }}>Your session has been successfully booked and preliminary details verified. You can now proceed with your registration.</p>
                                <button className="btn-formal" style={{ marginTop: '20px' }} onClick={() => navigate('register-counselor')}>Return to Registration</button>
                            </div>
                        ) : (
                            <div>
                                <h3 style={{ marginBottom: '10px' }}>Schedule Your Official Interview</h3>
                                <p style={{ color: 'var(--muted)', marginBottom: '25px', fontSize: '0.9em' }}>Interviews are conducted via Zoom. Please select a time slot that fits your schedule.</p>

                                <form onSubmit={handleBook}>
                                    <div className="grid two" style={{ marginBottom: '20px', textAlign: 'left' }}>
                                        <label>Preferred Date
                                            <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                                        </label>
                                        <label>Preferred Time
                                            <input type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} required />
                                        </label>
                                    </div>
                                    <button type="submit" className="btn-formal" style={{ width: '100%', padding: '12px' }} disabled={loading}>
                                        {loading ? 'Processing Request...' : 'Book Interview & Verify Stage'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CounselorInterview;
