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
                                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="Enter new password" />
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
