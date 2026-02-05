import React from 'react';
import { useStore } from '../context/StoreContext';

const AdminCounselors = () => {
    const { store } = useStore();

    return (
        <section id="admin-counselors" className="view active animate-in">
            <div className="hero" style={{ marginBottom: '40px' }}>
                <h1 className="hero-text" style={{ fontSize: '3rem' }}>👨‍⚕️ Counselor Management</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    Manage counselor accounts and verifications
                </p>
            </div>

            <div className="panel" style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚧</div>
                <h3 style={{ marginBottom: '15px', fontSize: '1.5rem' }}>Counselor Administration</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                    This feature will allow you to approve new counselor registrations, manage credentials, view performance metrics, and handle counselor suspensions.
                </p>
            </div>
        </section>
    );
};

export default AdminCounselors;
