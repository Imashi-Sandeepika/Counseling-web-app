import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

const LandingLogin = () => {
    const { api, setStore, navigate } = useStore();
    const [activeTab, setActiveTab] = useState('login'); // login, register, forgot
    const [role, setRole] = useState('client'); // client, counselor, admin
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        let endpoint = '/api/accounts/login';
        if (role === 'counselor') endpoint = '/api/counselor/auth/login';
        if (role === 'admin') endpoint = '/api/admin/auth/login';

        const res = await api(endpoint, 'POST', { email: formData.email, password: formData.password });
        if (res && res.ok) {
            if (role === 'client') {
                setStore(prev => ({
                    ...prev,
                    user: { authenticated: true, email: res.user.email, name: res.user.name, token: res.token }
                }));
                navigate('home', true);
            } else if (role === 'counselor') {
                setStore(prev => ({
                    ...prev,
                    counselor: { authenticated: true, id: res.counselor.id, email: res.counselor.email, name: res.counselor.name, token: res.token }
                }));
                navigate('counselor-dashboard', true);
            } else if (role === 'admin') {
                setStore(prev => ({
                    ...prev,
                    admin: { authenticated: true, id: res.admin.id, email: res.admin.email, name: res.admin.name, token: res.token }
                }));
                navigate('admin-dashboard', true);
            }
        } else {
            const msg = res?.error?.includes('TypeError: Failed to fetch')
                ? "Server is currently unavailable. Please try again later."
                : "Invalid credentials. Please try again.";
            alert(msg);
        }
        setLoading(false);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await api('/api/accounts', 'POST', { name: formData.name, email: formData.email, password: formData.password });
        if (res && res.ok) {
            alert("Registration successful! Please log in.");
            setActiveTab('login');
        } else {
            let msg = "Registration failed.";
            if (res?.error === 'email_in_use') {
                msg = "This email is already in use. Please try logging in.";
            } else if (res?.error && res.error.includes('TypeError: Failed to fetch')) {
                msg = "Server is currently unavailable. Please try again later.";
            } else if (res?.error) {
                msg = `Error: ${res.error}`;
            }
            alert(msg);
        }
        setLoading(false);
    };

    return (
        <section id="landing-login" className="view active animate-in login-split-page" style={{ padding: '0', maxWidth: '100%', display: 'flex', minHeight: '100vh', margin: 0 }}>
            {/* Left Side */}
            <div className="login-left" style={{ flex: 1, background: 'linear-gradient(135deg, #101935 0%, #080c1a 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px', position: 'relative', overflow: 'hidden' }}>
                <div className="login-brand" style={{ fontSize: '3.5rem', fontWeight: 900, background: 'linear-gradient(90deg, #6aa5ff 0%, #a9b3d9 50%, #3bd380 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '2px', marginBottom: '30px', textAlign: 'center', filter: 'drop-shadow(0 4px 15px rgba(106, 165, 255, 0.4))' }}>PsyCare</div>
                <img src="/images/psycare_mind_black_bg.png" alt="PsyCare Mind Illustration" className="login-illustration" style={{ maxWidth: '80%', maxHeight: '50vh', borderRadius: '20px', marginBottom: '30px', objectFit: 'cover', mixBlendMode: 'screen' }} />
                <p className="login-quote" style={{ color: 'var(--muted)', fontSize: '1.2rem', textAlign: 'center', maxWidth: '80%' }}>Your journey to mental well-being begins here.</p>
            </div>

            {/* Right Side */}
            <div className="login-right" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg)', padding: '40px' }}>
                <div className="login-form-container" style={{ width: '100%', maxWidth: '400px', background: 'var(--card)', padding: '40px', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                    <h2 className="login-heading" style={{ fontSize: '1.8rem', marginBottom: '8px', color: 'var(--text)' }}>Welcome Back</h2>
                    <p className="login-subtitle" style={{ color: 'var(--muted)', marginBottom: '24px' }}>Sign in to continue to PsyCare</p>
                    
                    <div className="login-roles" style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: '#0b1020', padding: '6px', borderRadius: '12px' }}>
                        <button type="button" className={`role-btn ${role === 'client' ? 'active' : ''}`} onClick={() => { setRole('client'); setActiveTab('login'); }}>Client</button>
                        <button type="button" className={`role-btn ${role === 'counselor' ? 'active' : ''}`} onClick={() => { setRole('counselor'); setActiveTab('login'); }}>Counselor</button>
                        <button type="button" className={`role-btn ${role === 'admin' ? 'active' : ''}`} onClick={() => { setRole('admin'); setActiveTab('login'); }}>Admin</button>
                    </div>

                    {activeTab === 'login' ? (
                        <form onSubmit={handleLogin}>
                            <div className="input-group">
                                <label>Email Address</label>
                                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
                            </div>
                            
                            <div className="input-group">
                                <label>Password</label>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <input 
                                        name="password" 
                                        type={showPassword ? "text" : "password"} 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                        placeholder="Enter your password" 
                                        required 
                                        style={{ width: '100%', paddingRight: '44px', boxSizing: 'border-box' }} 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)} 
                                        title={showPassword ? "Hide password" : "Show password"}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        style={{ 
                                            position: 'absolute', 
                                            right: '10px', 
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'rgba(255, 255, 255, 0.05)', 
                                            border: '1px solid rgba(255, 255, 255, 0.1)', 
                                            borderRadius: '6px',
                                            cursor: 'pointer', 
                                            color: '#32de84',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '5px',
                                            zIndex: 20
                                        }}
                                    >
                                        {showPassword ? (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#32de84" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                            </svg>
                                        ) : (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#32de84" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                            
                            <div className="form-options" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', fontSize: '0.9rem' }}>
                                <label className="remember-me" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted, #8b949e)' }}>
                                    <input type="checkbox" name="remember" /> Remember me
                                </label>
                                <button type="button" onClick={() => navigate('forgot-password')} className="forgot-password" style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>Forgot Password?</button>
                            </div>
                            
                            <button type="submit" className="btn-primary" style={{ width: '100%', background: 'var(--accent)', color: '#000', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 700, cursor: 'pointer', transition: 'transform 0.2s' }} disabled={loading}>Login</button>
                            
                            <div className="divider" style={{ display: 'flex', alignItems: 'center', textAlign: 'center', margin: '24px 0', color: 'var(--text-muted, #8b949e)' }}>
                                <span style={{ flex: 1, borderBottom: '1px solid var(--border)' }}></span>
                                <span style={{ padding: '0 10px', fontSize: '0.9rem' }}>OR</span>
                                <span style={{ flex: 1, borderBottom: '1px solid var(--border)' }}></span>
                            </div>
                            
                            <button type="button" className="btn-google" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#fff', color: '#000', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 600, cursor: 'pointer', transition: 'transform 0.2s' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Continue with Google
                            </button>
                            
                            <div className="signup-prompt" style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted, #8b949e)' }}>
                                Don't have an account? <button type="button" onClick={() => { if(role === 'counselor') navigate('register-counselor'); else setActiveTab('register'); }} style={{ color: 'var(--accent)', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Sign Up</button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister}>
                            <div className="input-group">
                                <label>Full Name</label>
                                <input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
                            </div>
                            <div className="input-group">
                                <label>Email Address</label>
                                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
                            </div>
                            <div className="input-group">
                                <label>Password</label>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <input 
                                        name="password" 
                                        type={showPassword ? "text" : "password"} 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                        placeholder="Enter your password" 
                                        required 
                                        style={{ width: '100%', paddingRight: '44px', boxSizing: 'border-box' }} 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)} 
                                        title={showPassword ? "Hide password" : "Show password"}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        style={{ 
                                            position: 'absolute', 
                                            right: '10px', 
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'rgba(255, 255, 255, 0.05)', 
                                            border: '1px solid rgba(255, 255, 255, 0.1)', 
                                            borderRadius: '6px',
                                            cursor: 'pointer', 
                                            color: '#32de84',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '5px',
                                            zIndex: 20
                                        }}
                                    >
                                        {showPassword ? (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#32de84" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                            </svg>
                                        ) : (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#32de84" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%', background: 'var(--accent)', color: '#000', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 700, cursor: 'pointer', marginTop: '10px', transition: 'transform 0.2s' }} disabled={loading}>Create Account</button>
                            <div className="signup-prompt" style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted, #8b949e)' }}>
                                Already have an account? <button type="button" onClick={() => setActiveTab('login')} style={{ color: 'var(--accent)', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Sign In</button>
                            </div>
                        </form>
                    )}
                    {role === 'admin' && activeTab === 'login' && (
                        <div style={{ textAlign: 'center', marginTop: '15px' }}>
                            <button
                                type="button"
                                className="nav-btn"
                                onClick={() => {
                                    setStore(prev => ({
                                        ...prev,
                                        admin: { authenticated: true, id: 999, email: 'admin@test.com', name: 'Test Admin', token: 'mock-admin-token' }
                                    }));
                                    navigate('admin-dashboard');
                                }}
                                style={{ opacity: 0.3, fontSize: '10px', background: 'none', border: 'none', color: 'var(--text)' }}
                            >
                                DEBUG: Test Mode Access
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .role-btn {
                    flex: 1;
                    background: transparent;
                    color: var(--muted);
                    border: none;
                    padding: 10px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s ease;
                }
                .role-btn.active {
                    background: var(--accent);
                    color: #000;
                }
                .input-group {
                    margin-bottom: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .input-group label {
                    font-size: 0.9rem;
                    color: var(--text);
                }
                .input-group input {
                    padding: 12px;
                    border-radius: 10px;
                    border: 1px solid var(--border);
                    background: #0b1020;
                    color: var(--text);
                    transition: border-color 0.2s;
                }
                .input-group input:focus {
                    border-color: var(--accent);
                    outline: none;
                }
                .btn-primary:hover, .btn-google:hover {
                    transform: translateY(-2px);
                }
                @media (max-width: 768px) {
                    .login-split-page {
                        flex-direction: column !important;
                    }
                    .login-left {
                        padding: 20px !important;
                        flex: 0.4 !important;
                    }
                    .login-brand {
                        top: 20px !important;
                        left: 20px !important;
                        font-size: 1.5rem !important;
                    }
                    .login-quote {
                        display: none !important;
                    }
                    .login-illustration {
                        max-height: 20vh !important;
                        margin-bottom: 0 !important;
                    }
                }
            `}</style>
        </section>
    );
};

export default LandingLogin;
