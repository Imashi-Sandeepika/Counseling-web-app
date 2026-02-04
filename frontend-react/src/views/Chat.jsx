import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { i18n } from '../i18n';

const Chat = () => {
    const { store, addActivity } = useStore();
    const lang = store.settings.language || 'en';
    const dict = i18n[lang] || i18n.en;

    const [messages, setMessages] = useState([
        { role: 'assistant', content: dict.chat?.welcome || "Hi! I'm your MindEase Assistant. How are you feeling today?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);
        addActivity('chat', 'message');

        // Simple reply logic (can be expanded to use OpenAI if key is present)
        setTimeout(() => {
            const reply = getSimpleReply(userMsg);
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
            setIsTyping(false);
        }, 1000);
    };

    const getSimpleReply = (q) => {
        const t = q.toLowerCase();

        // Conversational "Hi/Hello"
        if (/^(hi|hello|hey|hola)/.test(t)) {
            if (/sad|unhappy|down/.test(t)) {
                return lang === 'si'
                    ? "ඔබ අද දුකෙන් සිටින බව ඇසීමට ලැබීම ගැන මම කණගාටු වෙමි. ඒ ඇයි කියා මට කියන්න පුළුවන්ද? මට ඔබට උදව් කළ හැකිද?"
                    : "I'm so sorry to hear you're feeling sad today. Would you like to tell me what's on your mind? I'm here to listen and help.";
            }
            return lang === 'si'
                ? "ආයුබෝවන්! අද ඔබට කොහොමද? ඔබට දැනෙන දේ මට කියන්න."
                : "Hello! How are you doing today? I'm here if you'd like to talk about anything.";
        }

        // Focused emotional responses
        if (/sad|unhappy|depress|hopeless|down/.test(t)) {
            return lang === 'si'
                ? "මට තේරෙනවා ඔබ අපහසු කාලයක් පසු කරන බව. ඔබ තනි වී නැත. ඔබට වඩාත්ම කරදර කරන්නේ කුමක්ද?"
                : "I can feel that you're going through a tough time. Please know you're not alone. What's bothering you the most right now?";
        }

        if (/panic|attack|can't breathe/.test(t)) {
            return dict.chat?.panicReply || "Place a hand on your belly, breathe slowly: inhale 4, hold 4, exhale 6 for 3 minutes. Name five things you see.";
        }

        if (/anxiety|stress|overwhelmed|worried/.test(t)) {
            return dict.chat?.anxietyReply || "Start with one small step. Try inhale 4, hold 4, exhale 6 for 3 minutes, then write one action you’ll do today.";
        }

        return dict.chat?.defaultReply || "Tell me more about what’s happening. I’m here to support you with practical steps.";
    };

    return (
        <section id="chat" className="view active animate-in">
            <h2 className="hero-text" style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{dict.titles?.chat || 'AI Support'}</h2>
            <div className="chat-container">
                <div className="chat-header">
                    <div className="person-card">
                        <img src="/images/Chatbot.jpg" alt="Assistant" className="avatar" />
                        <div>
                            <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{dict.chat?.name || 'MindEase Assistant'}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{isTyping ? (dict.chat?.typing || 'Typing guidance...') : (dict.chat?.ready || 'Ready to help')}</div>
                        </div>
                    </div>
                    <div className="badge badge-success" style={{ fontSize: '0.7rem' }}>{dict.chat?.aiPowered || 'AI Powered'}</div>
                </div>

                <div className="chat-window" ref={scrollRef}>
                    {messages.map((m, i) => (
                        <div key={i} className={`msg ${m.role === 'user' ? 'user' : ''}`}>
                            <div className={`bubble ${m.role === 'user' ? 'user' : 'bot'}`}>
                                {m.content}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="msg">
                            <div className="bubble bot typing-dots" style={{ display: 'flex', gap: '4px', padding: '12px 20px' }}>
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        </div>
                    )}
                </div>

                <form className="chat-form" onSubmit={handleSend} style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message…"
                        style={{ flex: 1, margin: 0, minHeight: '50px', maxHeight: '150px', resize: 'none' }}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                    />
                    <button type="submit" className="btn-formal" style={{ padding: '0.8rem 1.5rem !important' }}>Send</button>
                </form>
            </div>
        </section>
    );
};

export default Chat;
