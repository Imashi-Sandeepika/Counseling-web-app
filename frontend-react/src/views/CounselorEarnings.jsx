import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const CounselorEarnings = () => {
    const { store, api } = useStore();
    const [stats, setStats] = useState({
        completedSessions: 0,
        pendingEarnings: 0,
        totalWithdrawn: 0,
        recentSessions: []
    });
    const [loading, setLoading] = useState(true);

    const RATE_PER_SESSION = 50; // Mock rate for demo

    useEffect(() => {
        const fetchEarnings = async () => {
            if (!store.counselor.id) return;
            const data = await api(`/api/appointments?cid=${store.counselor.id}`);
            if (Array.isArray(data)) {
                const completed = data.filter(a => a.status === 'completed');
                const pending = data.filter(a => a.status === 'confirmed');

                setStats({
                    completedSessions: completed.length,
                    pendingEarnings: pending.length * RATE_PER_SESSION,
                    totalWithdrawn: 0, // Mock value
                    recentSessions: completed.slice(0, 5)
                });
            }
            setLoading(false);
        };
        fetchEarnings();
    }, [store.counselor.id, api]);

    const totalEarnings = stats.completedSessions * RATE_PER_SESSION;

    return (
        <section id="counselor-earnings" className="view active animate-in">
            <div className="hero" style={{ marginBottom: '40px' }}>
                <h1 className="hero-text" style={{ fontSize: '3rem' }}>💰 My Earnings</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    Track your income and session history
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div className="panel" style={{ padding: '30px', textAlign: 'center', borderTop: '4px solid var(--accent)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px' }}>Total Earnings</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>${totalEarnings}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--good)', marginTop: '5px' }}>Ready for withdrawal</div>
                </div>

                <div className="panel" style={{ padding: '30px', textAlign: 'center', borderTop: '4px solid var(--warning)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px' }}>Pending (Upcoming)</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>${stats.pendingEarnings}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '5px' }}>From confirmed sessions</div>
                </div>

                <div className="panel" style={{ padding: '30px', textAlign: 'center', borderTop: '4px solid var(--primary)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px' }}>Sessions Completed</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>{stats.completedSessions}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '5px' }}>Lifetime total</div>
                </div>
            </div>

            <div className="panel" style={{ padding: '30px' }}>
                <h3 style={{ marginBottom: '25px', fontSize: '1.2rem' }}>Recent Paid Sessions</h3>
                {loading ? (
                    <div>Loading history...</div>
                ) : stats.recentSessions.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No completed sessions yet.</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {stats.recentSessions.map((session, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '15px 20px',
                                background: 'var(--surface-hover)',
                                borderRadius: '10px'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{session.userEmail}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{session.date} @ {session.time}</div>
                                </div>
                                <div style={{ fontWeight: '800', color: 'var(--good)' }}>+${RATE_PER_SESSION}.00</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default CounselorEarnings;
