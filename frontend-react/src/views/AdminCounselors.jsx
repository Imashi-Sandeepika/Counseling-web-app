import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const AdminCounselors = () => {
    const { api } = useStore();
    const [counselors, setCounselors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCounselors = async () => {
            const data = await api('/api/counselors');
            if (Array.isArray(data)) {
                setCounselors(data);
            }
            setLoading(false);
        };
        fetchCounselors();
    }, [api]);

    const toggleAvailability = async (id, currentStatus) => {
        const result = await api(`/api/counselors/${id}`, 'PUT', {
            available: !currentStatus
        });
        if (result.ok) {
            setCounselors(prev => prev.map(c =>
                c.id === id ? { ...c, available: !currentStatus } : c
            ));
        }
    };

    const deleteCounselor = async (id) => {
        if (!window.confirm("Are you sure you want to delete this counselor? This will also delete all their appointments.")) return;

        const result = await api(`/api/counselors/${id}`, 'DELETE');
        if (result.ok) {
            setCounselors(prev => prev.filter(c => c.id !== id));
        }
    };

    return (
        <section id="admin-counselors" className="view active animate-in">
            <div className="hero" style={{ marginBottom: '40px' }}>
                <h1 className="hero-text" style={{ fontSize: '3rem' }}>👨‍⚕️ Counselor Management</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    Oversee counselor accounts and platform availability
                </p>
            </div>

            <div className="panel" style={{ padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Registered Counselors ({counselors.length})</h3>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
                        <div>Loading counselors...</div>
                    </div>
                ) : counselors.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        No counselors found.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {counselors.map((c) => (
                            <div key={c.id} className="panel" style={{
                                display: 'grid',
                                gridTemplateColumns: 'auto 1fr auto auto',
                                gap: '25px',
                                alignItems: 'center',
                                padding: '20px',
                                background: 'var(--surface-hover)'
                            }}>
                                <img
                                    src={c.profileImage || '/images/Counselor.jpg'}
                                    alt={c.name}
                                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }}
                                />

                                <div style={{ minWidth: '200px' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{c.name}</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{c.email}</div>
                                    <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>
                                        <span style={{ color: 'var(--accent)' }}>{c.details.specialty}</span> • {c.details.experience} yrs exp
                                    </div>
                                </div>

                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '5px' }}>AVAILABILITY</div>
                                    <button
                                        onClick={() => toggleAvailability(c.id, c.available)}
                                        style={{
                                            padding: '6px 15px',
                                            borderRadius: '20px',
                                            border: 'none',
                                            background: c.available ? 'var(--good)20' : 'var(--bad)20',
                                            color: c.available ? 'var(--good)' : 'var(--bad)',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem'
                                        }}
                                    >
                                        {c.available ? '● ONLINE' : '○ OFFLINE'}
                                    </button>
                                </div>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {/* Additional actions could go here (e.g. View Details) */}
                                    <button
                                        onClick={() => deleteCounselor(c.id)}
                                        style={{
                                            background: 'var(--bad)',
                                            color: '#fff',
                                            border: 'none',
                                            padding: '10px',
                                            borderRadius: '8px',
                                            cursor: 'pointer'
                                        }}
                                        title="Delete Counselor"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default AdminCounselors;
