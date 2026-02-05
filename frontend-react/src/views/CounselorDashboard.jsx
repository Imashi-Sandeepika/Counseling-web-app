import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const CounselorDashboard = () => {
    const { api, store, navigate } = useStore();
    const [appointments, setAppointments] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!store.counselor.id) return;
            const cid = store.counselor.id;

            const [appts, feeds] = await Promise.all([
                api(`/api/appointments?cid=${cid}`),
                api(`/api/feedback?cid=${cid}`)
            ]);

            if (Array.isArray(appts)) setAppointments(appts);
            if (Array.isArray(feeds)) setFeedback(feeds);

            setLoading(false);
        };
        fetchData();
    }, [store.counselor.id, api]);

    const stats = {
        pending: appointments.filter(a => a.status === 'pending').length,
        confirmed: appointments.filter(a => a.status === 'confirmed').length,
        completed: appointments.filter(a => a.status === 'completed').length
    };

    return (
        <section id="counselor-dashboard" className="view active animate-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 className="hero-text" style={{ margin: 0 }}>Welcome back, {store.counselor.name}</h1>
                <div style={{ padding: '8px 16px', background: 'var(--accent)', color: 'white', borderRadius: '8px', fontWeight: 'bold' }}>
                    COUNSELOR PORTAL
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div className="panel" onClick={() => navigate('counselor-appointments')} style={{ cursor: 'pointer', textAlign: 'center', padding: '20px', borderTop: '4px solid var(--warning)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.pending}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Pending Requests</div>
                </div>
                <div className="panel" onClick={() => navigate('counselor-appointments')} style={{ cursor: 'pointer', textAlign: 'center', padding: '20px', borderTop: '4px solid var(--good)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.confirmed}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Confirmed Sessions</div>
                </div>
                <div className="panel" onClick={() => navigate('counselor-earnings')} style={{ cursor: 'pointer', textAlign: 'center', padding: '20px', borderTop: '4px solid var(--accent)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.completed}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Completed Sessions</div>
                </div>
            </div>

            <div className="grid two" style={{ gap: '30px' }}>
                <div className="panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3>Recent Appointments</h3>
                        <button onClick={() => navigate('counselor-appointments')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.8rem' }}>View All</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {appointments.length > 0 ? appointments.slice(0, 5).map((a, i) => (
                            <div key={i} style={{ padding: '12px', background: 'var(--surface-hover)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{a.userEmail}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.date} @ {a.time}</div>
                                </div>
                                <span style={{
                                    fontSize: '0.7rem',
                                    padding: '3px 8px',
                                    borderRadius: '10px',
                                    background: a.status === 'confirmed' ? 'var(--good)20' : a.status === 'pending' ? 'var(--warning)20' : 'var(--border)',
                                    color: a.status === 'confirmed' ? 'var(--good)' : a.status === 'pending' ? 'var(--warning)' : 'var(--text-muted)',
                                    textTransform: 'uppercase',
                                    fontWeight: 'bold'
                                }}>
                                    {a.status}
                                </span>
                            </div>
                        )) : <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No appointments yet.</p>}
                    </div>
                </div>

                <div className="panel">
                    <h3>Recent Client Feedback</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                        {feedback.length > 0 ? feedback.slice(0, 5).map((f, i) => (
                            <div key={i} style={{ padding: '15px', background: 'var(--surface-hover)', borderRadius: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '1.2rem' }}>{f.sentiment === 'positive' ? '😊' : f.sentiment === 'negative' ? '😔' : '😐'}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>Rating: {f.rating}/5</span>
                                </div>
                                <div style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>"{f.comment || 'No comment provided'}"</div>
                            </div>
                        )) : <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No feedback received yet.</p>}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CounselorDashboard;
