import React from 'react';
import { useStore } from '../context/StoreContext';

const Terms = () => {
    const { navigate } = useStore();
    return (
        <section className="view active">
            <div className="panel">
                <button className="back-btn" onClick={() => navigate('settings')}>← Back to Settings</button>
                <h2>Terms of Service</h2>
                <div className="legal-text" style={{ lineHeight: '1.6', color: 'var(--muted)' }}>
                    <p>By using Menta, you agree to the following terms.</p>
                    <h4 style={{ color: 'white', marginTop: '20px' }}>1. Not Emergency Care</h4>
                    <p>Menta is NOT for medical emergencies. If you are in crisis, please call your local emergency services immediately.</p>
                    <h4 style={{ color: 'white', marginTop: '20px' }}>2. Professional Advice</h4>
                    <p>While we provide access to counselors, our AI tools are for guidance only and do not constitute clinical diagnosis.</p>
                    <h4 style={{ color: 'white', marginTop: '20px' }}>3. User Conduct</h4>
                    <p>Users must interact respectfully with counselors and other community members.</p>
                </div>
            </div>
        </section>
    );
};

export default Terms;
