import React from 'react';
import { useStore } from '../context/StoreContext';

const AdminUsers = () => {
    const { store } = useStore();

    return (
        <section id="admin-users" className="view active animate-in">
            <div className="hero" style={{ marginBottom: '40px' }}>
                <h1 className="hero-text" style={{ fontSize: '3rem' }}>👥 User Management</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    Manage all client accounts and user data
                </p>
            </div>

            <div className="panel" style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚧</div>
                <h3 style={{ marginBottom: '15px', fontSize: '1.5rem' }}>User Administration</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                    This feature will allow you to view, edit, suspend, or delete user accounts, manage permissions, and track user activity.
                </p>
            </div>
        </section>
    );
};

export default AdminUsers;
