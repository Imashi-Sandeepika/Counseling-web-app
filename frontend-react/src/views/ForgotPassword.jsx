import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

const ForgotPassword = () => {
    const { api, navigate } = useStore();
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('client');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // 1: request code, 2: reset password
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleRequestCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await api('/api/accounts/forgot-password', 'POST', { email, role });
        if (res && res.ok) {
            alert("Reset code sent! (Mock: Code is 12345678)");
            setStep(2);
        } else {
            alert("Error sending code. Check email/role.");
        }
        setLoading(false);
    };

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await api('/api/accounts/reset-password', 'POST', { email, role, code, newPassword });
        if (res && res.ok) {
            alert("Password updated successfully!");
            navigate('landing-login');
        } else {
            alert("Invalid code or reset failed.");
        }
        setLoading(false);
    };

    return (
        <section id="forgot-password" className="view active">
            <div className="panel" style={{ maxWidth: '480px', margin: '0 auto' }}>
                <button className="back-btn" onClick={() => navigate('landing-login')}>← Back to Login</button>

                {step === 1 ? (
                    <div>
                        <h2>Forgot Password</h2>
                        <p style={{ color: 'var(--muted)', marginBottom: '20px' }}>Enter your email address and select your role to receive a reset code.</p>
                        <form onSubmit={handleRequestCode}>
                            <label>Role
                                <select value={role} onChange={(e) => setRole(e.target.value)}>
                                    <option value="client">Client</option>
                                    <option value="counselor">Counselor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </label>
                            <label>Email Address
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com" />
                            </label>
                            <button type="submit" className="btn-formal" style={{ width: '100%', marginTop: '20px' }} disabled={loading}>
                                {loading ? 'Sending...' : 'Send Reset Code'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div>
                        <h2>Reset Password</h2>
                        <form onSubmit={handleReset}>
                            <label>Reset Code
                                <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required maxLength="8" placeholder="Enter 8-digit code" />
                            </label>
                            <label>New Password
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        value={newPassword} 
                                        onChange={(e) => setNewPassword(e.target.value)} 
                                        required 
                                        placeholder="Enter new password" 
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
                            </label>
                            <button type="submit" className="btn-formal" style={{ width: '100%', marginTop: '20px' }} disabled={loading}>
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                            <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--muted)', marginTop: '10px', width: '100%', cursor: 'pointer' }}>
                                Resend Code
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ForgotPassword;
