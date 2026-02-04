import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const Feedback = () => {
    const { api, navigate, store } = useStore();
    const [counselors, setCounselors] = useState([]);
    const [selectedCounselor, setSelectedCounselor] = useState('');
    const [feedbackText, setFeedbackText] = useState('');
    const [ratings, setRatings] = useState({ empathy: 80, clarity: 80, impact: 80 });
    const [sentiment, setSentiment] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCounselors = async () => {
            const res = await api('/api/counselors');
            if (Array.isArray(res)) setCounselors(res);
        };
        fetchCounselors();
    }, []);

    const handleRatingChange = (name, val) => {
        setRatings(prev => ({ ...prev, [name]: parseInt(val) }));
    };

    const analyzeSentiment = async () => {
        if (!feedbackText.trim()) return;
        setLoading(true);
        const res = await api('/api/sentiment-analyze', 'POST', { text: feedbackText });
        if (res && res.label) {
            setSentiment(res);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCounselor || !feedbackText) {
            alert("Please select a counselor and provide feedback.");
            return;
        }
        setLoading(true);
        const res = await api('/api/feedback', 'POST', {
            counselor_name: selectedCounselor,
            user_email: store.user.email,
            text: feedbackText,
            ...ratings
        });
        if (res && res.ok) {
            alert("Feedback submitted. Thank you!");
            navigate('counselors');
        }
        setLoading(false);
    };

    return (
        <section id="feedback" className="view active">
            <h2>Give Your Feedback</h2>
            <div className="panel">
                <button className="back-btn" onClick={() => navigate('counselors')}>← Back to Live</button>
                <p>We value your opinion. Please let us know how your session went.</p>

                <form onSubmit={handleSubmit}>
                    <label>
                        Select Counselor
                        <select value={selectedCounselor} onChange={(e) => setSelectedCounselor(e.target.value)} required>
                            <option value="">-- Choose a counselor --</option>
                            {counselors.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                        </select>
                    </label>

                    {selectedCounselor && (
                        <div id="feedback-details">
                            <label>
                                Your Feedback
                                <textarea
                                    value={feedbackText}
                                    onChange={(e) => setFeedbackText(e.target.value)}
                                    rows="6"
                                    placeholder="Share your experience..."
                                    required
                                />
                            </label>

                            <button type="button" onClick={analyzeSentiment} className="btn-formal" style={{ width: '100%', marginBottom: '20px' }} disabled={loading}>
                                {loading ? 'Analyzing...' : 'Analyze Sentiment'}
                            </button>

                            {sentiment && (
                                <div style={{
                                    margin: '20px 0',
                                    padding: '20px',
                                    borderRadius: '12px',
                                    textAlign: 'center',
                                    background: sentiment.label === 'Positive' ? 'rgba(59, 211, 128, 0.1)' : 'rgba(255, 95, 109, 0.1)',
                                    border: `1px solid ${sentiment.label === 'Positive' ? 'var(--good)' : 'var(--bad)'}`
                                }}>
                                    <h4 style={{ margin: 0 }}>Analysis Result: <strong>{sentiment.label}</strong></h4>
                                    <div style={{ fontSize: '3em', margin: '10px 0' }}>{sentiment.emoji}</div>
                                </div>
                            )}

                            <div className="grid three">
                                <label>
                                    Empathy: {ratings.empathy}%
                                    <input type="range" min="0" max="100" value={ratings.empathy} onChange={(e) => handleRatingChange('empathy', e.target.value)} />
                                </label>
                                <label>
                                    Clarity: {ratings.clarity}%
                                    <input type="range" min="0" max="100" value={ratings.clarity} onChange={(e) => handleRatingChange('clarity', e.target.value)} />
                                </label>
                                <label>
                                    Impact: {ratings.impact}%
                                    <input type="range" min="0" max="100" value={ratings.impact} onChange={(e) => handleRatingChange('impact', e.target.value)} />
                                </label>
                            </div>
                        </div>
                    )}

                    <button type="submit" className="btn-formal" style={{ width: '100%', marginTop: '20px' }} disabled={loading}>
                        Submit Feedback
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Feedback;
