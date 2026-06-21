import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { i18n } from '../i18n';

const Chat = () => {
    const { store, addActivity } = useStore();
    const lang = store.settings.language || 'en';
    const dict = i18n[lang] || i18n.en;

    // Detect if global language is set to Sinhala
    const [sinhalaMode, setSinhalaMode] = useState(lang === 'si');

    const [messages, setMessages] = useState([
        { 
            role: 'assistant', 
            content: lang === 'si' 
                ? "ආයුබෝවන්! මම ඔබේ මනෝ සුවතා සහායකයා. අද ඔබට කොහොමද? ඔබට දැනෙන ඕනෑම දෙයක් මා සමඟ බෙදාගන්න." 
                : "Hi! I'm your MindEase Assistant. How are you feeling today? Feel free to share anything on your mind." 
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // Keep sinhalaMode in sync with global store language
    useEffect(() => {
        setMessages([
            { 
                role: 'assistant', 
                content: lang === 'si' 
                    ? "ආයුබෝවන්! මම ඔබේ මනෝ සුවතා සහායකයා. අද ඔබට කොහොමද? ඔබට දැනෙන ඕනෑම දෙයක් මා සමඟ බෙදාගන්න." 
                    : "Hi! I'm your MindEase Assistant. How are you feeling today? Feel free to share anything on your mind." 
            }
        ]);
        setSinhalaMode(lang === 'si');
    }, [lang]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput('');
        sendMessageFlow(userMsg);
    };

    const sendMessageFlow = (userMsg) => {
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);
        addActivity('chat', 'message');

        // Check if user is asking to speak in Sinhala or typing in Sinhala Unicode
        const isSinhalaInput = (
            /[\u0D80-\u0DFF]/.test(userMsg) && !/\b(ඉංග්‍රීසි)\b/i.test(userMsg)
        ) || /\b(sinhala|singhala|sinhalen|siinhalen|සිංහල)\b/i.test(userMsg);

        // Check if user is asking to speak in English
        const isEnglishInput = /\b(english|ingirisi|ingreesi|ඉංග්‍රීසි)\b/i.test(userMsg) && !/\b(sinhala|singhala|sinhalen|siinhalen|සිංහල)\b/i.test(userMsg);

        let finalSinhalaMode = sinhalaMode;
        if (isSinhalaInput) {
            finalSinhalaMode = true;
            setSinhalaMode(true);
        } else if (isEnglishInput) {
            finalSinhalaMode = false;
            setSinhalaMode(false);
        }

        setTimeout(() => {
            const reply = getSimpleReply(userMsg, finalSinhalaMode);
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
            setIsTyping(false);
        }, 800);
    };

    const getSimpleReply = (q, useSinhala) => {
        const t = q.toLowerCase();

        // 1. CRISIS / SUICIDE DETECTION (Extremely Important for Mental Health Apps)
        if (/\b(dead|die|suicide|kill myself|end my life|hanging|cut myself|harm myself)\b/i.test(t) || 
            /[\u0D80-\u0DFF]/.test(t) && /(මැරෙන්න|මියයන්න|නැති කරගන්න|ජීවිතය නැති|දිවි නසා|එල්ලිලා)/.test(t)) {
            return useSinhala
                ? "ඔබ ඉතාමත් පීඩාවකින් සහ වේදනාවකින් පසුවන බව මට වැටහෙනවා. කරුණාකර ඔබ තනි වී නැති බව මතක තබා ගන්න. ඔබට උපකාර කළ හැකි ක්ෂණික සේවාවන් ඇත. ශ්‍රී ලංකා සුමිත්‍රයෝ සංවිධානය +94 11 2 682535 ඔස්සේ හෝ 1926 ජාතික මානසික සෞඛ්‍ය උපකාරක අංකය (නොමිලේ) අමතන්න. කරුණාකර ආරක්ෂිතව සිටින්න."
                : "I hear how much pain you're in, and I want you to know you are not alone. Please reach out to someone who can help right now. You can contact Sumithrayo (Sri Lanka) at +94 11 2 682535, or call the National Mental Health Helpline at 1926 (Toll-Free). Your life is valuable, please stay safe.";
        }

        // 2. LANGUAGE SWITCH REQUESTS
        if (/\b(english|ingirisi|ingreesi|ඉංග්‍රීසි)\b/i.test(t)) {
            return "Sure! I will speak in English. How can I help you today?";
        }
        if (/\b(sinhala|singhala|sinhalen|siinhalen|සිංහල)\b/i.test(t)) {
            return "ඔව්, මම සිංහලෙන් කතා කරන්නම්. ඔබට දැනෙන දේ මට පවසන්න.";
        }

        // 3. GREETINGS
        if (/^(hi|hello|hey|hola|good morning|good afternoon|good evening)/.test(t) || 
            /^(කොහොමද|හෙලෝ|ආයුබෝවන්)/.test(t)) {
            return useSinhala
                ? "ආයුබෝවන්! ඔබට සහාය වීමට මම සැමවිටම මෙහි සිටිමි. අද දවසේ ඔබේ සිතේ තිබෙන්නේ කුමක්ද?"
                : "Hello! I'm here to listen and support you. What is on your mind today?";
        }

        // 4. PANIC / ACUTE ANXIETY
        if (/\b(panic|attack|can't breathe|scared to death|hyperventilating)\b/i.test(t) || 
            /(බය|බයවෙලා|හුස්ම ගන්න බෑ|කලබල)/.test(t)) {
            return useSinhala
                ? "සන්සුන් වන්න, ඔබ මෙහි ආරක්ෂිතයි. අපි සරල හුස්ම ගැනීමේ ව්‍යායාමයක් කරමු: ඔබේ බඩ මත අතක් තබා ගන්න. සෙමින් තත්පර 4ක් හුස්ම ඇතුළට ගන්න, තත්පර 4ක් රඳවා ගන්න, ඉන්පසු තත්පර 6ක් පුරා සෙමින් හුස්ම පිට කරන්න. මෙය 3 වතාවක් නැවත කරන්න."
                : "Take a deep breath. You are safe here. Let's do a simple grounding exercise together: Place a hand on your belly. Inhale slowly for 4 seconds, hold for 4 seconds, and exhale gently for 6 seconds. Repeat this a few times to let the wave pass.";
        }

        // 5. ANXIETY / STRESS / OVERWHELM
        if (/\b(anxiety|stress|overwhelmed|worried|nervous|tension|pressure)\b/i.test(t) || 
            /(කාංසාව|ආතතිය|කලකිරීම|මහන්සියි|ස්ට්‍රෙස්)/.test(t)) {
            return useSinhala
                ? "ආතතිය සහ කාංසාව පාලනය කිරීමට හොඳම ක්‍රමය වන්නේ කුඩා පියවරෙන් පියවර ඉදිරියට යාමයි. අද දවසේ ඔබ කළ යුතු එකම එක් කුඩා කාර්යයක් පමණක් තෝරාගෙන එය කරන්න. අපගේ 'Breathing' පිටුවේ ඇති හුස්ම ගැනීමේ අභ්‍යාසයද ඔබට සහනයක් ගෙන දේවි."
                : "Anxiety and stress can make everything feel heavy. Try to focus on just the next small step. What is one tiny thing you can do right now to make yourself comfortable? You might also want to try our 'Breathing' tool in the navigation bar.";
        }

        // 6. DEPRESSION / SADNESS / LOSS
        if (/\b(sad|unhappy|depress|hopeless|down|cry|crying|lonely|alone|hurt)\b/i.test(t) || 
            /(දුකයි|කණගාටුයි|තනියම|පාළුයි|අඬනවා|අසරණ)/.test(t)) {
            return useSinhala
                ? "ඔබ මේ අපහසු කාල පරිච්ඡේදය පසු කරන විට ඔබට දැනෙන දුක සහ තනිකම මට වැටහෙනවා. කරුණාකර මතක තබා ගන්න ඔබ තනි වී නැති බව. ඔබට සමීපතම හෝ විශ්වාසවන්ත අයෙකුට මේ බව පවසන්න. මනස සැහැල්ලු කර ගැනීමට විනාඩි 10ක කෙටි ඇවිදීමක් හෝ උණුසුම් ස්නානයක් කිරීමට උත්සාහ කරන්න."
                : "I can feel how heavy things are for you right now, and it is completely okay to feel sad or lonely. You don't have to carry this all by yourself. Try texting a supportive friend or family member, or engage in a simple 10-minute activity like a short walk or tidy your desk. Small steps count.";
        }

        // 7. SLEEP PROBLEMS
        if (/\b(sleep|insomnia|can't sleep|nightmare|awake)\b/i.test(t) || 
            /(නින්ද|නිදි|නිදාගන්න බෑ)/.test(t)) {
            return useSinhala
                ? "නින්ද නොයාම ශරීරයට මෙන්ම මනසටද මහත් වෙහෙසක් ගෙන දෙයි. නින්දට යාමට පෙර සියලුම දුරකථන සහ පරිගණක තිර ක්‍රියාවිරහිත කරන්න. කාමරයේ ආලෝකය අඩු කර මනස සන්සුන් කරන සංගීතයකට සවන් දෙන්න. අපගේ 'Resources' පිටුවේ ඇති ලිහිල් කිරීමේ ප්‍රතිකාර (Relaxation Therapies) උත්සාහ කර බලන්න."
                : "Getting good sleep is vital for mental health, but hard when the mind is racing. Try keeping your screens away 30 minutes before sleep, dimming the lights, and focusing on a simple body scan (relaxing each muscle group from toes to head). You can also find meditation tracks under our 'Resources' tab.";
        }

        // 8. RELATIONSHIPS / CONFLICT
        if (/\b(relationship|breakup|fight|arguing|friend|boyfriend|girlfriend|husband|wife|divorce)\b/i.test(t) || 
            /(රණ්ඩු|ප්‍රශ්න|තරහා වෙලා|සම්බන්ධතාවය)/.test(t)) {
            return useSinhala
                ? "සම්බන්ධතාවල ඇති වන ගැටලු අපව දැඩි ලෙස රිදවිය හැකිය. මේ වෙලාවේ කෝපයෙන් තොරව, සන්සුන්ව ඔබේ හැඟීම් ප්‍රකාශ කිරීමට අවස්ථාවක් සොයා ගන්න. අවශ්‍ය නම්, ඔබට වෘත්තීය මට්ටමේ මගපෙන්වීමක් ලබා ගැනීමට අපගේ 'Counselors' අංශයෙන් දක්ෂ උපදේශකයෙකු සම්බන්ධ කර ගත හැකිය."
                : "Relationship challenges can trigger a lot of emotional pain. It's often helpful to take a step back and communicate using 'I feel...' statements rather than blame. If you feel stuck, you can book a session with one of our professional specialists in the 'Counselors' tab.";
        }

        // 9. APPRECIATION / THANK YOU
        if (/\b(thank you|thanks|helpful|good bot|awesome|great)\b/i.test(t) || 
            /(ස්තූතියි|ස්තුතියි|නියමයි|උදව් උනා)/.test(t)) {
            return useSinhala
                ? "ඔබව සාදරයෙන් පිළිගනිමි! ඔබට උපකාර කිරීමට ලැබීම ගැන මම ඉතා සතුටු වෙමි. ඔබට අවශ්‍ය ඕනෑම වේලාවක මා මෙහි සිටී. සුභ දවසක්!"
                : "You are very welcome! I'm glad I could support you. Remember, I'm always here whenever you need a friendly ear to talk to. Take care!";
        }

        // 10. DEFAULT RESPONSIVE FALLBACK
        return useSinhala
            ? "මම ඔබට සවන් දී සිටිමි. ඔබට දැනෙන දේ හෝ ඔබේ සිතට වද දෙන දේ ගැන තව ටිකක් මට කියන්න පුළුවන්ද? අපි එක්ව එය විසඳා ගැනීමට උත්සාහ කරමු."
            : "I hear you, and I want to support you fully. Could you share a bit more about what's going on or how that makes you feel? Let's talk through it step by step.";
    };

    // Suggestion chips based on selected language mode
    const getSuggestions = () => {
        if (sinhalaMode) {
            return [
                { label: "මට කාංසාවක් දැනෙනවා 😰", value: "මට කාංසාවක් දැනෙනවා" },
                { label: "මාව සන්සුන් කරන්න 🧘", value: "මට හුස්ම ගන්න අමාරුයි, මාව සන්සුන් කරන්න" },
                { label: "මට ගොඩක් දුකයි 😢", value: "මට ගොඩක් දුකයි, තනියම කියල දැනෙනවා" },
                { label: "නින්ද යන්නේ නෑ 😴", value: "මට රෑට නින්ද යන්නේ නෑ" },
                { label: "English වලින් කතා කරන්න 🇬🇧", value: "Can we talk in English?" }
            ];
        } else {
            return [
                { label: "I'm feeling anxious 😰", value: "I am feeling very anxious today" },
                { label: "Help me calm down 🧘", value: "I'm having a panic attack, help me calm down" },
                { label: "I feel very sad 😢", value: "I'm feeling really sad and hopeless" },
                { label: "Can't sleep 😴", value: "I'm having trouble sleeping" },
                { label: "සිංහලෙන් කතා කරන්න 🇱🇰", value: "Can you speak in Sinhala?" }
            ];
        }
    };

    const handleSuggestionClick = (val) => {
        if (val === "Can we talk in English?") {
            setSinhalaMode(false);
            setMessages(prev => [...prev, { role: 'user', content: val }]);
            setIsTyping(true);
            setTimeout(() => {
                setMessages(prev => [...prev, { role: 'assistant', content: "Sure, let's continue our conversation in English! How can I help you today?" }]);
                setIsTyping(false);
            }, 800);
        } else {
            sendMessageFlow(val);
        }
    };

    return (
        <section id="chat" className="view active animate-in">
            <h2 className="hero-text" style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
                {sinhalaMode ? 'AI මනෝ සහාය' : (dict.titles?.chat || 'AI Support')}
            </h2>
            <div className="chat-container" style={{ display: 'flex', flexDirection: 'column', height: '620px' }}>
                <div className="chat-header">
                    <div className="person-card">
                        <img src="/images/Chatbot.jpg" alt="Assistant" className="avatar" />
                        <div>
                            <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>
                                {sinhalaMode ? 'මනෝ සුවතා සහායකයා' : (dict.chat?.name || 'MindEase Assistant')}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {isTyping 
                                    ? (sinhalaMode ? 'මග පෙන්වීම සූදානම් කරමින්...' : (dict.chat?.typing || 'Typing guidance...')) 
                                    : (sinhalaMode ? 'සහාය වීමට සූදානම්' : (dict.chat?.ready || 'Ready to help'))}
                            </div>
                        </div>
                    </div>
                    <div className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                        {sinhalaMode ? 'AI තාක්ෂණයෙන්' : (dict.chat?.aiPowered || 'AI Powered')}
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
                            onClick={() => handleSuggestionClick(chip.value)}
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
                        placeholder={sinhalaMode ? "පණිවිඩයක් ලියන්න..." : "Type a message…"}
                        style={{ flex: 1, margin: 0, minHeight: '50px', maxHeight: '150px', resize: 'none' }}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                    />
                    <button type="submit" className="btn-formal" style={{ padding: '0.8rem 1.5rem' }}>
                        {sinhalaMode ? 'යවන්න' : 'Send'}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Chat;
