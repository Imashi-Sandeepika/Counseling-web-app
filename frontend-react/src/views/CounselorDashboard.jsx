import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const CounselorDashboard = () => {
    const { api, store } = useStore();
    const [appointments, setAppointments] = useState([]);
    const [payments, setPayments] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const email = store.counselor.email;
            const [appts, pays, feeds] = await Promise.all([
                api(`/api/counselor/appointments?email=${email}`),
                api(`/api/counselor/payments?email=${email}`),
                api(`/api/counselor/feedback?email=${email}`)
            ]);

            if (Array.isArray(appts)) setAppointments(appts);
            if (Array.isArray(pays)) setPayments(pays);
            if (Array.isArray(feeds)) setFeedback(feeds);

            setLoading(false);
        };
        fetchData();
    }, [store.counselor.email]);

    const handleStatus = async (aid, status) => {
        const res = await api('/api/appointments/status', 'POST', { appointment_id: aid, status });
        if (res && res.ok) {
            alert(`Appointment ${status}.`);
            // Refresh list
        }
    };

    return (
        <section id="counselor-dashboard" className="view active">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>Counselor Portal</h1>
                <div style={{ padding: '8px 16px', background: 'var(--accent)', color: 'white', borderRadius: '8px', fontWeight: 'bold' }}>
                    LIVE
                </div>
            </div>

            <div className="grid three">
                <div className="panel" style={{ borderTop: '4px solid var(--accent)' }}>
                    <h3>Appointments</h3>
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '15px' }}>
                        {appointments.length > 0 ? appointments.map((a, i) => (
                            <li key={i} className="card-mini-chat" style={{ padding: '12px', marginBottom: '10px', borderRadius: '10px' }}>
                                <div style={{ fontWeight: 'bold' }}>{a.client_name || a.client_email}</div>
                                <div style={{ fontSize: '0.85em', color: 'var(--muted)' }}>{a.date} at {a.time}</div>
                                <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                                    <button onClick={() => handleStatus(a.id, 'accepted')} style={{ fontSize: '10px', background: 'var(--good)', border: 'none', color: '#000', padding: '4px 8px', borderRadius: '4px' }}>Accept</button>
                                    <button onClick={() => handleStatus(a.id, 'declined')} style={{ fontSize: '10px', background: 'var(--bad)', border: 'none', color: '#fff', padding: '4px 8px', borderRadius: '4px' }}>Decline</button>
                                </div>
                            </li>
                        )) : <p style={{ color: 'var(--muted)' }}>No appointments booked.</p>}
                    </ul>
                </div>

                <div className="panel" style={{ borderTop: '4px solid var(--good)' }}>
                    <h3>Payments</h3>
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '15px' }}>
                        {payments.length > 0 ? payments.map((p, i) => (
                            <li key={i} style={{ padding: '10px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                                <span>{p.client_name || 'Client'}</span>
                                <span style={{ color: 'var(--good)', fontWeight: 'bold' }}>USD {p.amount || '45.00'}</span>
                            </li>
                        )) : <p style={{ color: 'var(--muted)' }}>No recent payments.</p>}
                    </ul>
                </div>

                <div className="panel" style={{ borderTop: '4px solid #ffd66e' }}>
                    <h3>Client Feedback</h3>
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '15px' }}>
                        {feedback.length > 0 ? feedback.map((f, i) => (
                            <li key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', marginBottom: '10px' }}>
                                <div style={{ fontSize: '0.9em' }}>"{f.text}"</div>
                                <div style={{ fontSize: '0.75em', color: 'var(--accent)', marginTop: '5px' }}>Rating: {f.impact}% Impact</div>
                            </li>
                        )) : <p style={{ color: 'var(--muted)' }}>No feedback received.</p>}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default CounselorDashboard;
