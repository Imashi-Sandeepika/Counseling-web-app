import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import Booking from '../components/Booking';

const Counselors = () => {
    const { api, store, addActivity } = useStore();
    const [counselors, setCounselors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCounselor, setSelectedCounselor] = useState(null);

    useEffect(() => {
        const fetchCounselors = async () => {
            const res = await api('/api/counselors');
            if (Array.isArray(res)) setCounselors(res);
            setLoading(false);
        };
        fetchCounselors();
    }, []);

    if (selectedCounselor) {
        return (
            <section className="view active">
                <Booking
                    counselor={selectedCounselor}
                    onBack={() => setSelectedCounselor(null)}
                />
            </section>
        );
    }

    return (
        <section id="counselors" className="view active">
            <div className="panel card-hire-counselor">
                <h3>Client Session Section</h3>
                <p>Clients can join live sessions with the counselor, utilizing tools such as Google Meet or Zoom. These sessions are designed to be equivalent to physical counseling, but conducted entirely online.</p>
                <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(59, 211, 128, 0.1)', border: '1px solid var(--good)', borderRadius: '8px' }}>
                    <p style={{ margin: 0, color: 'var(--good)', fontSize: '0.9em' }}><strong>Secure Payments:</strong> All transactions are protected via industry-standard encryption.</p>
                </div>
            </div>

            <div className="panel">
                <h3>Available Counselors</h3>
                {loading ? <p>Loading counselors...</p> : (
                    <div className="grid two">
                        {counselors.map((c, i) => (
                            <div key={i} className="c-card" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                <div className="c-head" style={{ display: 'flex', gap: '15px' }}>
                                    <div className="c-avatar" style={{ width: '60px', height: '60px' }}>
                                        <img
                                            src={c.profileImage ? (c.profileImage.startsWith('/') ? c.profileImage : '/' + c.profileImage) : '/images/Counselor.jpg'}
                                            alt={c.name}
                                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: 0 }}>{c.name}</h4>
                                        <small style={{ color: 'var(--muted)' }}>{c.details?.education || c.education || 'Counselor'}</small>
                                        <div style={{ marginTop: '5px', fontSize: '0.8em', color: 'var(--accent)' }}>{c.country} {c.flag}</div>
                                    </div>
                                </div>

                                <div className="bars-container" style={{ marginTop: '15px' }}>
                                    <div style={{ marginBottom: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85em' }}>
                                            <span>Empathy</span>
                                            <span>{Math.round((c.ratings?.empathy || 4) * 20)}%</span>
                                        </div>
                                        <div className="bar" style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', marginTop: '4px' }}>
                                            <span style={{ display: 'block', height: '100%', background: 'var(--good)', width: `${(c.ratings?.empathy || 4) * 20}%` }}></span>
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85em' }}>
                                            <span>Clarity</span>
                                            <span>{Math.round((c.ratings?.clarity || 4) * 20)}%</span>
                                        </div>
                                        <div className="bar" style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', marginTop: '4px' }}>
                                            <span style={{ display: 'block', height: '100%', background: 'var(--accent)', width: `${(c.ratings?.clarity || 4) * 20}%` }}></span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="btn-formal"
                                    style={{ width: '100%', marginTop: '15px' }}
                                    onClick={() => {
                                        setSelectedCounselor(c);
                                        addActivity('booking_start', c.name);
                                    }}
                                >
                                    Book Appointment
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Counselors;
