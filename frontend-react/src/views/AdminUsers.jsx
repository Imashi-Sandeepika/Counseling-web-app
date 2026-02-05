import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const AdminUsers = () => {
    const { api } = useStore();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const data = await api('/api/admin/users');
            if (Array.isArray(data)) {
                setUsers(data);
            }
            setLoading(false);
        };
        fetchUsers();
    }, [api]);

    const deleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user account?")) return;

        const result = await api(`/api/users/${id}`, 'DELETE');
        if (result.ok) {
            setUsers(prev => prev.filter(u => u.id !== id));
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Never';
        const d = new Date(dateStr);
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <section id="admin-users" className="view active animate-in">
            <div className="hero" style={{ marginBottom: '40px' }}>
                <h1 className="hero-text" style={{ fontSize: '3rem' }}>👥 User Management</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    Manage client accounts and track platform engagement
                </p>
            </div>

            <div className="panel" style={{ padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Registered Users ({users.length})</h3>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
                        <div>Loading users...</div>
                    </div>
                ) : users.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        No users found.
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--surface-hover)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    <th style={{ padding: '15px' }}>NAME</th>
                                    <th style={{ padding: '15px' }}>EMAIL</th>
                                    <th style={{ padding: '15px' }}>JOINED</th>
                                    <th style={{ padding: '15px' }}>LAST LOGIN</th>
                                    <th style={{ padding: '15px', textAlign: 'right' }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id} style={{ borderBottom: '1px solid var(--surface-hover)', fontSize: '0.95rem' }}>
                                        <td style={{ padding: '15px', fontWeight: '500' }}>{u.name}</td>
                                        <td style={{ padding: '15px', color: 'var(--text-muted)' }}>{u.email}</td>
                                        <td style={{ padding: '15px' }}>{formatDate(u.created_at)}</td>
                                        <td style={{ padding: '15px' }}>{formatDate(u.last_login)}</td>
                                        <td style={{ padding: '15px', textAlign: 'right' }}>
                                            <button
                                                onClick={() => deleteUser(u.id)}
                                                style={{
                                                    background: 'transparent',
                                                    color: 'var(--bad)',
                                                    border: '1px solid var(--bad)',
                                                    padding: '5px 10px',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.8rem',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseOver={(e) => { e.currentTarget.style.background = 'var(--bad)'; e.currentTarget.style.color = '#fff'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--bad)'; }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AdminUsers;
