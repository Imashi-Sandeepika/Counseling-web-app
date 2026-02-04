import React from 'react';
import { useStore } from '../context/StoreContext';
import { i18n } from '../i18n';

const Header = () => {
    const { store, activeView, navigate, logout } = useStore();
    const lang = store.settings.language || 'en';
    const dict = i18n[lang] || i18n.en;

    const publicViews = ['landing-login', 'register-counselor', 'forgot-password'];
    const showHeader = (store.user.authenticated || store.counselor.authenticated || store.admin.authenticated) && !publicViews.includes(activeView);

    if (!showHeader) return null;

    let navItems = [];

    if (store.admin.authenticated) {
        navItems = [
            { id: 'admin-dashboard', label: 'Admin' },
            { id: 'notifications', label: dict.nav.notifications }
        ];
    } else if (store.counselor.authenticated) {
        navItems = [
            { id: 'counselor-dashboard', label: 'Dashboard' },
            { id: 'notifications', label: dict.nav.notifications }
        ];
    } else {
        navItems = [
            { id: 'home', label: dict.nav.home },
            { id: 'resources', label: dict.nav.resources },
            { id: 'chat', label: dict.nav.chat },
            { id: 'counselors', label: dict.nav.counselors },
            { id: 'notifications', label: dict.nav.notifications }
        ];
    }



    return (
        <header style={{ zIndex: 10000, pointerEvents: 'auto' }}>
            <div className="brand" onClick={() => navigate(store.admin.authenticated ? 'admin-dashboard' : (store.counselor.authenticated ? 'counselor-dashboard' : 'home'))} style={{ cursor: 'pointer', fontWeight: '800', fontSize: '1.5rem', letterSpacing: '-1px', pointerEvents: 'auto' }}>
                <span style={{ color: 'var(--accent)' }}>Psy</span>Care
            </div>
            <nav style={{ pointerEvents: 'auto' }}>
                {navItems.map(item => (
                    <button
                        key={item.id}
                        className={`nav-btn ${activeView === item.id ? 'active' : ''}`}
                        onClick={() => navigate(item.id)}
                    >
                        {item.label}
                    </button>
                ))}

                <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 10px' }}></div>

                <button
                    className={`nav-btn ${activeView === 'settings' ? 'active' : ''}`}
                    onClick={() => navigate('settings')}
                >
                    {dict.nav.settings}
                </button>

                <button className="nav-btn" onClick={logout} style={{ color: 'var(--bad)', opacity: 0.8 }}>
                    Sign Out
                </button>
            </nav>
        </header>
    );
};

export default Header;
