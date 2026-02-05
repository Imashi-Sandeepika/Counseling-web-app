import React from 'react';
import { useStore } from '../context/StoreContext';

const CounselorEarnings = () => {
    const { store } = useStore();

    return (
        <section id="counselor-earnings" className="view active animate-in">
            <div className="hero" style={{ marginBottom: '40px' }}>
                <h1 className="hero-text" style={{ fontSize: '3rem' }}>💰 Earnings & Payments</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    Track your income and payment history
                </p>
            </div>

            <div className="panel" style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚧</div>
                <h3 style={{ marginBottom: '15px', fontSize: '1.5rem' }}>Earnings Dashboard</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                    This feature will show your earnings breakdown, payment history, pending payments, and financial analytics.
                </p>
            </div>
        </section>
    );
};

export default CounselorEarnings;
