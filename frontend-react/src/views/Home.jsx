import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { i18n } from '../i18n';

const Home = () => {
    const { store, navigate, api } = useStore();
    const [sessions, setSessions] = useState([]);
    const lang = store.settings.language || 'en';
    const dict = i18n[lang] || i18n.en;

    useEffect(() => {
        const fetchSessions = async () => {
            const res = await api(`/api/sessions?email=${store.user.email}`);
            if (res && Array.isArray(res)) {
                setSessions(res);
            }
        };
        fetchSessions();
    }, [store.user.email]);

    const cards = [
        { id: 'resources', title: dict.ui.common_h3, icon: '📚', desc: dict.ui.common_p, cls: 'card-common-section' },
        { id: 'chat', title: dict.ui.ai_h3, icon: '🤖', desc: dict.ui.ai_p, cls: 'card-mini-chat' },
        { id: 'counselors', title: dict.ui.hire_h3, icon: '👨‍⚕️', desc: dict.ui.hire_p, cls: 'card-hire-counselor' },
        { id: 'live-session', title: 'Live Now', icon: '🔴', desc: 'Join a live mindfulness session with others.', cls: 'card-live-now' }
    ];

    return (
        <section id="home" className="view active">
            <div className="hero">
                <h1>{dict.ui.home_h1}, {store.user.name || store.user.email.split('@')[0]}</h1>
                <p>{dict.ui.welcome_p}</p>
            </div>

            <div className="options">
                {cards.map(card => (
                    <div key={card.id} className={`card ${card.cls}`} onClick={() => navigate(card.id)}>
                        <h3>{card.title}</h3>
                        <p className="short">{card.desc}</p>
                        <div className="card-actions">
                            <button className="goto" type="button">Open</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid two">
                <section className="usage panel">
                    <h2>{dict.ui.usage_h2}</h2>
                    <div className="stars">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className={`star ${i <= 3 ? 'fill' : ''}`} />
                        ))}
                    </div>
                    <p className="summary">Keep up the good work!</p>
                </section>

                <section className="history panel">
                    <h2>{dict.ui.history_h2}</h2>
                    <ul>
                        {sessions.length > 0 ? sessions.map((s, i) => (
                            <li key={i}>
                                {new Date(s.ts || s.start).toLocaleDateString()} • {s.category || 'Meditation'} Session
                            </li>
                        )) : (
                            <li style={{ color: 'var(--muted)' }}>No recent sessions</li>
                        )}
                    </ul>
                </section>
            </div>
        </section>
    );
};

export default Home;
