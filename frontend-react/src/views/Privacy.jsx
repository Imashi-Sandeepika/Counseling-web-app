import React from 'react';
import { useStore } from '../context/StoreContext';

const Privacy = () => {
    const { navigate } = useStore();
    return (
        <section className="view active">
            <div className="panel">
                <button className="back-btn" onClick={() => navigate('settings')}>← Back to Settings</button>
                <h2>Privacy Policy</h2>
                <div className="legal-text" style={{ lineHeight: '1.6', color: 'var(--muted)' }}>
                    <p>Your privacy is important to us. This policy explains how we collect, use, and store your data.</p>
                    <h4 style={{ color: 'white', marginTop: '20px' }}>1. Data Collection</h4>
                    <p>We collect information you provide directly to us (e.g., name, email, feedback).</p>
                    <h4 style={{ color: 'white', marginTop: '20px' }}>2. Data Usage</h4>
                    <p>Your data is used to provide mental health services, process appointments, and improve our AI assistant.</p>
                    <h4 style={{ color: 'white', marginTop: '20px' }}>3. Data Security</h4>
                    <p>We implement industry-standard security measures to protect your sensitive information.</p>
                </div>
            </div>
        </section>
    );
};

export default Privacy;
