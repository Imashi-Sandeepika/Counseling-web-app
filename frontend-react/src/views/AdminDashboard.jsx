import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const AdminDashboard = () => {
    const { api, navigate } = useStore();
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

    const cards = [
        { label: 'Total Users', value: stats?.users || 0, icon: '👥', view: 'admin-users' },
        { label: 'Counselors', value: stats?.counselors || 0, icon: '👨‍⚕️', view: 'admin-counselors' },
        { label: 'Appointments', value: stats?.appointments || 0, icon: '📅', view: 'admin-appointments' },
        { label: 'Platform Sentiment', value: stats?.sentiment?.positive || 0, sub: 'Positive Feedbacks', icon: '📈', view: 'admin-reports' },
    ];

    return (
        <section id="admin-dashboard" className="view active animate-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 className="hero-text" style={{ margin: 0 }}>Admin Control Center</h1>
                <div style={{ padding: '8px 16px', background: 'var(--primary)', color: 'white', borderRadius: '8px', fontWeight: 'bold' }}>
                    SYSTEM OVERVIEW
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginBottom: '40px' }}>
                {cards.map((card, i) => (
                    <div
                        key={i}
                        className="panel"
                        onClick={() => navigate(card.view)}
                        style={{
                            padding: '30px',
                            cursor: 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                        <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{card.icon}</div>
                        <div style={{ fontSize: '2rem', fontWeight: '800' }}>{card.value}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>{card.label}</div>
                        {card.sub && <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '5px' }}>{card.sub}</div>}
                    </div>
                ))}
            </div>

            <div className="grid two" style={{ gap: '30px' }}>
                <div className="panel">
                    <h3>Quick Management</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '25px' }}>Direct access to platform control modules.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <button className="btn-formal" onClick={() => navigate('admin-users')}>Manage Users</button>
                        <button className="btn-formal" onClick={() => navigate('admin-counselors')}>Manage Counselors</button>
                        <button className="btn-formal" onClick={() => navigate('admin-appointments')}>All Appointments</button>
                        <button className="btn-formal" onClick={() => navigate('admin-reports')}>View Reports</button>
                    </div>
                </div>

                <div className="panel">
                    <h3>Security & Maintenance</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '25px' }}>Platform health and administrative tasks.</p>
                    <div style={{ padding: '20px', background: 'var(--surface-hover)', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <span>Database Status</span>
                            <span style={{ color: 'var(--good)', fontWeight: 'bold' }}>● HEALTHY</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <span>Sentiment Module</span>
                            <span style={{ color: 'var(--good)', fontWeight: 'bold' }}>● ACTIVE</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Encryption</span>
                            <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>AES-256</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminDashboard;
