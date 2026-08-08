import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { i18n } from '../i18n';

const Home = () => {
    const { store, navigate, api } = useStore();
    const lang = store.settings.language || 'en';
    const dict = i18n[lang] || i18n.en;
    
    // AI Mood Check-in State
    const [checkInText, setCheckInText] = useState('');
    const [checkInLoading, setCheckInLoading] = useState(false);
    const [checkInResult, setCheckInResult] = useState(null);
    const [sentimentHistory, setSentimentHistory] = useState([]);
    const [historyRange, setHistoryRange] = useState('7');

    useEffect(() => {
        const loadHistory = async () => {
            if (!store.user?.email) return;
            const data = await api(`/api/sentiment/history?limit=${historyRange === '7' ? 7 : 30}`);
            if (Array.isArray(data)) {
                setSentimentHistory(data);
            }
        };
        loadHistory();
    }, [store.user.email, historyRange, api]);

    const handleCheckInSubmit = async () => {
        if (!checkInText.trim()) return;
        setCheckInLoading(true);
        setCheckInResult(null);
        
        try {
            const data = await api('/api/sentiment', 'POST', { text: checkInText });
            if (data && data.ok) {
                setCheckInResult({
                    label: data.label,
                    score: data.score
                });
                const hist = await api(`/api/sentiment/history?limit=${historyRange === '7' ? 7 : 30}`);
                if (Array.isArray(hist)) setSentimentHistory(hist);
            } else {
                setCheckInResult({ error: true });
            }
        } catch (error) {
            setCheckInResult({ error: true });
        } finally {
            setCheckInLoading(false);
            setCheckInText('');
        }
    };


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
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{dict.ui.journey_title}</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{dict.ui.journey_desc}</p>
                        </div>
                        <div className="badge badge-success" style={{ padding: '8px 16px', fontSize: '0.9rem', background: 'rgba(50, 222, 132, 0.1)', color: 'var(--accent)', borderRadius: '50px', fontWeight: '700' }}>{dict.ui.journey_streak}</div>
                    </div>

                    <div className="grid grid-cols-3" style={{ gap: '20px' }}>
                        <div className="panel-lite" style={{ textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '20px' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>🧘‍♂️</div>
                            <h4 style={{ marginBottom: '5px', fontSize: '1rem' }}>{dict.ui.journey_step1_title}</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{dict.ui.journey_step1_desc}</p>
                        </div>
                        <div className="panel-lite" style={{ textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '20px' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>🌬️</div>
                            <h4 style={{ marginBottom: '5px', fontSize: '1rem' }}>{dict.ui.journey_step2_title}</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{dict.ui.journey_step2_desc}</p>
                        </div>
                        <div className="panel-lite" style={{ textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '20px' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>📝</div>
                            <h4 style={{ marginBottom: '5px', fontSize: '1rem' }}>{dict.ui.journey_step3_title}</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{dict.ui.journey_step3_desc}</p>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
                        <button className="btn-formal" onClick={() => navigate('live-session')} style={{ padding: '12px 30px', fontSize: '0.9rem' }}>{dict.ui.journey_btn}</button>
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


            {/* AI Mood & Sentiment Check-in Section */}
            <div className="grid grid-cols-1" style={{ marginTop: '40px', maxWidth: '900px', margin: '40px auto' }}>
                <section className="panel animate-in" style={{ padding: '40px', background: 'var(--surface)', textAlign: 'left', borderTop: '4px solid var(--accent)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                        <span style={{ fontSize: '2.5rem' }}>🧠</span>
                        <h2 style={{ fontSize: '1.8rem', margin: 0 }}>{dict.ui.checkin_title}</h2>
                    </div>
                    
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '25px', lineHeight: '1.5' }}>
                        {dict.ui.checkin_desc}
                    </p>

                    <div style={{ marginBottom: '20px' }}>
                        <textarea 
                            value={checkInText}
                            onChange={(e) => setCheckInText(e.target.value)}
                            placeholder={dict.ui.checkin_placeholder}
                            style={{ 
                                width: '100%', 
                                minHeight: '120px', 
                                padding: '15px', 
                                borderRadius: '12px', 
                                border: '1px solid var(--border, rgba(128,128,128,0.3))',
                                background: 'var(--bg-input, rgba(128,128,128,0.1))',
                                color: 'var(--text, inherit)',
                                fontSize: '1rem',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
                        <button 
                            className="btn-formal" 
                            onClick={handleCheckInSubmit}
                            disabled={checkInLoading || !checkInText.trim()}
                            style={{ padding: '12px 30px', fontSize: '1rem', opacity: (!checkInText.trim() || checkInLoading) ? 0.5 : 1, cursor: (!checkInText.trim() || checkInLoading) ? 'not-allowed' : 'pointer' }}
                        >
                            {checkInLoading ? dict.ui.checkin_analyzing : dict.ui.checkin_button}
                        </button>
                    </div>

                    {checkInResult && !checkInResult.error && (
                        <div className="panel-lite animate-in" style={{ 
                            background: checkInResult.label === 'positive' ? 'rgba(50, 222, 132, 0.1)' : 'rgba(255, 99, 132, 0.1)',
                            borderLeft: `4px solid ${checkInResult.label === 'positive' ? '#32de84' : '#ff6384'}`,
                            padding: '25px',
                            marginBottom: '30px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <h3 style={{ margin: 0, fontSize: '1.4rem', color: checkInResult.label === 'positive' ? '#32de84' : '#ff6384', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {checkInResult.label === 'positive' ? `😊 ${dict.ui.checkin_positive}` : `😟 ${dict.ui.checkin_negative}`}
                                </h3>
                                {checkInResult.score !== undefined && checkInResult.score !== 0 && (
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '5px 12px', borderRadius: '20px', fontWeight: '500' }}>
                                        {dict.ui.checkin_confidence}: {Math.round(Math.abs(checkInResult.score) * 100)}%
                                    </span>
                                )}
                            </div>
                            <p style={{ fontSize: '1.05rem', lineHeight: '1.6', margin: 0 }}>
                                {checkInResult.label === 'positive' 
                                    ? dict.ui.checkin_positive_msg
                                    : dict.ui.checkin_negative_msg}
                            </p>
                        </div>
                    )}

                    {checkInResult?.error && (
                        <div className="panel-lite animate-in" style={{ background: 'rgba(255,0,0,0.1)', padding: '20px', marginBottom: '30px', borderLeft: '4px solid #ff4444' }}>
                            {dict.ui.checkin_error}
                        </div>
                    )}

                    {sentimentHistory.length > 0 && (
                        <div style={{ marginTop: '40px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                                <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{dict.ui.history_title}</h3>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button 
                                        onClick={() => setHistoryRange('7')}
                                        style={{ background: historyRange === '7' ? 'var(--accent)' : 'rgba(255,255,255,0.1)', border: 'none', color: historyRange === '7' ? '#000' : 'white', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: historyRange === '7' ? '600' : 'normal', transition: 'all 0.2s' }}
                                    >{dict.ui.history_7_days}</button>
                                    <button 
                                        onClick={() => setHistoryRange('30')}
                                        style={{ background: historyRange === '30' ? 'var(--accent)' : 'rgba(255,255,255,0.1)', border: 'none', color: historyRange === '30' ? '#000' : 'white', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: historyRange === '30' ? '600' : 'normal', transition: 'all 0.2s' }}
                                    >{dict.ui.history_30_days}</button>
                                </div>
                            </div>
                            
                            <div className="panel-lite" style={{ padding: '30px 20px', background: 'rgba(255,255,255,0.02)', position: 'relative' }}>
                                <div style={{ height: '160px', position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: '30px' }}>
                                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '10px 0' }}>
                                        <span style={{ color: '#32de84', fontWeight: '500' }}>{dict.ui.checkin_positive}</span>
                                        <span style={{ color: '#ff6384', fontWeight: '500' }}>{dict.ui.checkin_negative}</span>
                                    </div>
                                    
                                    <div style={{ position: 'absolute', left: '70px', right: 0, top: '20px', height: '1px', background: 'rgba(255,255,255,0.08)' }}></div>
                                    <div style={{ position: 'absolute', left: '70px', right: 0, bottom: '40px', height: '1px', background: 'rgba(255,255,255,0.08)' }}></div>
                                    
                                    <div style={{ position: 'absolute', left: '70px', right: 0, top: '10px', bottom: '30px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                                        {[...sentimentHistory].reverse().map((item, idx) => (
                                            <div key={idx} style={{ 
                                                position: 'relative', 
                                                height: '100%', 
                                                display: 'flex', 
                                                flexDirection: 'column',
                                                justifyContent: item.sentiment === 'positive' ? 'flex-start' : 'flex-end',
                                                paddingTop: '5px',
                                                paddingBottom: '5px'
                                            }}>
                                                <div 
                                                    title={`${new Date(item.ts).toLocaleDateString()} - ${item.sentiment}`}
                                                    style={{ 
                                                        width: '14px', 
                                                        height: '14px', 
                                                        borderRadius: '50%', 
                                                        background: item.sentiment === 'positive' ? '#32de84' : '#ff6384',
                                                        boxShadow: `0 0 12px ${item.sentiment === 'positive' ? 'rgba(50, 222, 132, 0.6)' : 'rgba(255, 99, 132, 0.6)'}`,
                                                        cursor: 'pointer',
                                                        zIndex: 2
                                                    }}
                                                ></div>
                                                <div style={{ position: 'absolute', bottom: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                                    {new Date(item.ts).toLocaleDateString(undefined, { weekday: 'short' })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {sentimentHistory.length > 0 && (
                        <div style={{ marginTop: '30px' }}>
                            <h4 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>{dict.ui.recent_checkins}</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {sentimentHistory.slice(0, 3).map((item, idx) => (
                                    <div key={idx} className="panel-lite" style={{ padding: '15px 20px', borderLeft: `4px solid ${item.sentiment === 'positive' ? '#32de84' : '#ff6384'}`, background: 'rgba(255,255,255,0.01)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ fontWeight: '600', color: item.sentiment === 'positive' ? '#32de84' : '#ff6384' }}>
                                                {item.sentiment === 'positive' ? `😊 ${dict.ui.checkin_positive}` : `😟 ${dict.ui.checkin_negative}`}
                                            </span>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                {new Date(item.ts).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.85)', fontStyle: 'italic', lineHeight: '1.4' }}>
                                            "{item.text.length > 100 ? item.text.substring(0, 100) + '...' : item.text}"
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '40px', padding: '30px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', textAlign: 'center' }}>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.3rem' }}>{dict.ui.talk_to_counselor_h3}</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.95rem' }}>{dict.ui.talk_to_counselor_p}</p>
                        <button className="btn-formal" onClick={() => navigate('counselors')} style={{ padding: '10px 25px', fontSize: '0.95rem' }}>
                            {dict.ui.talk_to_counselor_btn}
                        </button>
                    </div>
                </section>
            </div>
        </section>
    );
};

export default Home;
