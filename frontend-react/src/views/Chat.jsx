import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const Chat = () => {
    const { store, addActivity } = useStore();
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi! I'm your MindEase Assistant. How are you feeling today?" }
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
        if (/panic|attack/.test(t)) return "Place a hand on your belly, breathe slowly: inhale 4, hold 4, exhale 6 for 3 minutes. Name five things you see.";
        if (/anxiety|stress|overwhelmed/.test(t)) return "Start with one small step. Try inhale 4, hold 4, exhale 6 for 3 minutes, then write one action you’ll do today.";
        if (/depress|sad|low mood|hopeless/.test(t)) return "You’re not alone. Text a supportive person and choose one 10‑minute activity (walk, shower, tidy). Small steps count.";
        return "Tell me more about what’s happening. I’ll suggest a short, practical step.";
    };

    return (
        <section id="chat" className="view active">
            <h2>Mini AI Chat</h2>
            <div className="chat-container panel">
                <div className="chat-header">
                    <div className="chat-avatar">
                        <img src="/images/Chatbot.jpg" alt="Assistant" />
                    </div>
                    <div className="chat-title">
                        <div className="chat-name">MindEase Assistant</div>
                        <div className="chat-sub">Friendly guidance, short practical steps</div>
                    </div>
                    <div className="chat-presence">
                        <span className="presence-dot"></span>
                        <span>{isTyping ? 'Typing...' : 'Ready'}</span>
                    </div>
                </div>

                <div className="chat-window" ref={scrollRef}>
                    {messages.map((m, i) => (
                        <div key={i} className={`msg ${m.role === 'user' ? 'user' : ''}`}>
                            <div className={`bubble ${m.role === 'user' ? 'user' : 'bot'}`}>
                                {m.content}
                            </div>
                        </div>
                    ))}
                    {isTyping && <div className="msg"><div className="bubble bot">...</div></div>}
                </div>

                <form className="chat-form" onSubmit={handleSend}>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message…"
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                    />
                    <div className="chat-actions">
                        <button type="submit" className="btn-formal">Send</button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Chat;
