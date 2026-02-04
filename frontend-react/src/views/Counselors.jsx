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
        <section id="counselors" className="view active animate-in">
            <div className="panel hero-section" style={{
                minHeight: '220px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                background: "linear-gradient(rgba(5, 7, 10, 0.7), rgba(5, 7, 10, 0.7)), url('/images/therapy.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: 'none'
            }}>
                <h3 className="hero-text" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Professional Guidance</h3>

                <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '600px' }}>Join live sessions with the counselor, utilizing tools such as Google Meet or Zoom. Equivalent to physical counseling, conducted entirely online.</p>
                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="badge" style={{ background: 'rgba(50, 222, 132, 0.2)', color: 'var(--good)' }}>Verfied Counselors</span>
                </div>
            </div>

            <div style={{ marginTop: '30px' }}>
                <h2 style={{ marginBottom: '20px', fontSize: '1.8rem' }}>Available Counselors</h2>
                {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading counselors...</p> : (
                    <div className="grid grid-cols-2">
                        {counselors.map((c, i) => (
                            <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div className="person-card">
                                    <img
                                        src={c.profileImage ? (c.profileImage.startsWith('/') ? c.profileImage : '/' + c.profileImage) : '/images/Counselor.jpg'}
                                        alt={c.name}
                                        className="avatar"
                                    />
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{c.name}</h4>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>{c.details?.education || c.education || 'Counselor'}</div>
                                        <div className="badge badge-success" style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            {c.country}
                                            {c.flag && (c.flag.includes('/') ?
                                                <img src={'/' + c.flag.replace(/^picures\//, 'images/')} alt="" style={{ height: '12px', width: 'auto', borderRadius: '2px' }} /> :
                                                <span>{c.flag}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bars-container">
                                    <div style={{ marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                            <span>Empathy</span>
                                            <span style={{ color: 'var(--good)' }}>{Math.round((c.ratings?.empathy || 4) * 20)}%</span>
                                        </div>
                                        <div className="bar">
                                            <span style={{ width: `${(c.ratings?.empathy || 4) * 20}%` }}></span>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                            <span>Clarity & Impact</span>
                                            <span style={{ color: 'var(--accent)' }}>{Math.round((c.ratings?.clarity || 4) * 20)}%</span>
                                        </div>
                                        <div className="bar">
                                            <span style={{ width: `${(c.ratings?.clarity || 4) * 20}%`, background: 'var(--accent)' }}></span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="btn-formal"
                                    style={{ width: '100%' }}
                                    onClick={() => {
                                        setSelectedCounselor(c);
                                        addActivity('booking_start', c.name);
                                    }}
                                >
                                    Book Session
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ marginTop: '60px', borderTop: '1px solid var(--border)', paddingTop: '40px' }}>
                <div className="panel" style={{ border: '2px solid var(--accent)', background: 'rgba(50, 222, 132, 0.02)', padding: '40px' }}>
                    <h3 style={{ color: 'var(--accent)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        💳 Payment Policy & Status
                    </h3>

                    <div className="panel-lite" style={{
                        borderLeft: '5px solid var(--accent)',
                        marginBottom: '30px',
                        background: 'var(--surface-hover)',
                        padding: '25px',
                        borderRadius: '0 15px 15px 0'
                    }}>
                        <p style={{ fontWeight: '700', fontSize: '1.2em', margin: 0, color: 'var(--text)', lineHeight: '1.5' }}>
                            "If your counselor accepts your appointment only, you should proceed with the payment."
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', marginBottom: '45px' }}>
                        <button className="btn-formal" style={{ background: 'var(--good)', border: 'none', padding: '15px 35px', fontSize: '1rem' }}>
                            I Understand
                        </button>
                        <button className="btn-formal" style={{ background: 'var(--accent)', border: 'none', padding: '15px 35px', fontSize: '1rem' }}>
                            Proceed to Payment
                        </button>
                    </div>

                    {/* Integrated Payment Gateway Mockup (No Pictures) */}
                    <div style={{
                        background: '#fff',
                        padding: '40px',
                        borderRadius: '24px',
                        border: '1px solid #ddd',
                        boxShadow: '0 25px 60px rgba(0,0,0,0.15)',
                        maxWidth: '600px',
                        margin: '0 auto',
                        color: '#333'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
                            <div style={{ fontWeight: '900', color: '#1a1a1b', fontSize: '1.6rem', letterSpacing: '-0.5px' }}>
                                Enter Your Details
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div style={{ width: '45px', height: '28px', background: '#f8f9fa', borderRadius: '6px', border: '1px solid #eee' }}></div>
                                <div style={{ width: '45px', height: '28px', background: '#f8f9fa', borderRadius: '6px', border: '1px solid #eee' }}></div>
                                <div style={{ width: '45px', height: '28px', background: '#f8f9fa', borderRadius: '6px', border: '1px solid #eee' }}></div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            <div style={{ textAlign: 'left' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#888', marginBottom: '10px', display: 'block', textTransform: 'uppercase' }}>Cardholder Name</label>
                                <input type="text" placeholder="Full Name (e.g. John Doe)" disabled style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e0e0e0', background: '#fcfcfc', color: '#222', fontSize: '1rem' }} />
                            </div>

                            <div style={{ textAlign: 'left', position: 'relative' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#888', marginBottom: '10px', display: 'block', textTransform: 'uppercase' }}>Card Number</label>
                                <input type="text" placeholder="0000 0000 0000 0000" disabled style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    border: '1px solid #e0e0e0',
                                    background: '#fcfcfc',
                                    color: '#222',
                                    fontSize: '1.1rem',
                                    letterSpacing: '2px'
                                }} />
                                <span style={{ position: 'absolute', right: '18px', bottom: '16px', fontSize: '1.4rem' }}>💳</span>
                            </div>

                            <div style={{ display: 'flex', gap: '25px' }}>
                                <div style={{ flex: 1, textAlign: 'left' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#888', marginBottom: '10px', display: 'block', textTransform: 'uppercase' }}>Expiry</label>
                                    <input type="text" placeholder="MM/YY" disabled style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e0e0e0', background: '#fcfcfc', color: '#222' }} />
                                </div>
                                <div style={{ flex: 1, textAlign: 'left' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#888', marginBottom: '10px', display: 'block', textTransform: 'uppercase' }}>CVC</label>
                                    <input type="text" placeholder="***" disabled style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e0e0e0', background: '#fcfcfc', color: '#222' }} />
                                </div>
                            </div>
                        </div>

                        <button className="btn-formal" style={{
                            width: '100%',
                            marginTop: '40px',
                            background: '#1a1a1b',
                            color: '#fff',
                            padding: '20px',
                            fontWeight: '800',
                            borderRadius: '14px',
                            fontSize: '1.1rem',
                            cursor: 'not-allowed',
                            border: 'none',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                        }} disabled>
                            Confirm & Pay Securely
                        </button>

                        <div style={{ marginTop: '25px', textAlign: 'center', color: '#aaa', fontSize: '0.8rem', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                            🔒 Bank-Grade Security • Informational Demo Mode
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Counselors;
