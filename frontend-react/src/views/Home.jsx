import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { i18n } from '../i18n';

const Home = () => {
    const { store, navigate, api } = useStore();
    const lang = store.settings.language || 'en';
    const dict = i18n[lang] || i18n.en;
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        const loadSessions = async () => {
            const data = await api(`/api/sessions?email=${store.user.email}`);
            if (Array.isArray(data)) {
                setSessions(data.slice(0, 3));
            }
        };
        loadSessions();
    }, [store.user.email]);


    return (
        <section id="home" className="view active animate-in" style={{ textAlign: 'center' }}>
            <div className="hero" style={{ marginBottom: '60px' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '10px' }}>{dict.ui.home_h1}, {store.user.name || store.user.email.split('@')[0]}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>{dict.ui.welcome_p}</p>
            </div>

            <div className="grid grid-cols-1" style={{ maxWidth: '900px', margin: '0 auto' }}>
                <section className="panel animate-in" style={{ padding: '40px', background: 'var(--surface)', textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                        <div>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Your Mindfulness Journey</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Consistent practice leads to lasting mental clarity.</p>
                        </div>
                        <div className="badge badge-success" style={{ padding: '8px 16px', fontSize: '0.9rem', background: 'rgba(50, 222, 132, 0.1)', color: 'var(--accent)', borderRadius: '50px', fontWeight: '700' }}>3 DAY STREAK 🔥</div>
                    </div>

                    <div className="grid grid-cols-3" style={{ gap: '20px' }}>
                        <div className="panel-lite" style={{ textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '20px' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>🧘‍♂️</div>
                            <h4 style={{ marginBottom: '5px', fontSize: '1rem' }}>Step 1: Preparation</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>Find a quiet space, sit comfortably, and set a simple intention for your session.</p>
                        </div>
                        <div className="panel-lite" style={{ textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '20px' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>🌬️</div>
                            <h4 style={{ marginBottom: '5px', fontSize: '1rem' }}>Step 2: Deep Focus</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>Engage with the 4‑7‑8 breathing technique to regulate your nervous system.</p>
                        </div>
                        <div className="panel-lite" style={{ textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '20px' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>📝</div>
                            <h4 style={{ marginBottom: '5px', fontSize: '1rem' }}>Step 3: Reflection</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>Take 2 minutes to acknowledge how you feel after the exercise before returning to your day.</p>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
                        <button className="btn-formal" onClick={() => navigate('live-session')} style={{ padding: '12px 30px', fontSize: '0.9rem' }}>START TODAY'S PRACTICE</button>
                    </div>
                </section>
            </div>

            <div className="grid grid-cols-2" style={{ marginTop: '30px', gap: '20px', maxWidth: '900px', margin: '30px auto' }}>
                <div className="card card-common-section" onClick={() => navigate('resources')} style={{ cursor: 'pointer', height: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px', textAlign: 'left' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{dict.titles.resources}</h3>
                    <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>{dict.ui.resources_desc}</p>
                </div>
                <div className="card card-mini-chat" onClick={() => navigate('chat')} style={{ cursor: 'pointer', height: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px', textAlign: 'left' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{dict.titles.chat}</h3>
                    <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>{dict.ui.chat_desc}</p>
                </div>
                <div className="card card-hire-counselor" onClick={() => navigate('counselors')} style={{ cursor: 'pointer', height: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px', textAlign: 'left' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{dict.titles.counselors}</h3>
                    <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>{dict.ui.counselors_desc}</p>
                </div>
                <div className="card card-live-now" onClick={() => navigate('live-session')} style={{ cursor: 'pointer', height: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px', textAlign: 'left' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{dict.titles.breathing}</h3>
                    <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>{dict.ui.breathing_desc}</p>
                </div>
            </div>

            {sessions.length > 0 && (
                <div className="grid grid-cols-1" style={{ marginTop: '40px', maxWidth: '900px', margin: '40px auto' }}>
                    <section className="panel animate-in" style={{ textAlign: 'left' }}>
                        <h3 style={{ marginBottom: '20px' }}>Recent Sessions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {sessions.map((s, i) => {
                                const date = new Date(s.start);
                                return (
                                    <div key={i} className="panel-lite" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px' }}>
                                        <div>
                                            <div style={{ fontWeight: '600', marginBottom: '5px' }}>{s.category || 'Session'}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                {s.counselorName && `with ${s.counselorName}`}
                                                {s.notes && ` - ${s.notes.substring(0, 50)}${s.notes.length > 50 ? '...' : ''}`}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                            {date.toLocaleDateString()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>
            )}
        </section>
    );
};

export default Home;
