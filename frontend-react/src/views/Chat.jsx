import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { i18n } from '../i18n';

// A free translation utility (Google Translate unofficial API)
async function translateText(text, targetLang) {
    if (targetLang === 'en') return text;
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        const data = await res.json();
        return data[0].map(x => x[0]).join('');
    } catch (e) {
        console.error("Translation error", e);
        return text;
    }
}

// A simple map of common language names to codes
const langMap = {
    english: 'en',
    sinhala: 'si',
    tamil: 'ta',
    spanish: 'es',
    french: 'fr',
    german: 'de',
    hindi: 'hi',
    japanese: 'ja',
    korean: 'ko',
    arabic: 'ar',
    russian: 'ru',
    chinese: 'zh-CN',
    italian: 'it'
};

const fallbackResponses = [
    "I understand. Tell me more about how that makes you feel.",
    "That sounds challenging. I'm here for you. What else is on your mind?",
    "Thank you for sharing that. How long have you been feeling this way?",
    "I hear you. It's completely okay to feel that way. Let's talk through it step by step.",
    "I'm listening. Could you share a bit more?",
    "That must be tough. Remember, taking small steps helps. What's one small thing you can do for yourself right now?",
    "I see. How does that affect your daily life?",
    "It takes courage to share that. I'm here to support you without judgment."
];

const Chat = () => {
    const { store, addActivity } = useStore();
    const storeLang = store.settings.language || 'en';
    const dict = i18n[storeLang] || i18n.en;

    const [activeLangCode, setActiveLangCode] = useState(storeLang);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef();
    
    const [fallbackIndex, setFallbackIndex] = useState(0);

    useEffect(() => {
        const initializeChat = async () => {
            const initialText = "Hi! I'm your MindEase Assistant. How are you feeling today? Feel free to share anything on your mind.";
            const translated = await translateText(initialText, storeLang);
            setMessages([{ role: 'assistant', content: translated }]);
            setActiveLangCode(storeLang);
        };
        initializeChat();
    }, [storeLang]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput('');
        
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);
        addActivity('chat', 'message');

        // Check if user is asking to change language
        let targetLang = activeLangCode;
        const lowerMsg = userMsg.toLowerCase();
        
        const changeLangMatch = lowerMsg.match(/(?:change|switch|speak).*(?:language|to|in)\s+([a-z]+)/i);
        let languageChanged = false;
        
        if (changeLangMatch && changeLangMatch[1]) {
            const requestedLang = changeLangMatch[1];
            if (langMap[requestedLang]) {
                targetLang = langMap[requestedLang];
                languageChanged = true;
            }
        } else if (/\b(sinhala|singhala|සිංහල)\b/i.test(lowerMsg)) {
            targetLang = 'si';
            languageChanged = true;
        } else if (/\b(english|ඉංග්‍රීසි)\b/i.test(lowerMsg)) {
            targetLang = 'en';
            languageChanged = true;
        } else if (/\b(tamil|දෙමළ)\b/i.test(lowerMsg)) {
            targetLang = 'ta';
            languageChanged = true;
        }

        if (languageChanged) {
            setActiveLangCode(targetLang);
        }

        // Logic for generating reply
        let baseReply = "";

        if (languageChanged) {
            baseReply = "Sure! I will speak in this language from now on. How can I help you today?";
        } else if (/\b(dead|die|suicide|kill myself|end my life|hanging|cut myself|harm myself)\b/i.test(lowerMsg) || 
            /(මැරෙන්න|මියයන්න|නැති කරගන්න|ජීවිතය නැති|දිවි නසා|එල්ලිලා)/.test(lowerMsg)) {
            baseReply = "I hear how much pain you're in, and I want you to know you are not alone. Please reach out to someone who can help right now. You can contact Sumithrayo (Sri Lanka) at +94 11 2 682535, or call the National Mental Health Helpline at 1926 (Toll-Free). Your life is valuable, please stay safe.";
        } else if (/^(hi|hello|hey|hola|good morning|good afternoon|good evening)/.test(lowerMsg) || 
            /^(කොහොමද|හෙලෝ|ආයුබෝවන්)/.test(lowerMsg)) {
            baseReply = "Hello! I'm here to listen and support you. What is on your mind today?";
        } else if (/\b(panic|attack|can't breathe|scared to death|hyperventilating)\b/i.test(lowerMsg) || 
            /(බය|බයවෙලා|හුස්ම ගන්න බෑ|කලබල)/.test(lowerMsg)) {
            baseReply = "Take a deep breath. You are safe here. Let's do a simple grounding exercise together: Place a hand on your belly. Inhale slowly for 4 seconds, hold for 4 seconds, and exhale gently for 6 seconds. Repeat this a few times to let the wave pass.";
        } else if (/\b(anxiety|stress|overwhelmed|worried|nervous|tension|pressure)\b/i.test(lowerMsg) || 
            /(කාංසාව|ආතතිය|කලකිරීම|මහන්සියි|ස්ට්‍රෙස්)/.test(lowerMsg)) {
            baseReply = "Anxiety and stress can make everything feel heavy. Try to focus on just the next small step. What is one tiny thing you can do right now to make yourself comfortable? You might also want to try our 'Breathing' tool in the navigation bar.";
        } else if (/\b(sad|unhappy|depress|hopeless|down|cry|crying|lonely|alone|hurt)\b/i.test(lowerMsg) || 
            /(දුකයි|කණගාටුයි|තනියම|පාළුයි|අඬනවා|අසරණ)/.test(lowerMsg)) {
            baseReply = "I can feel how heavy things are for you right now, and it is completely okay to feel sad or lonely. You don't have to carry this all by yourself. Try texting a supportive friend or family member, or engage in a simple 10-minute activity like a short walk or tidy your desk. Small steps count.";
        } else if (/\b(sleep|insomnia|can't sleep|nightmare|awake)\b/i.test(lowerMsg) || 
            /(නින්ද|නිදි|නිදාගන්න බෑ)/.test(lowerMsg)) {
            baseReply = "Getting good sleep is vital for mental health, but hard when the mind is racing. Try keeping your screens away 30 minutes before sleep, dimming the lights, and focusing on a simple body scan (relaxing each muscle group from toes to head). You can also find meditation tracks under our 'Resources' tab.";
        } else if (/\b(relationship|breakup|fight|arguing|friend|boyfriend|girlfriend|husband|wife|divorce)\b/i.test(lowerMsg) || 
            /(රණ්ඩු|ප්‍රශ්න|තරහා වෙලා|සම්බන්ධතාවය)/.test(lowerMsg)) {
            baseReply = "Relationship challenges can trigger a lot of emotional pain. It's often helpful to take a step back and communicate using 'I feel...' statements rather than blame. If you feel stuck, you can book a session with one of our professional specialists in the 'Counselors' tab.";
        } else if (/\b(thank you|thanks|helpful|good bot|awesome|great)\b/i.test(lowerMsg) || 
            /(ස්තූතියි|ස්තුතියි|නියමයි|උදව් උනා)/.test(lowerMsg)) {
            baseReply = "You are very welcome! I'm glad I could support you. Remember, I'm always here whenever you need a friendly ear to talk to. Take care!";
        } else {
            // Cycle through fallback responses to keep chat continuously user friendly
            baseReply = fallbackResponses[fallbackIndex % fallbackResponses.length];
            setFallbackIndex(prev => prev + 1);
        }

        // Translate the reply if needed
        const finalReply = await translateText(baseReply, targetLang);

        setMessages(prev => [...prev, { role: 'assistant', content: finalReply }]);
        setIsTyping(false);
    };

    const getSuggestions = () => {
        if (activeLangCode === 'si') {
            return [
                { label: "මට කාංසාවක් දැනෙනවා 😰", value: "මට කාංසාවක් දැනෙනවා" },
                { label: "මාව සන්සුන් කරන්න 🧘", value: "මට හුස්ම ගන්න අමාරුයි, මාව සන්සුන් කරන්න" },
                { label: "මට ගොඩක් දුකයි 😢", value: "මට ගොඩක් දුකයි, තනියම කියල දැනෙනවා" },
                { label: "English වලින් කතා කරන්න 🇬🇧", value: "Change language to English" }
            ];
        } else if (activeLangCode === 'ta') {
            return [
                { label: "எனக்கு கவலையாக உள்ளது 😰", value: "எனக்கு கவலையாக உள்ளது" },
                { label: "எனக்கு கவலையாக உள்ளது 😢", value: "எனக்கு கவலையாக உள்ளது" },
                { label: "ஆங்கிலத்தில் பேசுங்கள் 🇬🇧", value: "Change language to English" }
            ];
        } else {
            return [
                { label: "I'm feeling anxious 😰", value: "I am feeling very anxious today" },
                { label: "Help me calm down 🧘", value: "I'm having a panic attack, help me calm down" },
                { label: "I feel very sad 😢", value: "I'm feeling really sad and hopeless" },
                { label: "සිංහලෙන් කතා කරන්න 🇱🇰", value: "Change language to Sinhala" },
                { label: "Speak in Tamil 🇮🇳", value: "Change language to Tamil" }
            ];
        }
    };

    return (
        <section id="chat" className="view active animate-in">
            <h2 className="hero-text" style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
                {activeLangCode === 'si' ? 'AI මනෝ සහාය' : (dict.titles?.chat || 'AI Support')}
            </h2>
            <div className="chat-container" style={{ display: 'flex', flexDirection: 'column', height: '620px' }}>
                <div className="chat-header">
                    <div className="person-card">
                        <img src="/images/Chatbot.jpg" alt="Assistant" className="avatar" />
                        <div>
                            <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>
                                {activeLangCode === 'si' ? 'මනෝ සුවතා සහායකයා' : (dict.chat?.name || 'MindEase Assistant')}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {isTyping 
                                    ? (activeLangCode === 'si' ? 'මග පෙන්වීම සූදානම් කරමින්...' : (dict.chat?.typing || 'Typing guidance...')) 
                                    : (activeLangCode === 'si' ? 'සහාය වීමට සූදානම්' : (dict.chat?.ready || 'Ready to help'))}
                            </div>
                        </div>
                    </div>
                    <div className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                        {activeLangCode === 'si' ? 'AI තාක්ෂණයෙන්' : (dict.chat?.aiPowered || 'AI Powered')}
                    </div>
                </div>

                <div className="chat-window" ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    {messages.map((m, i) => (
                        <div key={i} className={`msg ${m.role === 'user' ? 'user' : ''}`}>
                            <div className={`bubble ${m.role === 'user' ? 'user' : 'bot'}`} style={{ whiteSpace: 'pre-line' }}>
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

                {/* Suggestion Chips */}
                <div className="suggestion-chips" style={{ display: 'flex', gap: '8px', padding: '10px 20px', flexWrap: 'wrap', borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                    {getSuggestions().map((chip, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setInput(chip.value);
                                setTimeout(() => {
                                    document.querySelector('.chat-form button').click();
                                }, 50);
                            }}
                            style={{
                                background: 'var(--overlay-start, rgba(255,255,255,0.05))',
                                border: '1px solid var(--border)',
                                borderRadius: '16px',
                                padding: '6px 12px',
                                fontSize: '0.8rem',
                                color: 'var(--text, #fff)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                outline: 'none'
                            }}
                            onMouseOver={(e) => { e.target.style.background = 'rgba(255,255,255,0.15)'; e.target.style.transform = 'translateY(-1px)'; }}
                            onMouseOut={(e) => { e.target.style.background = 'var(--overlay-start, rgba(255,255,255,0.05))'; e.target.style.transform = 'translateY(0)'; }}
                        >
                            {chip.label}
                        </button>
                    ))}
                </div>

                <form className="chat-form" onSubmit={handleSend} style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={activeLangCode === 'si' ? "පණිවිඩයක් ලියන්න..." : (activeLangCode === 'ta' ? "ஒரு செய்தியை தட்டச்சு செய்க..." : "Type a message…")}
                        style={{ flex: 1, margin: 0, minHeight: '50px', maxHeight: '150px', resize: 'none' }}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); document.querySelector('.chat-form button').click(); } }}
                    />
                    <button type="submit" className="btn-formal" style={{ padding: '0.8rem 1.5rem' }}>
                        {activeLangCode === 'si' ? 'යවන්න' : (activeLangCode === 'ta' ? 'அனுப்பு' : 'Send')}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Chat;

