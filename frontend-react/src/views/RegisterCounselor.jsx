import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useStore } from '../context/StoreContext';

/* ───────── Image Crop Modal ───────── */
const CropModal = ({ imageSrc, onCrop, onCancel }) => {
    const canvasRef = useRef(null);
    const imgRef = useRef(new Image());
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const dragStart = useRef(null);
    const cropBox = useRef({ x: 50, y: 50, size: 200 });
    const scale = useRef(1);
    const imgNaturalSize = useRef({ w: 0, h: 0 });

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const img = imgRef.current;
        const cb = cropBox.current;
        const s = scale.current;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, img.naturalWidth * s, img.naturalHeight * s);

        // Dim overlay
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Clear the crop circle
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(cb.x + cb.size / 2, cb.y + cb.size / 2, cb.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Redraw image inside circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(cb.x + cb.size / 2, cb.y + cb.size / 2, cb.size / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, 0, 0, img.naturalWidth * s, img.naturalHeight * s);
        ctx.restore();

        // Border on crop circle
        ctx.strokeStyle = '#32de84';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(cb.x + cb.size / 2, cb.y + cb.size / 2, cb.size / 2, 0, Math.PI * 2);
        ctx.stroke();

        // Resize handle (bottom-right of bounding box)
        ctx.fillStyle = '#32de84';
        ctx.beginPath();
        ctx.arc(cb.x + cb.size, cb.y + cb.size, 8, 0, Math.PI * 2);
        ctx.fill();
    }, []);

    useEffect(() => {
        const img = imgRef.current;
        img.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const maxW = Math.min(600, window.innerWidth - 64);
            const maxH = 400;
            const s = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);
            scale.current = s;
            canvas.width = img.naturalWidth * s;
            canvas.height = img.naturalHeight * s;
            imgNaturalSize.current = { w: img.naturalWidth, h: img.naturalHeight };
            const initSize = Math.min(canvas.width, canvas.height) * 0.65;
            cropBox.current = {
                x: (canvas.width - initSize) / 2,
                y: (canvas.height - initSize) / 2,
                size: initSize
            };
            draw();
        };
        img.src = imageSrc;
    }, [imageSrc, draw]);

    const clampBox = (box, canvasW, canvasH) => {
        const s = Math.max(60, Math.min(box.size, Math.min(canvasW, canvasH)));
        const x = Math.max(0, Math.min(box.x, canvasW - s));
        const y = Math.max(0, Math.min(box.y, canvasH - s));
        return { x, y, size: s };
    };

    const onMouseDown = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const cb = cropBox.current;
        // Check resize handle
        const hx = cb.x + cb.size, hy = cb.y + cb.size;
        if (Math.hypot(mx - hx, my - hy) <= 12) {
            setIsResizing(true);
            dragStart.current = { mx, my, ...cb };
        } else if (mx >= cb.x && mx <= cb.x + cb.size && my >= cb.y && my <= cb.y + cb.size) {
            setIsDragging(true);
            dragStart.current = { mx, my, ...cb };
        }
    };

    const onMouseMove = (e) => {
        if (!isDragging && !isResizing) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const ds = dragStart.current;
        const canvas = canvasRef.current;
        if (isResizing) {
            const dx = mx - ds.mx;
            const dy = my - ds.my;
            const delta = (Math.abs(dx) > Math.abs(dy) ? dx : dy);
            cropBox.current = clampBox({ x: ds.x, y: ds.y, size: ds.size + delta }, canvas.width, canvas.height);
        } else {
            cropBox.current = clampBox({ x: ds.x + (mx - ds.mx), y: ds.y + (my - ds.my), size: ds.size }, canvas.width, canvas.height);
        }
        draw();
    };

    const stopDrag = () => { setIsDragging(false); setIsResizing(false); };

    const handleCrop = () => {
        const cb = cropBox.current;
        const s = scale.current;
        const img = imgRef.current;
        const out = document.createElement('canvas');
        out.width = 300;
        out.height = 300;
        const ctx = out.getContext('2d');
        ctx.beginPath();
        ctx.arc(150, 150, 150, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(
            img,
            cb.x / s, cb.y / s, cb.size / s, cb.size / s,
            0, 0, 300, 300
        );
        onCrop(out.toDataURL('image/png'));
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 9999, padding: '20px'
        }}>
            <div style={{
                background: 'var(--surface, #0d1117)', border: '1px solid var(--border, rgba(255,255,255,0.1))',
                borderRadius: '20px', padding: '28px', maxWidth: '680px', width: '100%',
                boxShadow: '0 30px 80px rgba(0,0,0,0.7)'
            }}>
                <h3 style={{ margin: '0 0 8px', color: 'var(--accent, #32de84)' }}>✂️ Crop Profile Picture</h3>
                <p style={{ color: 'var(--text-muted, #8b949e)', fontSize: '0.85rem', margin: '0 0 18px' }}>
                    Drag to move · Drag the <span style={{ color: '#32de84' }}>green handle</span> to resize
                </p>

                <div style={{ borderRadius: '14px', overflow: 'hidden', cursor: isDragging ? 'grabbing' : isResizing ? 'nw-resize' : 'grab', userSelect: 'none' }}>
                    <canvas
                        ref={canvasRef}
                        style={{ display: 'block', maxWidth: '100%' }}
                        onMouseDown={onMouseDown}
                        onMouseMove={onMouseMove}
                        onMouseUp={stopDrag}
                        onMouseLeave={stopDrag}
                    />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px', justifyContent: 'flex-end' }}>
                    <button onClick={onCancel} style={{
                        padding: '10px 24px', borderRadius: '10px', border: '1px solid var(--border, rgba(255,255,255,0.1))',
                        background: 'rgba(255,255,255,0.04)', color: '#fff', cursor: 'pointer', fontWeight: '600'
                    }}>Cancel</button>
                    <button onClick={handleCrop} className="btn-formal" style={{ padding: '10px 32px' }}>
                        ✅ Apply Crop
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ───────── Main Component ───────── */
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
    const [showPassword, setShowPassword] = useState(false);
    const [cropSrc, setCropSrc] = useState(null);       // raw image for crop modal
    const [croppedBlob, setCroppedBlob] = useState(null); // cropped dataURL preview
    const fileInputRef = useRef(null);

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

    // When user picks a file → open crop modal
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => setCropSrc(ev.target.result);
        reader.readAsDataURL(file);
    };

    // After crop → upload cropped blob to server
    const handleCropDone = async (dataUrl) => {
        setCropSrc(null);
        setCroppedBlob(dataUrl);

        // Convert dataUrl to Blob for upload
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], 'profile.png', { type: 'image/png' });

        setLoading(true);
        const data = new FormData();
        data.append('file', file);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/upload', { method: 'POST', body: data });
            const json = await response.json();
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
            {/* Crop Modal */}
            {cropSrc && (
                <CropModal
                    imageSrc={cropSrc}
                    onCrop={handleCropDone}
                    onCancel={() => { setCropSrc(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                />
            )}

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
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: taskPassed ? 'var(--good)' : 'rgba(255,255,255,0.05)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: taskPassed ? '#000' : 'var(--muted)', fontWeight: 'bold', fontSize: '0.9em'
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
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: interviewPassed ? 'var(--good)' : 'rgba(255,255,255,0.05)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: interviewPassed ? '#000' : 'var(--muted)', fontWeight: 'bold', fontSize: '0.9em'
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
                        <label>Set Password
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', marginTop: '6px' }}>
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Choose a secure password"
                                    style={{ width: '100%', paddingRight: '44px', boxSizing: 'border-box' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    title={showPassword ? "Hide password" : "Show password"}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    style={{
                                        position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                                        background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '6px', cursor: 'pointer', color: '#32de84',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px', zIndex: 20
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

                        {/* ── Profile Picture with Crop ── */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ marginBottom: '0' }}>Profile Picture</label>

                            {/* Preview area */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{
                                    width: '84px', height: '84px', borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.04)',
                                    border: croppedBlob || formData.profileImage ? '2.5px solid var(--accent, #32de84)' : '2px dashed rgba(255,255,255,0.15)',
                                    overflow: 'hidden', flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {croppedBlob || formData.profileImage ? (
                                        <img
                                            src={croppedBlob || (formData.profileImage.startsWith('http') || formData.profileImage.startsWith('/') ? formData.profileImage : '/' + formData.profileImage)}
                                            alt="Profile"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                        </svg>
                                    )}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        id="profile-pic-input"
                                        onChange={handleFileSelect}
                                        style={{ display: 'none' }}
                                    />
                                    <label
                                        htmlFor="profile-pic-input"
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                                            padding: '9px 16px', borderRadius: '10px',
                                            border: '1px solid var(--border, rgba(255,255,255,0.1))',
                                            background: 'rgba(255,255,255,0.04)', color: '#fff',
                                            cursor: 'pointer', fontWeight: '600', fontSize: '0.88rem',
                                            transition: 'all 0.2s ease',
                                            width: '100%', boxSizing: 'border-box', justifyContent: 'center'
                                        }}
                                    >
                                        📷 {croppedBlob || formData.profileImage ? 'Change Photo' : 'Choose Photo'}
                                    </label>
                                    {(croppedBlob || formData.profileImage) && (
                                        <div style={{ fontSize: '0.78rem', color: 'var(--accent, #32de84)', marginTop: '5px', textAlign: 'center' }}>
                                            ✅ Photo ready to submit
                                        </div>
                                    )}
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #8b949e)', marginTop: '4px', textAlign: 'center' }}>
                                        JPG, PNG or WEBP · You can crop after selecting
                                    </div>
                                </div>
                            </div>
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
