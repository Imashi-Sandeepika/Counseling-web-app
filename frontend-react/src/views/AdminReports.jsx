import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const AdminReports = () => {
    const { api } = useStore();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const data = await api('/api/admin/stats');
            if (data && !data.error) {
                setStats(data);
            }
            setLoading(false);
        };
        fetchStats();
    }, [api]);

    if (loading) return (
        <section className="view active animate-in" style={{ textAlign: 'center', padding: '100px' }}>
            <div style={{ fontSize: '3rem' }}>📊</div>
            <p>Gathering platform insights...</p>
        </section>
    );

    const cards = [
        { label: 'Total Users', value: stats?.users || 0, icon: '👥', color: 'var(--primary)' },
        { label: 'Registered Counselors', value: stats?.counselors || 0, icon: '👨‍⚕️', color: 'var(--accent)' },
        { label: 'Total Appointments', value: stats?.appointments || 0, icon: '📅', color: 'var(--good)' },
    ];

    return (
        <section id="admin-reports" className="view active animate-in">
            <div className="hero" style={{ marginBottom: '40px' }}>
                <h1 className="hero-text" style={{ fontSize: '3rem' }}>📊 Reports & Analytics</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    Real-time monitoring of platform growth and user sentiment
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                {cards.map((card, i) => (
                    <div key={i} className="panel" style={{ padding: '30px', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{card.icon}</div>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: card.color }}>{card.value}</div>
                        <div style={{ color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
                            {card.label}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                {/* Appointment Status Distribution */}
                <div className="panel" style={{ padding: '30px' }}>
                    <h3 style={{ marginBottom: '25px', fontSize: '1.2rem' }}>Appointment Status</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {Object.entries(stats?.status_distribution || {}).map(([status, count]) => {
                            const total = stats.appointments || 1;
                            const percentage = Math.round((count / total) * 100);
                            return (
                                <div key={status}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                        <span style={{ textTransform: 'capitalize' }}>{status}</span>
                                        <span style={{ fontWeight: 'bold' }}>{count} ({percentage}%)</span>
                                    </div>
                                    <div style={{ height: '8px', background: 'var(--surface-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${percentage}%`,
                                            background: status === 'confirmed' ? 'var(--good)' : status === 'pending' ? 'var(--warning)' : 'var(--accent)',
                                            borderRadius: '4px'
                                        }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                
            </div>
        </section>
    );
};

export default AdminReports;
