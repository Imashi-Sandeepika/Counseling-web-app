import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import Settings from './Settings';

const Profile = () => {
    const { store, setStore, navigate } = useStore();
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ ...store.user });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();
        setStore(prev => ({
            ...prev,
            user: { ...prev.user, ...formData }
        }));
        setEditing(false);
        alert("Profile updated successfully (locally).");
    };

    return (
        <section id="profile" className="view active">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Your Profile</h2>
                {!editing && <button className="btn-formal" onClick={() => setEditing(true)}>Edit Profile</button>}
            </div>

            <div className="panel">
                <form onSubmit={handleSave}>
                    <div className="grid two">
                        <label>Full Name
                            <input name="name" value={formData.name || ''} onChange={handleChange} disabled={!editing} />
                        </label>
                        <label>Email Address
                            <input name="email" value={formData.email || ''} disabled={true} style={{ opacity: 0.6 }} />
                        </label>
                        <label>Date of Birth
                            <input name="dob" type="date" value={formData.dob || ''} onChange={handleChange} disabled={!editing} />
                        </label>
                        <label>NIC Number
                            <input name="nic" value={formData.nic || ''} onChange={handleChange} disabled={!editing} />
                        </label>
                    </div>

                    <div className="grid two">
                        <label>Contact Number
                            <input name="contact" value={formData.contact || ''} onChange={handleChange} disabled={!editing} />
                        </label>
                        <label>Education
                            <input name="education" value={formData.education || ''} onChange={handleChange} disabled={!editing} />
                        </label>
                    </div>

                    <div className="grid two">
                        <label>Occupation
                            <input name="job" value={formData.job || ''} onChange={handleChange} disabled={!editing} />
                        </label>
                        <label>About You
                            <textarea name="about" value={formData.about || ''} onChange={handleChange} rows="3" disabled={!editing} />
                        </label>
                    </div>

                    {editing && (
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button type="submit" className="btn-formal" style={{ flex: 1 }}>Save Changes</button>
                            <button type="button" className="btn-formal" style={{ flex: 1, background: 'var(--border)' }} onClick={() => { setEditing(false); setFormData({ ...store.user }); }}>Cancel</button>
                        </div>
                    )}
                </form>
            </div>

            <div className="panel" style={{ marginTop: '20px' }}>
                <h3>Account Statistics</h3>
                <div className="grid three" style={{ textAlign: 'center', marginTop: '15px' }}>
                    <div style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                        <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: 'var(--accent)' }}>0</div>
                        <div style={{ fontSize: '0.8em', color: 'var(--muted)' }}>Sessions</div>
                    </div>
                    <div style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                        <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: 'var(--good)' }}>0</div>
                        <div style={{ fontSize: '0.8em', color: 'var(--muted)' }}>Appointments</div>
                    </div>
                    <div style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                        <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#ffd66e' }}>0</div>
                        <div style={{ fontSize: '0.8em', color: 'var(--muted)' }}>Credits</div>
                    </div>
                </div>
            </div>

            <Settings />
        </section>
    );
};

export default Profile;
