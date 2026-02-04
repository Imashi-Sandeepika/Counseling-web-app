import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';

const Settings = () => {
    const { store, setStore } = useStore();
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(store.user.name || '');
    const [tempImage, setTempImage] = useState(store.user.profileImage || '/images/user_DP.jpg');
    const fileInputRef = useRef(null);

    const handleUpdate = (path, val) => {
        setStore(prev => {
            const keys = path.split('.');
            let newState = { ...prev };
            let current = newState;
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = val;
            return newState;
        });
    };

    const handleSave = () => {
        setStore(prev => ({
            ...prev,
            user: { ...prev.user, name: tempName, profileImage: tempImage }
        }));
        setIsEditing(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };


    return (
        <section id="settings" className="view active">
            <h2>Settings</h2>

            <div className="panel animate-in" style={{
                background: 'linear-gradient(135deg, var(--surface) 0%, #1a1f26 100%)',
                padding: '40px',
                borderRadius: '24px',
                border: '1px solid var(--border)',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: '40px',
                boxShadow: 'var(--shadow-lg)'
            }}>
                {/* Decorative Glow */}
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '200px',
                    height: '200px',
                    background: 'var(--accent)',
                    filter: 'blur(100px)',
                    opacity: 0.15,
                    zIndex: 0
                }}></div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '30px', position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                        <div
                            style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: '4px solid var(--accent)',
                                boxShadow: '0 0 20px var(--accent-glow)',
                                transition: 'var(--transition)',
                                cursor: isEditing ? 'pointer' : 'default'
                            }}
                            className="profile-avatar-hover"
                            onClick={() => isEditing && fileInputRef.current.click()}
                        >
                            <img
                                src={isEditing ? tempImage : (store.user.profileImage || '/images/user_DP.jpg')}
                                alt="Profile"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { e.target.onerror = null; e.target.src = '/images/user_DP.jpg' }}
                            />
                            {isEditing && (
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'rgba(0,0,0,0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.8rem',
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}>Edit</div>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <div style={{
                            position: 'absolute',
                            bottom: '5px',
                            right: '5px',
                            background: 'var(--accent)',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: '3px solid var(--surface)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                        }}></div>
                    </div>

                    <div style={{ flex: 1, minWidth: '200px' }}>
                        {isEditing ? (
                            <div style={{ marginBottom: '15px' }}>
                                <input
                                    type="text"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    style={{
                                        fontSize: '1.5rem',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--accent)',
                                        color: '#fff',
                                        padding: '8px 15px',
                                        borderRadius: '8px',
                                        width: '100%',
                                        maxWidth: '300px'
                                    }}
                                    placeholder="Enter your name"
                                />
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                <h2 style={{ margin: 0, fontSize: '2.2rem', letterSpacing: '-0.5px' }}>{store.user.name || 'User'}</h2>
                            </div>
                        )}
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '15px' }}>{store.user.email || 'user@example.com'}</p>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            {isEditing ? (
                                <>
                                    <button
                                        className="btn-formal"
                                        style={{ padding: '0.6rem 2rem', fontSize: '0.8rem', background: 'var(--accent)' }}
                                        onClick={handleSave}
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        className="btn-formal"
                                        style={{ padding: '0.6rem 2rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)' }}
                                        onClick={() => {
                                            setIsEditing(false);
                                            setTempName(store.user.name || '');
                                            setTempImage(store.user.profileImage || '/images/user_DP.jpg');
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        color: '#fff',
                                        border: '1px solid var(--border)',
                                        padding: '0.6rem 1.5rem',
                                        borderRadius: '99px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>


            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '40px' }}>
                {/* Language Section */}
                <div className="panel animate-in" style={{ borderTop: '4px solid var(--accent)', transition: 'all 0.3s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                        <div style={{ fontSize: '1.5rem', background: 'rgba(50, 222, 132, 0.1)', padding: '10px', borderRadius: '12px' }}>🌐</div>
                        <h3 style={{ margin: 0 }}>Language Selection</h3>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>Choose your preferred language for the interface.</p>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {['en', 'si'].map(l => (
                            <button
                                key={l}
                                onClick={() => handleUpdate('settings.language', l)}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '12px',
                                    border: `2px solid ${store.settings.language === l ? 'var(--accent)' : 'var(--border)'}`,
                                    background: store.settings.language === l ? 'rgba(50, 222, 132, 0.05)' : 'transparent',
                                    color: store.settings.language === l ? 'var(--accent)' : 'var(--text-main)',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {l === 'en' ? 'English' : 'සිංහල'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Theme Section */}
                <div className="panel animate-in" style={{ borderTop: '4px solid #6c5ce7', transition: 'all 0.3s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                        <div style={{ fontSize: '1.5rem', background: 'rgba(108, 92, 231, 0.1)', padding: '10px', borderRadius: '12px' }}>🎨</div>
                        <h3 style={{ margin: 0 }}>Visual Theme</h3>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>Pick a style that suits your environment.</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {['light', 'dark'].map(t => (
                            <button
                                key={t}
                                onClick={() => handleUpdate('settings.theme', t)}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '15px',
                                    borderRadius: '12px',
                                    border: `2px solid ${store.settings.theme === t ? '#6c5ce7' : 'var(--border)'}`,
                                    background: store.settings.theme === t ? 'rgba(108, 92, 231, 0.05)' : 'transparent',
                                    color: store.settings.theme === t ? '#6c5ce7' : 'var(--text-main)',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>{t === 'light' ? '☀️' : '🌙'}</span>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Accessibility Section */}
                <div className="panel animate-in" style={{ borderTop: '4px solid #fab1a0', transition: 'all 0.3s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                        <div style={{ fontSize: '1.5rem', background: 'rgba(250, 177, 160, 0.1)', padding: '10px', borderRadius: '12px' }}>✨</div>
                        <h3 style={{ margin: 0 }}>Accessibility</h3>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Font Scaling</span>
                            <span style={{ color: '#fab1a0', fontWeight: 'bold' }}>{(store.settings.fontScale || 1).toFixed(2)}x</span>
                        </div>
                        <input
                            type="range"
                            min="0.8"
                            max="1.5"
                            step="0.05"
                            value={store.settings.fontScale || 1}
                            onChange={(e) => handleUpdate('settings.fontScale', parseFloat(e.target.value))}
                            style={{ width: '100%', cursor: 'pointer', accentColor: '#fab1a0' }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '0.9rem' }}>High Contrast Mode</span>
                        <div
                            onClick={() => handleUpdate('settings.contrast', store.settings.contrast === 'high' ? 'normal' : 'high')}
                            style={{
                                width: '45px',
                                height: '24px',
                                background: store.settings.contrast === 'high' ? '#fab1a0' : 'rgba(255,255,255,0.1)',
                                borderRadius: '20px',
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                        >
                            <div style={{
                                width: '18px',
                                height: '18px',
                                background: '#fff',
                                borderRadius: '50%',
                                position: 'absolute',
                                top: '3px',
                                left: store.settings.contrast === 'high' ? '24px' : '3px',
                                transition: 'all 0.3s',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Settings;
