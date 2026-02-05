import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const CounselorSchedule = () => {
    const { store, api } = useStore();
    const [schedule, setSchedule] = useState({});
    const [available, setAvailable] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        const fetchCounselorData = async () => {
            if (!store.counselor.id) return;
            const data = await api('/api/counselors');
            if (Array.isArray(data)) {
                const me = data.find(c => c.id === store.counselor.id);
                if (me) {
                    setAvailable(me.available);
                    try {
                        setSchedule(JSON.parse(me.schedule || '{}'));
                    } catch (e) {
                        setSchedule({});
                    }
                }
            }
            setLoading(false);
        };
        fetchCounselorData();
    }, [store.counselor.id, api]);

    const toggleDay = (day) => {
        setSchedule(prev => ({
            ...prev,
            [day]: prev[day] ? null : { start: '09:00', end: '17:00' }
        }));
    };

    const updateTime = (day, field, value) => {
        setSchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], [field]: value }
        }));
    };

    const saveSettings = async () => {
        setSaving(true);
        const result = await api(`/api/counselors/${store.counselor.id}`, 'PUT', {
            available,
            schedule: JSON.stringify(schedule)
        });
        setSaving(false);
        if (result.ok) {
            alert("Schedule saved successfully!");
        }
    };

    if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading schedule...</div>;

    return (
        <section id="counselor-schedule" className="view active animate-in">
            <div className="hero" style={{ marginBottom: '40px' }}>
                <h1 className="hero-text" style={{ fontSize: '3rem' }}>🗓️ My Schedule</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    Set your availability and working hours for clients
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px', alignItems: 'start' }}>
                <div className="panel" style={{ padding: '30px' }}>
                    <h3 style={{ marginBottom: '25px', fontSize: '1.5rem' }}>Weekly Availability</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {DAYS.map(day => (
                            <div key={day} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '15px 20px',
                                background: schedule[day] ? 'var(--accent)05' : 'var(--surface-hover)',
                                borderRadius: '12px',
                                border: schedule[day] ? '1px solid var(--accent)30' : '1px solid transparent'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <input
                                        type="checkbox"
                                        checked={!!schedule[day]}
                                        onChange={() => toggleDay(day)}
                                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                    />
                                    <span style={{ fontWeight: 'bold', width: '100px' }}>{day}</span>
                                </div>

                                {schedule[day] ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <input
                                            type="time"
                                            value={schedule[day].start}
                                            onChange={(e) => updateTime(day, 'start', e.target.value)}
                                            style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--surface)', background: 'var(--surface)' }}
                                        />
                                        <span>to</span>
                                        <input
                                            type="time"
                                            value={schedule[day].end}
                                            onChange={(e) => updateTime(day, 'end', e.target.value)}
                                            style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--surface)', background: 'var(--surface)' }}
                                        />
                                    </div>
                                ) : (
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Unavailable</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="panel" style={{ padding: '30px', position: 'sticky', top: '20px' }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Status Control</h3>

                    <div style={{ marginBottom: '30px', padding: '20px', background: available ? 'var(--good)10' : 'var(--bad)10', borderRadius: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                            Currently Accepting Bookings
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: available ? 'var(--good)' : 'var(--bad)', marginBottom: '15px' }}>
                            {available ? 'ACTIVE' : 'INACTIVE'}
                        </div>
                        <button
                            className="btn-formal"
                            style={{ background: available ? 'var(--bad)' : 'var(--good)', width: '100%' }}
                            onClick={() => setAvailable(!available)}
                        >
                            {available ? 'Go Offline' : 'Go Online'}
                        </button>
                    </div>

                    <button
                        className="btn-formal"
                        style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }}
                        onClick={saveSettings}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : '💾 Save All Changes'}
                    </button>

                    <p style={{ marginTop: '20px', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                        Clients will only be able to book you during the hours set on the left when you are ACTIVE.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default CounselorSchedule;
