import React from 'react';
import { useStore } from '../context/StoreContext';
import { i18n } from '../i18n';

const Header = () => {
    const { store, activeView, navigate, logout } = useStore();
    const lang = store.settings.language || 'en';
    const dict = i18n[lang] || i18n.en;

    const publicViews = ['landing-login', 'forgot-password'];
    const showHeader = (store.user.authenticated || store.counselor.authenticated || store.admin.authenticated) && !publicViews.includes(activeView);

    if (!showHeader) return null;

    let navItems = [];

    if (store.admin.authenticated) {
        navItems = [
            { id: 'admin-dashboard', label: 'Dashboard', icon: '🛡️' },
            { id: 'admin-users', label: 'Users', icon: '👤' },
            { id: 'admin-counselors', label: 'Counselors', icon: '👨‍⚕️' },
            { id: 'admin-appointments', label: 'Appointments', icon: '📅' },
            { id: 'admin-reports', label: 'Reports', icon: '📊' },
            { id: 'notifications', label: 'Alerts', icon: '🔔' }
        ];
    } else if (store.counselor.authenticated) {
        navItems = [
            { id: 'counselor-dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'counselor-appointments', label: 'Appointments', icon: '📅' },
            { id: 'counselor-schedule', label: 'Schedule', icon: '🗓️' },
            { id: 'counselor-clients', label: 'Clients', icon: '👥' },
            { id: 'counselor-earnings', label: 'Earnings', icon: '💰' },
            { id: 'notifications', label: 'Alerts', icon: '🔔' }
        ];
    } else {
        navItems = [
            { id: 'resources', label: dict.nav.resources, icon: '📚' },
            { id: 'chat', label: dict.nav.chat, icon: '🤖' },
            { id: 'counselors', label: dict.nav.counselors, icon: '👨‍⚕️' },
            { id: 'notifications', label: 'Alert', icon: '🔔' },
            { id: 'settings', label: dict.nav.settings, icon: '⚙️' }
        ];
    }

    return (
        <header>
            <nav>
                {navItems.map(item => (
                    <button
                        key={item.id}
                        className={`nav-btn ${activeView === item.id ? 'active' : ''}`}
                        onClick={() => navigate(item.id)}
                    >
                        <span>{item.label}</span>
                        <span>{item.icon}</span>
                    </button>
                ))}

                <button
                    className="nav-btn"
                    onClick={logout}
                    style={{ color: 'var(--bad)' }}
                >
                    <span>{dict.nav.signout}</span>
                    <span>🚪</span>
                </button>
            </nav>
        </header>
    );
};

export default Header;
