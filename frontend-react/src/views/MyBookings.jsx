import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const MyBookings = () => {
    const { store, api, navigate } = useStore();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            const data = await api(`/api/appointments?email=${store.user.email}`);
            if (Array.isArray(data)) {
                // Sort by date (most recent first)
                const sorted = data.sort((a, b) => b.ts - a.ts);
                setAppointments(sorted);
            }
            setLoading(false);
        };
        fetchAppointments();
    }, [store.user.email]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'var(--good)';
            case 'pending': return 'var(--warning)';
            case 'declined': return 'var(--bad)';
            case 'completed': return 'var(--accent)';
            default: return 'var(--text-muted)';
        }
    };

    const getStatusBadge = (status) => {
        const color = getStatusColor(status);
        return (
            <span style={{
                background: `${color}20`,
                color: color,
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            }}>
                {status}
            </span>
        );
    };

    return (
        <section id="my-bookings" className="view active animate-in">
            <div className="hero" style={{ marginBottom: '40px' }}>
                <h1 className="hero-text" style={{ fontSize: '3rem' }}>📅 My Appointments</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    View and manage your counseling sessions
                </p>
            </div>

            {loading ? (
                <div className="panel" style={{ textAlign: 'center', padding: '60px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
                    <p style={{ color: 'var(--text-muted)' }}>Loading your appointments...</p>
                </div>
            ) : appointments.length === 0 ? (
                <div className="panel" style={{ textAlign: 'center', padding: '80px 40px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.3 }}>📭</div>
                    <h3 style={{ marginBottom: '15px', fontSize: '1.5rem' }}>No Appointments Yet</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '30px', maxWidth: '500px', margin: '0 auto 30px' }}>
                        You haven't booked any counseling sessions yet. Browse our verified counselors and schedule your first session.
                    </p>
                    <button className="btn-formal" onClick={() => navigate('counselors')}>
                        Browse Counselors
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {appointments.map((apt, index) => (
                        <div key={apt.id || index} className="panel" style={{
                            padding: '30px',
                            position: 'relative',
                            borderLeft: `5px solid ${getStatusColor(apt.status)}`,
                            background: 'var(--surface)',
                            transition: 'all 0.3s ease'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                                <div style={{ flex: 1, minWidth: '250px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                        <div style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '50%',
                                            background: 'var(--accent)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.5rem',
                                            fontWeight: 'bold',
                                            color: 'white'
                                        }}>
                                            {apt.counselorName ? apt.counselorName.charAt(0).toUpperCase() : '👨‍⚕️'}
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{apt.counselorName || 'Counselor'}</h3>
                                            <p style={{ margin: '5px 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                Professional Counselor
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '20px' }}>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'uppercase', fontWeight: '600' }}>
                                                📅 Date
                                            </div>
                                            <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                                                {apt.date}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'uppercase', fontWeight: '600' }}>
                                                ⏰ Time
                                            </div>
                                            <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                                                {apt.time}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'uppercase', fontWeight: '600' }}>
                                                💳 Payment
                                            </div>
                                            <div style={{ fontSize: '1rem', fontWeight: '600', color: apt.paymentStatus === 'paid' ? 'var(--good)' : 'var(--warning)' }}>
                                                {apt.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Pending'}
                                            </div>
                                        </div>
                                    </div>

                                    {apt.zoomLink && apt.status === 'confirmed' && (
                                        <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(50, 222, 132, 0.1)', borderRadius: '12px', border: '1px solid var(--good)' }}>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--good)', marginBottom: '8px', fontWeight: '700', textTransform: 'uppercase' }}>
                                                🔗 Session Link
                                            </div>
                                            <a href={apt.zoomLink} target="_blank" rel="noopener noreferrer"
                                                style={{ color: 'var(--accent)', fontSize: '0.9rem', wordBreak: 'break-all', textDecoration: 'underline' }}>
                                                {apt.zoomLink}
                                            </a>
                                            {apt.passcode && (
                                                <div style={{ marginTop: '8px', fontSize: '0.85rem' }}>
                                                    <strong>Passcode:</strong> {apt.passcode}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-end' }}>
                                    {getStatusBadge(apt.status)}

                                    {apt.status === 'completed' && (
                                        <button
                                            className="btn-formal"
                                            style={{ padding: '10px 20px', fontSize: '0.85rem', background: 'var(--accent)' }}
                                            onClick={() => navigate('feedback', { appointmentId: apt.id })}
                                        >
                                            ⭐ Leave Feedback
                                        </button>
                                    )}

                                    {apt.status === 'confirmed' && (
                                        <div style={{
                                            padding: '10px 15px',
                                            background: 'rgba(50, 222, 132, 0.1)',
                                            borderRadius: '8px',
                                            fontSize: '0.8rem',
                                            color: 'var(--good)',
                                            fontWeight: '600'
                                        }}>
                                            ✓ Ready to Join
                                        </div>
                                    )}
                                </div>
                            </div>

                            {apt.status === 'pending' && (
                                <div style={{
                                    marginTop: '20px',
                                    padding: '15px',
                                    background: 'rgba(255, 193, 7, 0.1)',
                                    borderRadius: '8px',
                                    border: '1px solid var(--warning)',
                                    fontSize: '0.9rem',
                                    color: 'var(--text-muted)'
                                }}>
                                    <strong style={{ color: 'var(--warning)' }}>⏳ Awaiting Confirmation:</strong> Your counselor will review and respond to your booking request soon.
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div style={{ marginTop: '60px', textAlign: 'center' }}>
                <button className="btn-formal" onClick={() => navigate('counselors')} style={{ padding: '15px 40px' }}>
                    🔍 Book Another Session
                </button>
            </div>
        </section>
    );
};

export default MyBookings;
