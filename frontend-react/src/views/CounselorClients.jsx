import React from 'react';
import { useStore } from '../context/StoreContext';

const CounselorClients = () => {
    const { store } = useStore();

    return (
        <section id="counselor-clients" className="view active animate-in">
            <div className="hero" style={{ marginBottom: '40px' }}>
                <h1 className="hero-text" style={{ fontSize: '3rem' }}>👥 My Clients</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    View and manage your client relationships
                </p>
            </div>

            <div className="panel" style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚧</div>
                <h3 style={{ marginBottom: '15px', fontSize: '1.5rem' }}>Client Management</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                    This feature will display your client list, session history, progress notes, and communication tools.
                </p>
            </div>
        </section>
    );
};

export default CounselorClients;
