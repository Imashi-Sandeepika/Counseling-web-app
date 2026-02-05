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
            { id: 'admin-dashboard', label: 'Admin', icon: '🛡️' },
            { id: 'notifications', label: dict.nav.notifications, icon: '🔔' }
        ];
    } else if (store.counselor.authenticated) {
        navItems = [
            { id: 'counselor-dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'notifications', label: dict.nav.notifications, icon: '🔔' }
        ];
    } else {
        navItems = [
            { id: 'home', label: 'Home', icon: '🏠' },
            { id: 'my-bookings', label: 'Bookings', icon: '📅' },
            { id: 'live-session', label: 'Breathing', icon: '🌬️' },
            { id: 'resources', label: 'Resources', icon: '📚' },
            { id: 'chat', label: 'AI Chat', icon: '🤖' },
            { id: 'counselors', label: 'Counselors', icon: '👨‍⚕️' },
            { id: 'notifications', label: 'Alerts', icon: '🔔' }
        ];
    }

    return (
        <header style={{
            zIndex: 10000,
            pointerEvents: 'auto',
            padding: '15px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '15px'
        }}>
            <div className="brand" onClick={() => navigate(store.admin.authenticated ? 'admin-dashboard' : (store.counselor.authenticated ? 'counselor-dashboard' : 'home'))} style={{ cursor: 'pointer', fontWeight: '800', fontSize: '1.5rem', letterSpacing: '-1px', pointerEvents: 'auto' }}>
                <span style={{ color: 'var(--accent)' }}>Psy</span>Care
            </div>

            <nav style={{
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flex: '1',
                justifyContent: 'center',
                flexWrap: 'wrap'
            }}>
                {navItems.map(item => (
                    <button
                        key={item.id}
                        className={`nav-btn ${activeView === item.id ? 'active' : ''}`}
                        onClick={() => navigate(item.id)}
                        style={{
                            padding: '8px 12px',
                            fontSize: '0.85rem',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}

                <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 8px' }}></div>

                <button
                    className={`nav-btn ${activeView === 'settings' ? 'active' : ''}`}
                    onClick={() => navigate('settings')}
                    style={{
                        padding: '8px 12px',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    <span>⚙️</span>
                    <span>{dict.nav.settings}</span>
                </button>

                <button
                    className="nav-btn"
                    onClick={logout}
                    style={{
                        color: 'var(--bad)',
                        opacity: 0.8,
                        padding: '8px 12px',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    <span>🚪</span>
                    <span>Sign Out</span>
                </button>
            </nav>
        </header>
    );
};

export default Header;
