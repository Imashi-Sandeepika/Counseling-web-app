import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const RESOURCES_MAP = {
    "Stress & Anxiety": {
        advice: ["Inhale 4, hold 4, exhale 6 for 3 minutes", "Limit caffeine; schedule short walks", "Write down the top worry and one action"],
        motivation: [
            { t: "How to Make Stress Your Friend (TED)", u: "https://www.youtube.com/watch?v=RcGyVTAoXEU" },
            { t: "Therapy in a Nutshell: Anxiety Skills", u: "https://www.youtube.com/results?search_query=therapy+in+a+nutshell+anxiety+skills" },
            { t: "Headspace: Managing Anxiety", u: "https://www.youtube.com/results?search_query=headspace+managing+anxiety" }
        ],
        relax: [
            { t: "Box Breathing Guide", u: "https://www.youtube.com/watch?v=aNXKjGFUlMs" },
            { t: "Mindfulness Body Scan", u: "https://www.youtube.com/watch?v=ZToicYcHIOU" },
            { t: "4-7-8 Breathing Technique", u: "https://www.youtube.com/results?search_query=4-7-8+breathing" }
        ]
    },
    "Depression & Sadness": {
        advice: ["List one support person and one small task", "Get sunlight or a short walk", "Reduce social media before sleep"],
        motivation: [
            { t: "Andrew Solomon: Depression (TED)", u: "https://www.youtube.com/results?search_query=andrew+solomon+depression+ted+talk" },
            { t: "Kati Morton: Dealing with Depression", u: "https://www.youtube.com/results?search_query=kati+morton+depression" }
        ],
        relax: [
            { t: "Guided Meditation for Low Mood", u: "https://www.youtube.com/results?search_query=guided+meditation+for+depression" },
            { t: "Sleep Relaxation", u: "https://www.youtube.com/watch?v=7nJY0L2uWqs" }
        ]
    },
    // ... more can be added later or loaded from a JSON file
};

const Resources = () => {
    const { store, setStore, CATEGORIES } = useStore();
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
            <h2>Common Section</h2>
            <div className="panel">
                <p>Select the category that best describes your issue from the available categories.</p>
                <label>
                    Category
                    <select value={category} onChange={handleCategoryChange}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </label>
            </div>

            <div className="grid three">
                <div className="panel card-common-section" style={{ minHeight: '300px' }}>
                    <h3>Try with yourself</h3>
                    <ul>
                        {data.advice.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>

                <div className="panel card-mini-chat" style={{ minHeight: '300px' }}>
                    <h3>Motivation Videos</h3>
                    <ul className="links">
                        {data.motivation.map((item, i) => (
                            <li key={i}><a href={item.u} target="_blank" rel="noopener noreferrer">{item.t}</a></li>
                        ))}
                    </ul>
                </div>

                <div className="panel card-hire-counselor" style={{ minHeight: '300px' }}>
                    <h3>Relaxation Therapies</h3>
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
