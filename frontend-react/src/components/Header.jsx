import React from 'react';
import { useStore } from '../context/StoreContext';
import { i18n } from '../i18n';

const Header = () => {
    const { store, activeView, navigate, logout } = useStore();
    const lang = store.settings.language || 'en';
    const dict = i18n[lang] || i18n.en;

    const showHeader = store.user.authenticated || store.counselor.authenticated || store.admin.authenticated;

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
            { id: 'profile', label: 'Profile' },
            { id: 'resources', label: dict.nav.resources },
            { id: 'chat', label: dict.nav.chat },
            { id: 'counselors', label: dict.nav.counselors },
            { id: 'notifications', label: dict.nav.notifications }
        ];
    }

    const getProfileImage = () => {
        if (store.admin.authenticated) return '/images/Admin.jpg';
        if (store.counselor.authenticated) return store.counselor.profile_image || '/images/Counselor.jpg'; // Assuming profile image is stored or default
        if (store.user.authenticated) return '/images/User.jpg'; // Default user avatar
        return null;
    };

    const profileImg = getProfileImage();

    return (
        <header>
            <div className="brand" onClick={() => navigate(store.admin.authenticated ? 'admin-dashboard' : (store.counselor.authenticated ? 'counselor-dashboard' : 'home'))} style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2em', letterSpacing: '1px' }}>
                PsyCare
            </div>
            <nav style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {navItems.map(item => (
                    <button
                        key={item.id}
                        className={`nav-btn ${activeView === item.id ? 'active' : ''}`}
                        onClick={() => navigate(item.id)}
                    >
                        {item.label}
                    </button>
                ))}

                {profileImg && (
                    <div
                        onClick={() => navigate('profile')}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: '2px solid var(--accent)',
                            cursor: 'pointer',
                            marginLeft: '10px'
                        }}
                    >
                        <img
                            src={profileImg}
                            alt="Profile"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.onerror = null; e.target.src = '/images/User.jpg' }}
                        />
                    </div>
                )}

                <button className="nav-btn" onClick={logout} style={{ background: 'var(--bad)', color: 'white', border: 'none' }}>
                    Logout
                </button>
            </nav>
        </header>
    );
};

export default Header;
