import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const AdminAppointments = () => {
    const { api } = useStore();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchAppointments = async () => {
            const data = await api('/api/appointments');
            if (Array.isArray(data)) {
                setAppointments(data.sort((a, b) => b.ts - a.ts));
            }
            setLoading(false);
        };
        fetchAppointments();
    }, [api]);

    const updateStatus = async (appointmentId, newStatus) => {
        const result = await api(`/api/appointments/${appointmentId}`, 'PUT', {
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

    const filteredAppointments = appointments.filter(apt =>
        filter === 'all' ? true : apt.status === filter
    );

    const stats = {
        total: appointments.length,
        pending: appointments.filter(a => a.status === 'pending').length,
        confirmed: appointments.filter(a => a.status === 'confirmed').length,
        completed: appointments.filter(a => a.status === 'completed').length
    };

    return (
        <section id="admin-appointments" className="view active animate-in">
            <div className="hero" style={{ marginBottom: '40px' }}>
                <h1 className="hero-text" style={{ fontSize: '3rem' }}>📅 Appointment Control</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    Oversee and manage counseling sessions across the platform
                </p>
            </div>

            {/* Stats Overview */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '40px'
            }}>
                <div className="panel" style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.total}</div>
                    <div style={{ color: 'var(--text-muted)' }}>Total Appointments</div>
                </div>
                <div className="panel" style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>{stats.pending}</div>
                    <div style={{ color: 'var(--text-muted)' }}>Pending</div>
                </div>
                <div className="panel" style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--good)' }}>{stats.confirmed}</div>
                    <div style={{ color: 'var(--text-muted)' }}>Confirmed</div>
                </div>
                <div className="panel" style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>{stats.completed}</div>
                    <div style={{ color: 'var(--text-muted)' }}>Completed</div>
                </div>
            </div>

            <div className="panel" style={{ padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                    <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Recent Appointments</h3>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        {['all', 'pending', 'confirmed', 'completed', 'declined'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: filter === f ? 'var(--primary)' : 'var(--surface)',
                                    color: filter === f ? '#fff' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    textTransform: 'capitalize',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
                        <div>Loading appointments...</div>
                    </div>
                ) : filteredAppointments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        No appointments found matching this filter.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {filteredAppointments.map((apt) => (
                            <div key={apt.id} style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '20px',
                                padding: '20px',
                                background: 'var(--surface-hover)',
                                borderRadius: '12px',
                                borderLeft: `4px solid ${getStatusColor(apt.status)}`
                            }}>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>CLIENT</div>
                                    <div style={{ fontWeight: '500' }}>{apt.userEmail}</div>
                                </div>

                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>COUNSELOR</div>
                                    <div style={{ fontWeight: '500' }}>{apt.counselorName}</div>
                                </div>

                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>DATE & TIME</div>
                                    <div>{apt.date} @ {apt.time}</div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                                    <span style={{
                                        color: getStatusColor(apt.status),
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                        fontSize: '0.9rem'
                                    }}>
                                        {apt.status}
                                    </span>

                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        {apt.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => updateStatus(apt.id, 'confirmed')}
                                                    title="Approve"
                                                    style={{ padding: '5px 10px', background: 'var(--good)', border: 'none', borderRadius: '5px', cursor: 'pointer', color: '#fff' }}
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(apt.id, 'declined')}
                                                    title="Decline"
                                                    style={{ padding: '5px 10px', background: 'var(--bad)', border: 'none', borderRadius: '5px', cursor: 'pointer', color: '#fff' }}
                                                >
                                                    ✗
                                                </button>
                                            </>
                                        )}
                                        {apt.status === 'confirmed' && (
                                            <button
                                                onClick={() => updateStatus(apt.id, 'completed')}
                                                title="Mark Complete"
                                                style={{ padding: '5px 10px', background: 'var(--accent)', border: 'none', borderRadius: '5px', cursor: 'pointer', color: '#fff' }}
                                            >
                                                ✓ Complete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default AdminAppointments;
