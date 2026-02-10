import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

const RegisterCounselor = () => {
    const { api, navigate, store, setStore } = useStore();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        dob: '',
        civilStatus: 'unmarried',
        nic: '',
        education: '',
        experience: '',
        country: '',
        languages: '',
        available: true,
        profileImage: ''
    });
    const [loading, setLoading] = useState(false);

    const taskPassed = store.counselorVerified;
    const interviewPassed = store.counselorInterviewed;
    const isUnlocked = taskPassed;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        const data = new FormData();
        data.append('file', file);

        try {
            const res = await fetch('http://127.0.0.1:8000/api/upload', {
                method: 'POST',
                body: data
            });
            const json = await res.json();
            if (json.ok) {
                setFormData(prev => ({ ...prev, profileImage: json.path }));
            } else {
                alert("Upload failed: " + (json.error || "Unknown error"));
            }
        } catch (err) {
            console.error(err);
            alert("Upload error");
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isUnlocked) {
            alert("Please complete the Competency Task first to unlock registration.");
            return;
        }
        setLoading(true);
        const res = await api('/api/counselors', 'POST', formData);
        if (res && res.ok) {
            alert("Registration successful! You can now log in.");
            navigate('landing-login');
        } else {
            const msg = res?.error?.includes('TypeError: Failed to fetch')
                ? "Server is currently unavailable. Please try again later."
                : (res?.error || "Registration failed. Please try again.");
            alert(msg);
        }
        setLoading(false);
    };

    return (
        <section id="register-counselor" className="view active">
            <h2>Counselor Registration</h2>

            <div className="panel card-hire-counselor">
                <h3 style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '15px' }}>
                    Verification Progress
                </h3>
                <p style={{ color: 'var(--muted)' }}>To ensure the highest quality of care, all counselors must pass a clinical competency assessment and an interview before registering.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '25px' }}>
                    {/* Task Step */}
                    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: `1px solid ${taskPassed ? 'var(--good)' : 'var(--border)'}`, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: taskPassed ? 'var(--good)' : 'rgba(255,255,255,0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: taskPassed ? '#000' : 'var(--muted)',
                                fontWeight: 'bold',
                                fontSize: '0.9em'
                            }}>
                                {taskPassed ? '✓' : '1'}
                            </div>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '0.95em' }}>Competency Task</div>
                                <div style={{ fontSize: '0.8em', color: taskPassed ? 'var(--good)' : 'var(--accent)' }}>
                                    {taskPassed ? 'Completed' : '80% Marks Required to Pass'}
                                </div>
                            </div>
                        </div>
                        <button
                            className="btn-formal"
                            onClick={() => navigate('counselor-task')}
                            style={{
                                width: '100%',
                                background: taskPassed ? 'rgba(59, 211, 128, 0.1)' : 'var(--accent)',
                                borderColor: taskPassed ? 'var(--good)' : 'var(--accent)',
                                color: taskPassed ? 'var(--good)' : '#fff'
                            }}
                        >
                            {taskPassed ? 'Passed' : 'Start Task'}
                        </button>
                    </div>

                    {/* Interview Step */}
                    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: `1px solid ${interviewPassed ? 'var(--good)' : 'var(--border)'}`, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: interviewPassed ? 'var(--good)' : 'rgba(255,255,255,0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: interviewPassed ? '#000' : 'var(--muted)',
                                fontWeight: 'bold',
                                fontSize: '0.9em'
                            }}>
                                {interviewPassed ? '✓' : '2'}
                            </div>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '0.95em' }}>Official Interview</div>
                                <div style={{ fontSize: '0.8em', color: interviewPassed ? 'var(--good)' : 'rgba(255,255,255,0.4)' }}>
                                    {interviewPassed ? 'Verified' : 'Can be completed after registration'}
                                </div>
                            </div>
                        </div>
                        <button
                            className="btn-formal"
                            onClick={() => navigate('counselor-interview')}
                            disabled={!taskPassed && !store.counselorVerified}
                            style={{
                                width: '100%',
                                background: interviewPassed ? 'rgba(59, 211, 128, 0.1)' : 'rgba(255,255,255,0.05)',
                                borderColor: interviewPassed ? 'var(--good)' : 'var(--border)',
                                color: interviewPassed ? 'var(--good)' : '#fff',
                                opacity: taskPassed ? 1 : 0.5
                            }}
                        >
                            {interviewPassed ? 'Completed' : 'Book Session'}
                        </button>
                    </div>
                </div>

                {!isUnlocked && (
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <button
                            onClick={() => setStore(prev => ({ ...prev, counselorVerified: true, counselorInterviewed: true }))}
                            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: '10px' }}
                        >
                            DEBUG: Unlock Form
                        </button>
                    </div>
                )}
            </div>

            <div className="panel" style={{
                opacity: isUnlocked ? 1 : 0.3,
                pointerEvents: isUnlocked ? 'all' : 'none',
                filter: isUnlocked ? 'none' : 'grayscale(1)',
                transition: 'all 0.5s ease'
            }}>
                <h3 style={{ marginBottom: '20px' }}>Professional Details</h3>
                <form onSubmit={handleSubmit}>
                    <div className="grid two">
                        <label>Full Name<input name="name" value={formData.name} onChange={handleChange} required placeholder="Dr. Jane Smith" /></label>
                        <label>Professional Email<input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="jane.smith@menta.com" /></label>
                        <label>Set Password<input name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="Choose a secure password" /></label>
                        <label>Date of Birth<input name="dob" type="date" value={formData.dob} onChange={handleChange} required /></label>
                    </div>

                    <div className="grid two">
                        <label>Civil Status
                            <select name="civilStatus" value={formData.civilStatus} onChange={handleChange}>
                                <option value="unmarried">Unmarried</option>
                                <option value="married">Married</option>
                                <option value="divorced">Divorced</option>
                                <option value="widowed">Widowed</option>
                            </select>
                        </label>
                        <label>NIC Number / ID<input name="nic" value={formData.nic} onChange={handleChange} placeholder="Government ID number" /></label>
                    </div>

                    <label>Education & Qualifications<textarea name="education" value={formData.education} onChange={handleChange} rows="3" placeholder="List your degrees, certifications, and specializations..." required /></label>

                    <div className="grid two">
                        <label>Years of Experience<input name="experience" type="number" value={formData.experience} onChange={handleChange} /></label>
                        <label>Country<input name="country" value={formData.country} onChange={handleChange} placeholder="Country of practice" /></label>
                    </div>

                    <div className="grid two">
                        <label>Languages Spoken<input name="languages" value={formData.languages} onChange={handleChange} placeholder="e.g. English, Sinhala" /></label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label>Profile Image (Choose from Gallery)</label>
                            <input type="file" accept="image/*" onChange={handleFileChange} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', width: '100%' }} />
                            {formData.profileImage && (
                                <div style={{ marginTop: '10px' }}>
                                    <img
                                        src={formData.profileImage.startsWith('http') || formData.profileImage.startsWith('/') ? formData.profileImage : '/' + formData.profileImage}
                                        alt="Preview"
                                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px', border: '2px solid var(--accent)' }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <button type="submit" className="btn-formal" style={{ width: '100%', marginTop: '30px', padding: '15px' }} disabled={loading || !isUnlocked}>
                        {loading ? 'Processing Registration...' : 'Complete Registration'}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default RegisterCounselor;
