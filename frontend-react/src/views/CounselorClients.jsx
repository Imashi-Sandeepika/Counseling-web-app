import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const CounselorClients = () => {
    const { store, api } = useStore();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClients = async () => {
            if (!store.counselor.id) return;
            const data = await api(`/api/counselor/clients?cid=${store.counselor.id}`);
            if (Array.isArray(data)) {
                setClients(data);
            }
            setLoading(false);
        };
        fetchClients();
    }, [store.counselor.id, api]);

    return (
        <section id="counselor-clients" className="view active animate-in">
            <div className="hero" style={{ marginBottom: '40px' }}>
                <h1 className="hero-text" style={{ fontSize: '3rem' }}>👥 My Clients</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    View and manage your client base
                </p>
            </div>

            <div className="panel" style={{ padding: '30px' }}>
                <h3 style={{ marginBottom: '25px', fontSize: '1.5rem' }}>Client Overview</h3>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
                        <div>Loading clients...</div>
                    </div>
                ) : clients.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '20px', opacity: 0.3 }}>👥</div>
                        <p>You don't have any clients yet. New clients will appear here once they book an appointment.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        {clients.map((client, i) => (
                            <div key={i} className="panel" style={{
                                padding: '25px',
                                background: 'var(--surface-hover)',
                                borderLeft: '4px solid var(--accent)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%',
                                        background: 'var(--accent)20',
                                        color: 'var(--accent)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold'
                                    }}>
                                        {client.name[0]}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{client.name}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{client.email}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '20px', borderTop: '1px solid var(--surface)', paddingTop: '15px' }}>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '3px' }}>Completed Sessions</div>
                                        <div style={{ fontWeight: 'bold', color: 'var(--text)' }}>{client.total_sessions}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '3px' }}>Last Session</div>
                                        <div style={{ fontWeight: 'bold', color: 'var(--text)' }}>{client.last_session || 'N/A'}</div>
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

export default CounselorClients;
