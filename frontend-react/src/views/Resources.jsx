import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { i18n } from '../i18n';

const RESOURCES_MAP = {
    "Stress & Anxiety": {
        advice: ["Practice 4-7-8 breathing for 5 minutes", "Reduce caffeine and sugar intake", "Create a 'worry time' (15 min per day only)", "Keep a daily journal for stress triggers"],
        motivation: [
            { t: "The Science of Stress & Anxiety", u: "https://www.youtube.com/results?search_query=science+of+stress+and+anxiety" },
            { t: "Jordan Peterson: Facing Anxiety", u: "https://www.youtube.com/results?search_query=jordan+peterson+anxiety" },
            { t: "TED: How to stay calm under pressure", u: "https://www.youtube.com/results?search_query=ted+stay+calm+under+pressure" }
        ],
        relax: [
            { t: "Nature Ambience for Deep Focus", u: "https://www.youtube.com/results?search_query=nature+ambience+for+focus" },
            { t: "Deep Sleep Restoration", u: "https://www.youtube.com/results?search_query=deep+sleep+restoration+meditation" },
            { t: "ASMR for Anxiety Relief", u: "https://www.youtube.com/results?search_query=asmr+for+anxiety" }
        ]
    },
    "Depression & Sadness": {
        advice: ["Step into direct sunlight within 30 mins of waking", "Reach out to one trusted friend today", "Set one small achievable goal (e.g., wash a dish)", "Limit scroll time on social media to 30 mins"],
        motivation: [
            { t: "Andrew Solomon: The secret we share", u: "https://www.youtube.com/results?search_query=andrew+solomon+depression+ted" },
            { t: "The Neurobiology of Depression", u: "https://www.youtube.com/results?search_query=neurobiology+of+depression" },
            { t: "Resilience: Rising from the Dark", u: "https://www.youtube.com/results?search_query=resilience+depression+stories" }
        ],
        relax: [
            { t: "Gentle Morning Yoga", u: "https://www.youtube.com/results?search_query=gentle+morning+yoga+depression" },
            { t: "Solfeggio Frequencies 528Hz", u: "https://www.youtube.com/results?search_query=528hz+healing+frequencies" },
            { t: "Calm Rainfall for Meditation", u: "https://www.youtube.com/results?search_query=rain+sounds+for+calm" }
        ]
    },
    "Relationship Issues": {
        advice: ["Practice active listening without interrupting", "Identify your 'Love Language'", "Set healthy boundaries for personal space", "Schedule a 'Check-in' conversation with your partner"],
        motivation: [
            { t: "Esther Perel: Relationships 101", u: "https://www.youtube.com/results?search_query=esther+perel+relationships" },
            { t: "Communication Skills: Resolving Conflict", u: "https://www.youtube.com/results?search_query=communication+skills+conflict+resolution" },
            { t: "The Science of Love and Connection", u: "https://www.youtube.com/results?search_query=science+of+love+connection" }
        ],
        relax: [
            { t: "Guided Forgiveness Meditation", u: "https://www.youtube.com/results?search_query=guided+forgiveness+meditation" },
            { t: "Soft Acoustic Music for Peace", u: "https://www.youtube.com/results?search_query=soft+acoustic+background+music" },
            { t: "Mindful Connection Exercise", u: "https://www.youtube.com/results?search_query=mindful+connection+exercise" }
        ]
    },
    "Work/Academic Issues": {
        advice: ["Use the Pomodoro technique (25 min work, 5 min break)", "Break huge tasks into 5 tiny checkboxes", "Stop multitasking; focus on one task at a time", "Organize your workspace for clarity"],
        motivation: [
            { t: "The Power of Grit and Discipline", u: "https://www.youtube.com/results?search_query=power+of+grit+motivation" },
            { t: "How to Stop Procrastinating", u: "https://www.youtube.com/results?search_query=how+to+stop+procrastinating" },
            { t: "Atomic Habits: Micro-Changes", u: "https://www.youtube.com/results?search_query=atomic+habits+jordan+peterson" }
        ],
        relax: [
            { t: "Lofi Beats for Deep Focus", u: "https://www.youtube.com/results?search_query=lofi+beats+for+studying" },
            { t: "Desktop Stretching Routine", u: "https://www.youtube.com/results?search_query=desk+stretching+routine" },
            { t: "White Noise for Productivity", u: "https://www.youtube.com/results?search_query=white+noise+deep+work" }
        ]
    },
    "Career Guidance": {
        advice: ["Update your resume with specific achievements", "Network with one person in your target field", "Identify your top 3 core professional values", "Research trends in your industry"],
        motivation: [
            { t: "Simon Sinek: Start With Why", u: "https://www.youtube.com/results?search_query=simon+sinek+start+with+why" },
            { t: "Finding Your Passion: Practical Guide", u: "https://www.youtube.com/results?search_query=finding+your+passion+career" },
            { t: "The Future of Professional Work", u: "https://www.youtube.com/results?search_query=future+of+work" }
        ],
        relax: [
            { t: "Career Manifestation Meditation", u: "https://www.youtube.com/results?search_query=career+manifestation+meditation" },
            { t: "Deep Breathing for Confidence", u: "https://www.youtube.com/results?search_query=breathing+for+interview+confidence" },
            { t: "Ambient Office Ambiance (Soft)", u: "https://www.youtube.com/results?search_query=soft+office+ambience" }
        ]
    },
    "Self‑esteem & Confidence": {
        advice: ["List 3 things you are proud of yourself for", "Practice power posing before big meetings", "Reframe one negative thought into a neutral one", "Wear something today that makes you feel good"],
        motivation: [
            { t: "Amy Cuddy: Your Body Language Shapes You", u: "https://www.youtube.com/results?search_query=amy+cuddy+ted+talk" },
            { t: "Overcoming Imposter Syndrome", u: "https://www.youtube.com/results?search_query=overcoming+imposter+syndrome" },
            { t: "Self-Compassion with Dr. Kristin Neff", u: "https://www.youtube.com/results?search_query=kristin+neff+self+compassion" }
        ],
        relax: [
            { t: "Positive Affirmations: Morning", u: "https://www.youtube.com/results?search_query=morning+affirmations+self+esteem" },
            { t: "Confidence Subliminals (Ambient)", u: "https://www.youtube.com/results?search_query=confidence+subliminal+music" },
            { t: "Gratitude Meditation: Self-Love", u: "https://www.youtube.com/results?search_query=self+love+meditation" }
        ]
    },
    "Anger Management & Emotional Control": {
        advice: ["Practice the 'Stop, Think, Act' rule", "Identify physical signs of anger early", "Take a 'time-out' from the environment", "Use 'I' statements to express feelings"],
        motivation: [
            { t: "Understanding Anger: Psychology", u: "https://www.youtube.com/results?search_query=psychology+of+anger" },
            { t: "How to stay calm when you're angry", u: "https://www.youtube.com/results?search_query=how+to+stay+calm+angry" },
            { t: "Stoicism: Controlling Emotions", u: "https://www.youtube.com/results?search_query=stoic+emotional+control" }
        ],
        relax: [
            { t: "Vagus Nerve Exercises for Calm", u: "https://www.youtube.com/results?search_query=vagus+nerve+exercises+anger" },
            { t: "Aggressive Anger Release Meditation", u: "https://www.youtube.com/results?search_query=meditation+for+anger+release" },
            { t: "Calm Ocean Waves (Heavy)", u: "https://www.youtube.com/results?search_query=heavy+ocean+waves+relaxing" }
        ]
    },
    "Addictions & Habits": {
        advice: ["Identify your most common triggers", "Find a healthy 'replacement' habit", "Build a support network/group", "Take it one hour at a time"],
        motivation: [
            { t: "Dr. Gabor Mate: The Roots of Addiction", u: "https://www.youtube.com/results?search_query=gabor+mate+addiction" },
            { t: "How Habits Are Formed: Science", u: "https://www.youtube.com/results?search_query=power+of+habit+science" },
            { t: "Stories of Recovery and Strength", u: "https://www.youtube.com/results?search_query=addiction+recovery+stories" }
        ],
        relax: [
            { t: "Mindfulness for Urge Surfing", u: "https://www.youtube.com/results?search_query=urge+surfing+mindfulness" },
            { t: "Healing Frequency 417Hz", u: "https://www.youtube.com/results?search_query=417hz+healing+removal+of+negative+energy" },
            { t: "Full-Body Relaxation Scan", u: "https://www.youtube.com/results?search_query=body+scan+meditation+for+healing" }
        ]
    },
    "Life Transition & Challenges": {
        advice: ["Accept that transitions take time to adjust", "Focus on what you CAN control today", "Maintain a basic routine (sleep, eat, wash)", "Seek guidance from someone who's been there"],
        motivation: [
            { t: "Managing Change: Growth Mindset", u: "https://www.youtube.com/results?search_query=growth+mindset+change" },
            { t: "The Hero's Journey: Adapting", u: "https://www.youtube.com/results?search_query=hero+journey+motivation" },
            { t: "Finding Meaning in Difficult Times", u: "https://www.youtube.com/results?search_query=viktor+frankl+meaning" }
        ],
        relax: [
            { t: "Soft Forest Rain for Peace", u: "https://www.youtube.com/results?search_query=forest+rain+sounds+for+anxiety" },
            { t: "Guided Acceptance Meditation", u: "https://www.youtube.com/results?search_query=guided+acceptance+meditation" },
            { t: "Slow Instrumental Piano", u: "https://www.youtube.com/results?search_query=slow+instrumental+piano+peaceful" }
        ]
    },
    "Other / Unspecified": {
        advice: ["Focus on the basics: Sleep, Water, Movement", "Write down your thoughts for 10 minutes", "Practice deep abdominal breathing", "Step outside for fresh air"],
        motivation: [
            { t: "The Philosophy of Optimism", u: "https://www.youtube.com/results?search_query=philosophy+of+optimism" },
            { t: "Life Advice for any Situation", u: "https://www.youtube.com/results?search_query=general+life+advice+motivation" },
            { t: "Stoic Wisdom for Modern Life", u: "https://www.youtube.com/results?search_query=stoic+wisdom+for+life" }
        ],
        relax: [
            { t: "Binaural Beats for Relaxation", u: "https://www.youtube.com/results?search_query=binaural+beats+relaxing" },
            { t: "Deep Zen Temple Ambience", u: "https://www.youtube.com/results?search_query=zen+temple+ambience" },
            { t: "Gentle Night Sky Visualization", u: "https://www.youtube.com/results?search_query=night+sky+meditation" }
        ]
    }
};

const Resources = () => {
    const { store, setStore, CATEGORIES } = useStore();
    const lang = store.settings.language || 'en';
    const dict = i18n[lang] || i18n.en;
    const [category, setCategory] = useState(store.settings.lastResourcesCategory || CATEGORIES[0]);

    const data = RESOURCES_MAP[category] || {
        advice: ["Try a brief breathing exercise", "Write one gratitude", "Take a 10‑minute walk"],
        motivation: [{ t: "General Motivation", u: "https://www.google.com/search?q=motivation+video" }],
        relax: [{ t: "Body Scan", u: "https://www.youtube.com/watch?v=ZToicYcHIOU" }]
    };

    const handleCategoryChange = (e) => {
        const newCat = e.target.value;
        setCategory(newCat);
        setStore(prev => ({
            ...prev,
            settings: { ...prev.settings, lastResourcesCategory: newCat }
        }));
    };

    return (
        <section id="resources" className="view active">
            <h2>{dict.titles?.resources || 'Common Section'}</h2>
            <div className="panel">
                <p>Select the category that best describes your issue from the available categories.</p>
                <label>
                    {dict.resources?.category_label || 'Category'}
                    <select value={category} onChange={handleCategoryChange}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </label>
            </div>

            <div className="grid three">
                <div className="panel" style={{ minHeight: '300px', borderTop: '4px solid var(--accent)' }}>
                    <h3>{dict.resources?.self_try || 'Try with yourself'}</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {data.advice.map((item, i) => (
                            <li key={i} style={{ marginBottom: '12px', paddingLeft: '20px', position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 0, color: 'var(--accent)' }}>•</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="panel" style={{ minHeight: '300px', borderTop: '4px solid var(--accent)' }}>
                    <h3>{dict.resources?.motivation || 'Motivation Videos'}</h3>
                    <ul className="links">
                        {data.motivation.map((item, i) => (
                            <li key={i}><a href={item.u} target="_blank" rel="noopener noreferrer">{item.t}</a></li>
                        ))}
                    </ul>
                </div>

                <div className="panel" style={{ minHeight: '300px', borderTop: '4px solid var(--accent)' }}>
                    <h3>{dict.resources?.relaxation || 'Relaxation Therapies'}</h3>
                    <ul className="links">
                        {data.relax.map((item, i) => (
                            <li key={i}><a href={item.u} target="_blank" rel="noopener noreferrer">{item.t}</a></li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Resources;
