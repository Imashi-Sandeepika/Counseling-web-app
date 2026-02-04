import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { i18n } from '../i18n';

const Home = () => {
    const { store, navigate, api } = useStore();
    const lang = store.settings.language || 'en';
    const dict = i18n[lang] || i18n.en;

    const cards = [
        { id: 'resources', title: dict.ui.common_h3, icon: '📚', desc: dict.ui.common_p, cls: 'card-common-section' },
        { id: 'chat', title: dict.ui.ai_h3, icon: '🤖', desc: dict.ui.ai_p, cls: 'card-mini-chat' },
        { id: 'counselors', title: dict.ui.hire_h3, icon: '👨‍⚕️', desc: dict.ui.hire_p, cls: 'card-hire-counselor' }
    ];

    return (
        <section id="home" className="view active animate-in">
            <div className="hero" style={{ marginBottom: '40px' }}>
                <h1 className="hero-text" style={{ fontSize: '3.5rem' }}>{dict.ui.home_h1}, {store.user.name || store.user.email.split('@')[0]}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>{dict.ui.welcome_p}</p>
            </div>

            <div className="grid grid-cols-3" style={{ marginBottom: '40px' }}>
                {cards.map(card => (
                    <div key={card.id} className={`card ${card.cls}`} onClick={() => navigate(card.id)} style={{ cursor: 'pointer', minHeight: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '30px' }}>
                        <div style={{ position: 'absolute', top: '30px', left: '30px', fontSize: '2.5rem', background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '15px', backdropFilter: 'blur(5px)' }}>{card.icon}</div>
                        <h3 style={{ fontSize: '1.6rem', marginBottom: '10px' }}>{card.title}</h3>
                        <p className="short" style={{ opacity: 0.9, fontSize: '1rem', lineHeight: '1.4' }}>{card.desc}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1">
                <section className="panel animate-in" style={{ padding: '40px', background: 'var(--surface)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                        <div>
                            <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Your Mindfulness Journey</h2>
                            <p style={{ color: 'var(--text-muted)' }}>Consistent practice leads to lasting mental clarity.</p>
                        </div>
                        <div className="badge badge-success" style={{ padding: '10px 20px', fontSize: '1rem' }}>3 Day Streak 🔥</div>
                    </div>

                    <div className="grid grid-cols-3" style={{ gap: '20px' }}>
                        <div className="panel-lite" style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>🧘‍♂️</div>
                            <h4 style={{ marginBottom: '5px' }}>Step 1: Preparation</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>Find a quiet space, sit comfortably, and set a simple intention for your session.</p>
                        </div>
                        <div className="panel-lite" style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>🌬️</div>
                            <h4 style={{ marginBottom: '5px' }}>Step 2: Deep Focus</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>Engage with the 4‑7‑8 breathing technique to regulate your nervous system.</p>
                        </div>
                        <div className="panel-lite" style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>📝</div>
                            <h4 style={{ marginBottom: '5px' }}>Step 3: Reflection</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>Take 2 minutes to acknowledge how you feel after the exercise before returning to your day.</p>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px', borderTop: '1px solid var(--border)', paddingTop: '25px', display: 'flex', justifyContent: 'center' }}>
                        <button className="btn-formal" onClick={() => navigate('live-session')}>Start Today's Practice</button>
                    </div>
                </section>
            </div>
        </section>
    );
};

export default Home;
