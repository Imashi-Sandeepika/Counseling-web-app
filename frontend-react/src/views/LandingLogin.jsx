import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

const LandingLogin = () => {
    const { api, setStore, navigate } = useStore();
    const [activeTab, setActiveTab] = useState('login'); // login, register, forgot
    const [role, setRole] = useState('client'); // client, counselor, admin
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });
    const [loading, setLoading] = useState(false);

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
<<<<<<< HEAD
            const msg = res?.error?.includes('TypeError: Failed to fetch')
                ? "Server is currently unavailable. Please try again later."
                : "Invalid credentials. Please try again.";
            alert(msg);
=======
            alert("Invalid credentials. Please try again.");
>>>>>>> 05d6977ec0eb8bed1997790503561c7873059bbc
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
<<<<<<< HEAD
            let msg = "Registration failed.";
            if (res?.error === 'email_in_use') {
                msg = "This email is already in use. Please try logging in.";
            } else if (res?.error && res.error.includes('TypeError: Failed to fetch')) {
                msg = "Server is currently unavailable. Please try again later.";
            } else if (res?.error) {
                msg = `Error: ${res.error}`;
            }
            alert(msg);
=======
            alert("Registration failed. Email might be in use.");
>>>>>>> 05d6977ec0eb8bed1997790503561c7873059bbc
        }
        setLoading(false);
    };

    return (
        <section id="landing-login" className="view active animate-in" style={{ padding: '0', maxWidth: '100%', display: 'flex', flexDirection: 'column', minHeight: '80vh' }}>
            <div className="hero-section" style={{ textAlign: 'center', padding: '80px 20px', borderBottom: '1px solid var(--border)' }}>
                <h1 className="hero-text">Welcome to <span style={{ color: 'var(--accent)' }}>PsyCare</span></h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.25em', maxWidth: '700px', margin: '0 auto', fontWeight: '500' }}>Your dedicated space for mental well-being, professional guidance, and growth.</p>
            </div>

            <div className="login-columns grid grid-cols-3" style={{ padding: '60px 5%', gap: '30px', flex: 1 }}>
                {/* Client Column */}
                <div className={`panel login-card ${role === 'client' ? 'active-role' : ''}`} style={{ borderTop: '4px solid var(--accent)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <div style={{ fontSize: '3em', marginBottom: '15px' }}>🌿</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Client Portal</h3>
                        <p style={{ color: 'var(--text-muted)' }}>For those seeking support and guidance</p>
                    </div>

                    {role === 'client' ? (
                        <div className="form-container">
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                                <button className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>Login</button>
                                <button className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`} onClick={() => setActiveTab('register')}>Register</button>
                            </div>

                            {activeTab === 'login' ? (
                                <form onSubmit={handleLogin}>
                                    <label>Email<input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required /></label>
                                    <label>Password<input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required /></label>
                                    <button type="submit" className="btn-formal" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>Sign In</button>
                                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                        <button type="button" onClick={() => navigate('forgot-password')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.9em', fontWeight: '600' }}>Forgot Password?</button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleRegister}>
                                    <label>Full Name<input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required /></label>
                                    <label>Email<input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required /></label>
                                    <label>Password<input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required /></label>
                                    <button type="submit" className="btn-formal" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>Create Account</button>
                                </form>
                            )}
                        </div>
                    ) : (
                        <button className="btn-formal" style={{ marginTop: 'auto' }} onClick={() => { setRole('client'); setActiveTab('login'); }}>Enter as Client</button>
                    )}
                </div>

                {/* Counselor Column */}
                <div className={`panel login-card ${role === 'counselor' ? 'active-role' : ''}`} style={{ borderTop: '4px solid #40f09a', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <div style={{ fontSize: '3em', marginBottom: '15px' }}>🤝</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Counselor Portal</h3>
                        <p style={{ color: 'var(--text-muted)' }}>For verified mental health professionals</p>
                    </div>

                    {role === 'counselor' ? (
                        <form onSubmit={handleLogin}>
                            <label>Professional Email<input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="pro@psycare.com" required /></label>
                            <label>Password<input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required /></label>
                            <button type="submit" className="btn-formal" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>Counselor Log In</button>
                            <div style={{ textAlign: 'center', marginTop: '25px' }}>
                                <p style={{ fontSize: '0.9em', color: 'var(--text-muted)', marginBottom: '8px' }}>Not a counselor yet?</p>
                                <button type="button" onClick={() => navigate('register-counselor')} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '1rem' }}>Register Here</button>
                            </div>
                        </form>
                    ) : (
                        <button className="btn-formal" style={{ marginTop: 'auto' }} onClick={() => { setRole('counselor'); setActiveTab('login'); }}>Enter as Counselor</button>
                    )}
                </div>

                {/* Admin Column */}
                <div className={`panel login-card ${role === 'admin' ? 'active-role' : ''}`} style={{ borderTop: '4px solid var(--warning)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <div style={{ fontSize: '3em', marginBottom: '15px' }}>🛡️</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Admin Portal</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Platform management and security</p>
                    </div>

                    {role === 'admin' ? (
                        <form onSubmit={handleLogin}>
                            <label>Admin ID<input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="admin@psycare.com" required /></label>
                            <label>Security Key<input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required /></label>
                            <button type="submit" className="btn-formal" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>Admin Access</button>
                            <div style={{ textAlign: 'center', marginTop: '25px' }}>
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
                                    style={{ opacity: 0.3, fontSize: '10px' }}
                                >
                                    DEBUG: Test Mode Access
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button className="btn-formal" style={{ marginTop: 'auto' }} onClick={() => { setRole('admin'); setActiveTab('login'); }}>Enter as Admin</button>
                    )}
                </div>
            </div>

            <style>{`
        .login-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          opacity: 0.8;
        }
        .login-card.active-role {
          transform: translateY(-10px);
          opacity: 1;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          background: rgba(255,255,255,0.05);
        }
        .tab-btn {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          color: var(--muted);
          padding: 8px;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .tab-btn.active {
          background: var(--accent);
          color: white;
          border-color: var(--accent);
        }
      `}</style>
        </section>
    );
};

export default LandingLogin;
