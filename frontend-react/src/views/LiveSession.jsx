import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const LiveSession = () => {
    const { navigate } = useStore();
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <section id="live-session" className="view active">
            <div className="back-btn" onClick={() => navigate('home')}>← Back to Home</div>

            <div className="hero" style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '2.5em', marginBottom: '10px' }}>Live Wellbeing Session</h2>
                <p style={{ color: 'var(--muted)' }}>Take a moment for yourself. Join our community-led mindfulness session.</p>
            </div>

            <div className="grid two">
                <div className="panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px' }}>
                    <div className="status-badge" style={{ background: 'var(--accent)', color: '#fff', padding: '5px 15px', borderRadius: '20px', fontSize: '0.8em', fontWeight: 'bold', marginBottom: '20px' }}>
                        LIVE NOW
                    </div>

                    <div className="timer-display" style={{ fontSize: '5em', fontWeight: '900', color: 'var(--text)', marginBottom: '20px', fontFamily: 'monospace' }}>
                        {formatTime(timeLeft)}
                    </div>

                    <h3 style={{ marginBottom: '10px' }}>Guided Breathing</h3>
                    <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '30px' }}>Focus on your breath. Inhale calm, exhale tension.</p>

                    {!isActive ? (
                        <button className="btn-formal" style={{ width: '200px' }} onClick={() => setIsActive(true)}>Join Practice</button>
                    ) : (
                        <button className="btn-formal" style={{ width: '200px', background: 'var(--bad)' }} onClick={() => setIsActive(false)}>Leave Session</button>
                    )}
                </div>

                <div className="panel">
                    <h3>Participants (8)</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '20px' }}>
                        {[
                            '/images/PereraProfile.jpg',
                            '/images/SilvaProfile.jpg',
                            '/images/couns_2_1769248126.jpg',
                            '/images/girl_3.jpg',
                            '/images/user_DP.jpg',
                            '/images/chatbot2.jpg'
                        ].map((src, i) => (
                            <div key={i} style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: '2px solid var(--accent)',
                                background: 'var(--surface-hover)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                            }}>
                                <img
                                    src={src}
                                    alt={`Participant ${i}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => { e.target.onerror = null; e.target.src = '/images/User.jpg' }}
                                />
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '30px', padding: '20px', background: 'var(--bg)', borderRadius: '12px', borderLeft: '4px solid var(--accent)' }}>
                        <p style={{ fontStyle: 'italic', color: 'var(--muted)' }}>"Everyone is breathing together in silence. Feel the collective peace."</p>
                    </div>
                </div>
            </div>

            <div className="panel" style={{ marginTop: '30px' }}>
                <h3>Live Chat Feedback</h3>
                <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '15px' }}>
                    <div style={{ marginBottom: '10px' }}><strong>Anonymous:</strong> Feeling much better after 5 minutes.</div>
                    <div style={{ marginBottom: '10px' }}><strong>Anonymous:</strong> This helps me start my day right.</div>
                    <div style={{ marginBottom: '10px' }}><strong>Anonymous:</strong> The Forest Green theme is so calming!</div>
                </div>
            </div>
        </section>
    );
};

export default LiveSession;
