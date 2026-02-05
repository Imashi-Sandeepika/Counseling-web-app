import React from 'react';
import { useStore } from '../context/StoreContext';

const AdminReports = () => {
    const { store } = useStore();

    return (
        <section id="admin-reports" className="view active animate-in">
            <div className="hero" style={{ marginBottom: '40px' }}>
                <h1 className="hero-text" style={{ fontSize: '3rem' }}>📊 Reports & Analytics</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    Platform insights and performance metrics
                </p>
            </div>

            <div className="panel" style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚧</div>
                <h3 style={{ marginBottom: '15px', fontSize: '1.5rem' }}>Analytics Dashboard</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                    This feature will provide comprehensive analytics including user growth, appointment trends, revenue metrics, counselor performance, and platform health indicators.
                </p>
            </div>
        </section>
    );
};

export default AdminReports;
