import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';

const Booking = ({ counselor, onBack }) => {
    const { api, store, navigate } = useStore();
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // 1-12
    const currentDay = today.getDate();

    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedDay, setSelectedDay] = useState(currentDay);
    const [timeValue, setTimeValue] = useState('10:00');
    const [timeError, setTimeError] = useState('');
    const [period, setPeriod] = useState('AM');
    const [loading, setLoading] = useState(false);

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Calculate days in the selected month & year
    const daysInMonth = useMemo(() => {
        return new Date(selectedYear, selectedMonth, 0).getDate();
    }, [selectedYear, selectedMonth]);

    // Format selected date string YYYY-MM-DD
    const date = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;

    const handleYearChange = (e) => {
        const y = Number(e.target.value);
        setSelectedYear(y);
        if (y === currentYear && selectedMonth < currentMonth) {
            setSelectedMonth(currentMonth);
            if (selectedDay < currentDay) setSelectedDay(currentDay);
        }
    };

    const handleMonthChange = (e) => {
        const m = Number(e.target.value);
        setSelectedMonth(m);
        if (selectedYear === currentYear && m === currentMonth && selectedDay < currentDay) {
            setSelectedDay(currentDay);
        }
    };

    const handleTimeInputChange = (e) => {
        let val = e.target.value.replace(/[^0-9:]/g, '');
        if (val.length === 2 && !val.includes(':') && e.nativeEvent?.inputType !== 'deleteContentBackward') {
            val = val + ':';
        }
        if (val.length > 5) val = val.slice(0, 5);
        setTimeValue(val);
        setTimeError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate time format (HH:MM)
        const timeRegex = /^(0?[1-9]|1[0-2]):([0-5][0-9])$/;
        if (!timeRegex.test(timeValue)) {
            setTimeError("Please enter a valid time (HH:MM, e.g. 02:30).");
            return;
        }

        const match = timeValue.match(timeRegex);
        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);

        // Convert to 24h for datetime comparison
        let h24 = hours;
        if (period === 'PM' && hours < 12) h24 += 12;
        if (period === 'AM' && hours === 12) h24 = 0;

        const selectedDateTime = new Date(selectedYear, selectedMonth - 1, selectedDay, h24, minutes, 0);
        const now = new Date();

        if (selectedDateTime < now) {
            setTimeError("Cannot book an appointment for a past time today. Please choose a future time.");
            return;
        }

        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;

        setLoading(true);
        const res = await api('/api/appointments', 'POST', {
            cid: counselor.id,
            date: date,
            time: formattedTime,
            email: store.user.email
        });
        if (res && res.ok) {
            alert(`Booking request confirmed for ${date} at ${formattedTime}!`);
            navigate('home');
        } else {
            alert(res?.error || "Failed to book appointment.");
        }
        setLoading(false);
    };

    return (
        <div className="panel animate-in">
            <button className="back-btn" onClick={onBack}>← Back to Counselors</button>
            <h3>Book Appointment with {counselor.name}</h3>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', margin: '20px 0' }}>
                <img
                    src={counselor.profileImage ? (counselor.profileImage.startsWith('/') ? counselor.profileImage : '/' + counselor.profileImage) : '/images/Counselor.jpg'}
                    alt={counselor.name}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                    <div style={{ fontWeight: 'bold' }}>{counselor.specialty || 'Mental Health Professional'}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.9em' }}>{counselor.education}</div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid two">
                    <label>Select Date (Month / Day / Year)
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.5fr', gap: '8px' }}>
                            {/* Month Selector */}
                            <select 
                                value={selectedMonth} 
                                onChange={handleMonthChange}
                                style={{ 
                                    padding: '12px 8px', 
                                    borderRadius: '10px', 
                                    background: 'var(--surface, #0d1117)', 
                                    border: '1px solid var(--border, rgba(255,255,255,0.1))', 
                                    color: 'var(--text-main, #fff)', 
                                    fontWeight: '600',
                                    cursor: 'pointer' 
                                }}
                            >
                                {monthNames.map((name, idx) => {
                                    const mNum = idx + 1;
                                    const isPast = selectedYear === currentYear && mNum < currentMonth;
                                    return (
                                        <option key={mNum} value={mNum} disabled={isPast}>
                                            {name} {isPast ? '(Past)' : ''}
                                        </option>
                                    );
                                })}
                            </select>

                            {/* Day Selector */}
                            <select 
                                value={selectedDay} 
                                onChange={e => setSelectedDay(Number(e.target.value))}
                                style={{ 
                                    padding: '12px 8px', 
                                    borderRadius: '10px', 
                                    background: 'var(--surface, #0d1117)', 
                                    border: '1px solid var(--border, rgba(255,255,255,0.1))', 
                                    color: 'var(--text-main, #fff)', 
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    textAlign: 'center'
                                }}
                            >
                                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                                    const isPast = selectedYear === currentYear && selectedMonth === currentMonth && d < currentDay;
                                    return (
                                        <option key={d} value={d} disabled={isPast}>
                                            {String(d).padStart(2, '0')} {isPast ? '(Past)' : ''}
                                        </option>
                                    );
                                })}
                            </select>

                            {/* Year Selector - ONLY 2026 onwards! */}
                            <select 
                                value={selectedYear} 
                                onChange={handleYearChange}
                                style={{ 
                                    padding: '12px 8px', 
                                    borderRadius: '10px', 
                                    background: 'var(--surface, #0d1117)', 
                                    border: '1px solid var(--border, rgba(255,255,255,0.1))', 
                                    color: 'var(--accent, #32de84)', 
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    textAlign: 'center'
                                }}
                            >
                                {[currentYear, currentYear + 1, currentYear + 2, currentYear + 3].map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                    </label>

                    <label>Select Time
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <input 
                                    type="text" 
                                    inputMode="numeric"
                                    placeholder="HH:MM (e.g. 02:30)" 
                                    value={timeValue} 
                                    onChange={handleTimeInputChange} 
                                    required 
                                    style={{ 
                                        width: '100%', 
                                        paddingLeft: '38px',
                                        boxSizing: 'border-box',
                                        borderColor: timeError ? 'var(--bad, #ff4d4d)' : 'var(--border)'
                                    }}
                                />
                                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6, fontSize: '1rem' }}>🕒</span>
                            </div>
                            <select 
                                value={period} 
                                onChange={e => setPeriod(e.target.value)}
                                style={{ 
                                    width: '85px', 
                                    padding: '12px 10px', 
                                    borderRadius: '10px', 
                                    background: 'var(--surface, #0d1117)', 
                                    border: '1px solid var(--border, rgba(255,255,255,0.1))', 
                                    color: 'var(--accent, #32de84)', 
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    textAlign: 'center'
                                }}
                            >
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </select>
                        </div>
                        {timeError && <span style={{ color: 'var(--bad, #ff4d4d)', fontSize: '0.8rem', marginTop: '4px' }}>⚠️ {timeError}</span>}
                    </label>
                </div>

                <button type="submit" className="btn-formal" style={{ width: '100%', marginTop: '24px', padding: '14px' }} disabled={loading}>
                    Confirm Appointment
                </button>
            </form>
        </div>
    );
};

export default Booking;
