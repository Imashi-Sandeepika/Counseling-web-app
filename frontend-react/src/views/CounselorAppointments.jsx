import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const CounselorAppointments = () => {
    const { store, api } = useStore();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            const data = await api(`/api/appointments?cid=${store.counselor.id}`);
            if (Array.isArray(data)) {
                setAppointments(data.sort((a, b) => b.ts - a.ts));
            }
            setLoading(false);
        };
        fetchAppointments();
    }, [store.counselor.id]);

    const updateStatus = async (appointmentId, newStatus) => {
        const result = await api('/api/appointments/update-status', 'POST', {
            appointmentId,
            status: newStatus
        });
        if (result.ok) {
            setAppointments(prev => prev.map(apt =>
                apt.id === appointmentId ? { ...apt, status: newStatus } : apt
            ));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'var(--good)';
            case 'pending': return 'var(--warning)';
            case 'declined': return 'var(--bad)';
            case 'completed': return 'var(--accent)';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <section id="counselor-appointments" className="view active animate-in">
            <div className="hero" style={{ marginBottom: '40px' }}>
                <h1 className="hero-text" style={{ fontSize: '3rem' }}>📅 My Appointments</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    Manage your counseling sessions with clients
                </p>
            </div>

            {loading ? (
                <div className="panel" style={{ textAlign: 'center', padding: '60px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
                    <p style={{ color: 'var(--text-muted)' }}>Loading appointments...</p>
                </div>
            ) : appointments.length === 0 ? (
                <div className="panel" style={{ textAlign: 'center', padding: '80px 40px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.3 }}>📭</div>
                    <h3 style={{ marginBottom: '15px', fontSize: '1.5rem' }}>No Appointments Yet</h3>
                    <p style={{ color: 'var(--text-muted)' }}>
                        You don't have any appointments scheduled at the moment.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {appointments.map((apt, index) => (
                        <div key={apt.id || index} className="panel" style={{
                            padding: '30px',
                            borderLeft: `5px solid ${getStatusColor(apt.status)}`
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ marginBottom: '10px', fontSize: '1.4rem' }}>
                                        Client: {apt.clientName || apt.email}
                                    </h3>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'uppercase', fontWeight: '600' }}>
                                                📅 Date
                                            </div>
                                            <div style={{ fontSize: '1rem', fontWeight: '600' }}>{apt.date}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'uppercase', fontWeight: '600' }}>
                                                ⏰ Time
                                            </div>
                                            <div style={{ fontSize: '1rem', fontWeight: '600' }}>{apt.time}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'uppercase', fontWeight: '600' }}>
                                                📧 Email
                                            </div>
                                            <div style={{ fontSize: '0.9rem' }}>{apt.email}</div>
                                        </div>
                                    </div>

                                    {apt.notes && (
                                        <div style={{ marginTop: '15px', padding: '15px', background: 'var(--surface-hover)', borderRadius: '8px' }}>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '5px', fontWeight: '600' }}>
                                                📝 Client Notes:
                                            </div>
                                            <div style={{ fontSize: '0.95rem' }}>{apt.notes}</div>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <span style={{
                                        background: `${getStatusColor(apt.status)}20`,
                                        color: getStatusColor(apt.status),
                                        padding: '8px 16px',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        textTransform: 'uppercase'
                                    }}>
                                        {apt.status}
                                    </span>

                                    {apt.status === 'pending' && (
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                className="btn-formal"
                                                style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'var(--good)' }}
                                                onClick={() => updateStatus(apt.id, 'confirmed')}
                                            >
                                                ✓ Confirm
                                            </button>
                                            <button
                                                className="btn-formal"
                                                style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'var(--bad)' }}
                                                onClick={() => updateStatus(apt.id, 'declined')}
                                            >
                                                ✗ Decline
                                            </button>
                                        </div>
                                    )}

                                    {apt.status === 'confirmed' && (
                                        <button
                                            className="btn-formal"
                                            style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'var(--accent)' }}
                                            onClick={() => updateStatus(apt.id, 'completed')}
                                        >
                                            ✓ Mark Complete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default CounselorAppointments;
