import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const AdminDashboard = () => {
    const { api, navigate } = useStore();
    const [stats, setStats] = useState({ users: 0, counselors: 0 });
    const [users, setUsers] = useState([]);
    const [counselors, setCounselors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // In a real app, these would be specific admin endpoints
            const uRes = await api('/api/admin/users'); // Mock or actual if endpoint exists
            const cRes = await api('/api/counselors');

            if (Array.isArray(uRes)) setUsers(uRes);
            if (Array.isArray(cRes)) setCounselors(cRes);

            setStats({
                users: Array.isArray(uRes) ? uRes.length : 0,
                counselors: Array.isArray(cRes) ? cRes.length : 0
            });
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleRemove = async (type, id) => {
        if (!window.confirm(`Are you sure you want to remove this ${type}?`)) return;
        const res = await api(`/api/admin/remove-${type}`, 'POST', { id });
        if (res && res.ok) {
            alert(`${type} removed.`);
            // Refresh data
        }
    };

    return (
        <section id="admin-dashboard" className="view active">
            <div className="grid two">
                <div className="panel" style={{ borderTop: '4px solid var(--accent)' }}>
                    <h2>Quick Actions</h2>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
                        <button className="btn-formal" style={{ flex: 1 }} onClick={() => navigate('register-counselor')}>Add Counselor</button>
                        <button className="btn-formal" style={{ flex: 1 }}>Add Admin</button>
                    </div>
                </div>

                <div className="panel" style={{ borderTop: '4px solid var(--good)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2>System Overview</h2>
                        <span style={{ background: 'var(--border)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8em' }}>
                            {stats.users} Users | {stats.counselors} Counselors
                        </span>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <p style={{ color: 'var(--muted)' }}>Manage platform participants and monitor system health.</p>
                    </div>
                </div>
            </div>

            <div className="panel mt-20">
                <h3>Manage Participants</h3>
                <p style={{ color: 'var(--muted)', marginBottom: '20px' }}>Select an entity to modify or remove from the system.</p>

                <div className="grid two">
                    <div>
                        <h4 style={{ marginBottom: '10px' }}>Counselors</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {counselors.map(c => (
                                <li key={c.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.03)', marginBottom: '5px', borderRadius: '8px' }}>
                                    <span>{c.name}</span>
                                    <button onClick={() => handleRemove('counselor', c.name)} style={{ background: 'none', border: 'none', color: 'var(--bad)', cursor: 'pointer' }}>Remove</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '10px' }}>Users</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {users.map(u => (
                                <li key={u.email} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.03)', marginBottom: '5px', borderRadius: '8px' }}>
                                    <span>{u.name || u.email}</span>
                                    <button onClick={() => handleRemove('user', u.email)} style={{ background: 'none', border: 'none', color: 'var(--bad)', cursor: 'pointer' }}>Remove</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminDashboard;
