import React from 'react';
import { useStore } from '../context/StoreContext';

const CounselorSchedule = () => {
    const { store } = useStore();

    return (
        <section id="counselor-schedule" className="view active animate-in">
            <div className="hero" style={{ marginBottom: '40px' }}>
                <h1 className="hero-text" style={{ fontSize: '3rem' }}>🗓️ My Schedule</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    Manage your availability and working hours
                </p>
            </div>

            <div className="panel" style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚧</div>
                <h3 style={{ marginBottom: '15px', fontSize: '1.5rem' }}>Schedule Management</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                    This feature will allow you to set your available time slots, manage recurring schedules, and block specific dates.
                </p>
            </div>
        </section>
    );
};

export default CounselorSchedule;
