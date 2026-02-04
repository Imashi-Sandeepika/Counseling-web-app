import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();

const CATEGORIES = [
    "Stress & Anxiety", "Depression & Sadness", "Relationship Issues",
    "Work/Academic Issues", "Career Guidance", "Self‑esteem & Confidence",
    "Anger Management & Emotional Control", "Addictions & Habits",
    "Life Transition & Challenges", "Other / Unspecified"
];

const INITIAL_STORE = {
    user: { authenticated: false, email: "", name: "", token: "" },
    counselor: { authenticated: false, id: null, email: "", name: "", token: "" },
    admin: { authenticated: false, id: null, email: "", name: "", token: "" },
    activities: [],
    sessions: [],
    counselors: [],
    appointments: [],
    payments: [],
    notifications: [],
    counselorVerified: false,
    counselorInterviewed: false,
    settings: {
        language: "en",
        sectionLangs: {},
        theme: "light",
        accent: "#9ACD32",
        reduced: false,
        fontScale: 1,
        contrast: "normal",
        kbdHints: false,
        accounts: [],
        lastResourcesCategory: CATEGORIES[0],
        openaiKey: ""
    }
};

export const StoreProvider = ({ children }) => {
    const [store, setStore] = useState(() => {
        const saved = localStorage.getItem("mh_store_react");
        return saved ? JSON.parse(saved) : INITIAL_STORE;
    });

    const [activeView, setActiveView] = useState('landing-login');

    useEffect(() => {
        localStorage.setItem("mh_store_react", JSON.stringify(store));
        // Apply theme
        const d = document.documentElement;
        d.dataset.theme = store.settings.theme;
        d.dataset.contrast = store.settings.contrast;
        d.dataset.reduced = store.settings.reduced ? "true" : "false";
        d.style.setProperty('--accent', store.settings.accent);
        d.style.setProperty('--font-scale', String(store.settings.fontScale || 1));
    }, [store]);

    const api = async (path, method = 'GET', body = null) => {
        const token = store.user.token || store.counselor.token || store.admin.token || "";
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (token) options.headers['Authorization'] = 'Bearer ' + token;
        if (body) options.body = JSON.stringify(body);

        try {
            const res = await fetch(`http://127.0.0.1:8000${path}`, options);
            let data = null;
            try { data = await res.json() } catch (e) { data = null }
            if (data && typeof data === 'object' && !('ok' in data)) data.ok = res.ok;
            if (data) return data;
            return { ok: res.ok, status: res.status };
        } catch (e) {
            console.error(`API Error on ${path}:`, e);
            return { ok: false, error: String(e) };
        }
    };

    const navigate = (view, bypassAuth = false) => {
        const isAuth = bypassAuth || store.user.authenticated || store.counselor.authenticated || store.admin.authenticated;
        const publicViews = ['landing-login', 'register-counselor', 'forgot-password', 'counselor-task', 'counselor-interview', 'privacy', 'terms'];

        let target = view;
        if (!isAuth && !publicViews.includes(view)) {
            target = 'landing-login';
        }

        setActiveView(target);
        // Removed addActivity from here to prevent lag on redirection
    };

    const addActivity = (type, detail) => {
        const newActivity = { type, detail, ts: Date.now() };
        setStore(prev => ({
            ...prev,
            activities: [newActivity, ...prev.activities.slice(0, 199)]
        }));

        // Non-blocking notification
        if (store.user.email) {
            api('/api/notifications', 'POST', {
                email: store.user.email,
                msg: `${type} • ${detail}`,
                status: 'info'
            }).catch(e => console.error("Activity Notification Error:", e));
        }
    };

    const logout = () => {
        setActiveView('landing-login');
        setStore(prev => ({
            ...prev,
            user: INITIAL_STORE.user,
            counselor: INITIAL_STORE.counselor,
            admin: INITIAL_STORE.admin
        }));
    };

    const value = {
        store,
        setStore,
        activeView,
        navigate,
        api,
        logout,
        addActivity,
        CATEGORIES
    };

    return (
        <StoreContext.Provider value={value}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => useContext(StoreContext);
