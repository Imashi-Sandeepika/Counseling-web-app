import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const Notifications = () => {
    const { api, store } = useStore();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const email = store.user.email || store.counselor.email || store.admin.email;

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!email) {
                setLoading(false);
                return;
            }
            const res = await api(`/api/notifications?email=${email}`);
            if (Array.isArray(res)) {
                // Sort by timestamp descending
                const sorted = [...res].sort((a, b) => (b.ts || 0) - (a.ts || 0));
                setNotifications(sorted);
            }
            setLoading(false);
        };
        fetchNotifications();
    }, [email, api]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'success': return '✅';
            case 'bad': return '🚨';
            case 'warning': return '⚠️';
            case 'info': return 'ℹ️';
            default: return '📩';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'success': return '#228b22'; // Forest Green
            case 'bad': return '#d32f2f'; // Red
            case 'warning': return '#fbc02d'; // Yellow
            case 'info': return '#1976d2'; // Blue
            default: return 'var(--accent)';
        }
    };

    return (
        <section id="notifications" className="view active">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h2 style={{ margin: 0 }}>System Notifications</h2>
                    <p style={{ color: 'var(--muted)', fontSize: '0.9em', marginTop: '5px' }}>
                        Stay updated with your latest account activities and alerts.
                    </p>
                </div>
                {notifications.length > 0 && (
                    <span style={{
                        background: 'var(--accent)',
                        color: '#fff',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.85em',
                        fontWeight: 'bold'
                    }}>
                        {notifications.length} Total
                    </span>
                )}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <div className="loader" style={{ margin: '0 auto 15px' }}></div>
                    <p>Fetching your alerts...</p>
                </div>
            ) : (
                <div id="notification-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {notifications.length > 0 ? (
                        notifications.map((n, i) => (
                            <div
                                key={i}
                                className="panel notification-card"
                                style={{
                                    display: 'flex',
                                    gap: '20px',
                                    alignItems: 'flex-start',
                                    padding: '25px',
                                    margin: 0,
                                    border: '2px solid var(--border)',
                                    borderLeft: `8px solid ${getStatusColor(n.status)}`,
                                    background: 'var(--card)',
                                    boxShadow: '4px 4px 0px var(--border)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{
                                    fontSize: '1.5em',
                                    background: `${getStatusColor(n.status)}15`,
                                    width: '54px',
                                    height: '54px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    border: `1px solid ${getStatusColor(n.status)}30`
                                }}>
                                    {getStatusIcon(n.status)}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', alignItems: 'flex-start' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.1em', fontWeight: '800', letterSpacing: '-0.5px' }}>
                                            {n.title || 'Notification'}
                                        </h3>
                                        <span style={{ fontSize: '0.8em', color: 'var(--muted)', fontWeight: '600' }}>
                                            {n.ts ? new Date(n.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                                        </span>
                                    </div>

                                    {n.related_person && (
                                        <div style={{ fontSize: '0.85em', color: 'var(--accent)', fontWeight: '700', marginBottom: '8px' }}>
                                            Related: {n.related_person}
                                        </div>
                                    )}

                                    <div style={{ lineHeight: '1.6', color: 'var(--text)', fontSize: '1em', opacity: 0.9 }}>
                                        {n.msg}
                                    </div>

                                    <div style={{ fontSize: '0.75em', color: 'var(--muted)', marginTop: '15px', fontWeight: '500' }}>
                                        {n.ts ? new Date(n.ts).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="panel" style={{ textAlign: 'center', padding: '80px 20px', border: '2px dashed var(--border)', background: 'transparent' }}>
                            <div style={{ fontSize: '4em', marginBottom: '20px' }}>🎑</div>
                            <h3 style={{ fontSize: '1.5em' }}>All Clear!</h3>
                            <p style={{ color: 'var(--muted)', maxWidth: '300px', margin: '0 auto' }}>You are all caught up. New notifications for PsyCare will appear here.</p>
                        </div>
                    )}
                </div>
            )}

            <style>{`
                .notification-card:hover {
                    transform: translate(-2px, -2px);
                    box-shadow: 8px 8px 0px var(--border);
                    border-color: var(--text);
                }
                .loader {
                    border: 4px solid var(--card-alt);
                    border-top: 4px solid var(--accent);
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </section>
    );
};

export default Notifications;
