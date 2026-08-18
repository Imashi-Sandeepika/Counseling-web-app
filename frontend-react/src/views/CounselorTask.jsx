import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';

const MCQS = [
    { q: "A client tells you they are planning to hurt themselves tonight. What is the most important first step for a counselor?", a: ["Ask them about their childhood experiences.", "Assess the immediate risk and ensure a safety plan is in place.", "Tell them to try and think more positively.", "End the session early to give them space."], c: 1 },
    { q: "Which of these is an example of an 'Open-Ended' question used in counseling?", a: ["Did you have a good day yesterday?", "Are you feeling angry right now?", "Can you tell me more about how that situation made you feel?", "Do you want to stop the session now?"], c: 2 },
    { q: "What does 'Empathy' mean in a counseling context?", a: ["Feeling sorry for the client and their problems.", "Giving the client money or physical help.", "Understanding the client's experience from their point of view.", "Agreeing with everything the client says."], c: 2 },
    { q: "A counselor remains calm and non-judgmental even when a client admits to doing something wrong. This is known as:", a: ["Unconditional Positive Regard", "Cognitive Behavioral Therapy", "Transference", "Active Listening"], c: 0 },
    { q: "In counseling, what is 'Confidentiality'?", a: ["Sharing the client's stories with your friends.", "The rule that what is said in a session stays between the counselor and client (with some exceptions).", "Recording sessions and posting them online for education.", "Only telling the client's family about their problems."], c: 1 },
    { q: "If a counselor starts feeling angry at a client because the client reminds them of their own difficult father, this is called:", a: ["Empathy", "Counter-transference", "Congruence", "Professionalism"], c: 1 },
    { q: "What is the main goal of 'Active Listening'?", a: ["To wait for your turn to speak.", "To show the client you are truly hearing and understanding them.", "To solve the client's problems as quickly as possible.", "To memorize every word the client says."], c: 1 },
    { q: "When should a counselor break confidentiality?", a: ["Whenever the client says something interesting.", "When there is a serious risk of harm to the client or someone else.", "If the counselor's boss asks for the details for fun.", "If the client stops paying for the sessions."], c: 1 },
    { q: "What is a 'Boundary' in counseling?", a: ["A physical wall between the counselor and client.", "The limit of the professional relationship (e.g., no social media contact).", "The city limit where the counselor works.", "The number of words a client is allowed to speak."], c: 1 },
    { q: "Which approach focuses on changing negative thought patterns to improve behavior?", a: ["Psychoanalysis", "Cognitive Behavioral Therapy (CBT)", "Person-Centered Therapy", "Art Therapy"], c: 1 },
];

const TOTAL_TIME_SECONDS = 20 * 60; // 20 minutes (1200 seconds)

const CounselorTask = () => {
    const { navigate, setStore } = useStore();
    const [step, setStep] = useState('intro'); // intro, exam, results
    const [answers, setAnswers] = useState({});
    const [secondsLeft, setSecondsLeft] = useState(TOTAL_TIME_SECONDS);
    const [score, setScore] = useState(0);
    const answersRef = useRef({});

    answersRef.current = answers;

    useEffect(() => {
        let interval;
        if (step === 'exam') {
            setSecondsLeft(TOTAL_TIME_SECONDS);
            interval = setInterval(() => {
                setSecondsLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        handleAutoSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step]);

    const handleAutoSubmit = () => {
        alert("⏱️ Time limit reached (20 minutes). Your assessment is being submitted automatically.");
        submitExam(answersRef.current);
    };

    const handleOptionSelect = (qIdx, oIdx) => {
        setAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
    };

    const submitExam = (currentAnswers = answers) => {
        let correct = 0;
        MCQS.forEach((m, i) => {
            if (currentAnswers[i] === m.c) correct++;
        });
        const perc = Math.round((correct / MCQS.length) * 100);
        setScore(perc);
        if (perc >= 80) {
            setStore(prev => ({ ...prev, counselorVerified: true }));
        }
        setStep('results');
    };

    const elapsedSeconds = TOTAL_TIME_SECONDS - secondsLeft;
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    const elapsedRemainderSeconds = elapsedSeconds % 60;

    const remainingMinutes = Math.floor(secondsLeft / 60);
    const remainingSeconds = secondsLeft % 60;

    const isWarning = secondsLeft <= 300; // <= 5 min
    const isCritical = secondsLeft <= 60; // <= 1 min

    const answeredCount = Object.keys(answers).length;
    const progressPercent = Math.round((answeredCount / MCQS.length) * 100);

    return (
        <section className="view active">
            <div className="panel">
                <button className="back-btn" onClick={() => navigate('register-counselor')}>← Back to Registration</button>

                {step === 'intro' && (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <h2>Official Competency Assessment</h2>
                        <p style={{ maxWidth: '600px', margin: '10px auto', color: 'var(--text-muted)' }}>
                            Please complete this official examination to verify your counseling proficiency. You must score at least 80% within the 20-minute limit.
                        </p>
                        <div style={{ marginTop: '30px', padding: '30px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid var(--border)', maxWidth: '550px', margin: '30px auto' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '24px', textAlign: 'center' }}>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>⏱️ Time Limit</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent)' }}>20 Minutes</div>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>🎯 Passing Score</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--good)' }}>80% (8/10)</div>
                                </div>
                            </div>
                            <button className="btn-formal" style={{ padding: '14px 40px', fontSize: '1rem', width: '100%' }} onClick={() => setStep('exam')}>
                                Start Official Exam (20 min)
                            </button>
                        </div>
                    </div>
                )}

                {step === 'exam' && (
                    <div>
                        {/* Requirement Notice */}
                        <div style={{ background: 'rgba(50, 222, 132, 0.1)', border: '1px solid var(--accent)', padding: '12px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center', fontSize: '0.95em' }}>
                            <strong>Passing Requirement:</strong> You must earn at least <strong>80% marks</strong> within the <strong>20-minute limit</strong> to pass.
                        </div>

                        {/* Enhanced Timer & Progress Header */}
                        <div style={{
                            position: 'sticky',
                            top: '10px',
                            background: 'rgba(13, 17, 23, 0.95)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid var(--border)',
                            padding: '14px 18px',
                            borderRadius: '12px',
                            marginBottom: '25px',
                            zIndex: 100,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                {/* Left Side: Time Limit & Counter */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                                    <div style={{
                                        background: isCritical ? 'rgba(255, 77, 77, 0.15)' : isWarning ? 'rgba(255, 204, 0, 0.15)' : 'rgba(50, 222, 132, 0.15)',
                                        border: `1px solid ${isCritical ? 'var(--bad, #ff4d4d)' : isWarning ? 'var(--warning, #ffcc00)' : 'var(--accent, #32de84)'}`,
                                        color: isCritical ? 'var(--bad, #ff4d4d)' : isWarning ? 'var(--warning, #ffcc00)' : 'var(--accent, #32de84)',
                                        padding: '8px 14px',
                                        borderRadius: '8px',
                                        fontWeight: '700',
                                        fontSize: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                        <span>⏱️</span>
                                        <span>Time Left: {remainingMinutes}m {String(remainingSeconds).padStart(2, '0')}s</span>
                                    </div>
                                </div>

                                {/* Right Side: Progress Counter */}
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted, #8b949e)' }}>
                                    Progress: <strong style={{ color: 'var(--accent, #32de84)' }}>{answeredCount}</strong> / {MCQS.length} ({progressPercent}%)
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', marginTop: '12px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${progressPercent}%`,
                                    height: '100%',
                                    background: 'var(--accent, #32de84)',
                                    borderRadius: '99px',
                                    transition: 'width 0.3s ease'
                                }} />
                            </div>
                        </div>

                        <div id="question-container">
                            {MCQS.map((m, i) => (
                                <div key={i} className="panel" style={{ marginBottom: '20px', background: 'rgba(255,255,255,0.02)' }}>
                                    <div style={{ fontWeight: 'bold', marginBottom: '15px' }}>{i + 1}. {m.q}</div>
                                    <div className="grid two" style={{ gap: '10px' }}>
                                        {m.a.map((opt, oi) => (
                                            <label key={oi} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                padding: '12px',
                                                background: answers[i] === oi ? 'rgba(106, 165, 255, 0.1)' : 'rgba(255,255,255,0.03)',
                                                border: `1px solid ${answers[i] === oi ? 'var(--accent)' : 'var(--border)'}`,
                                                borderRadius: '8px',
                                                cursor: 'pointer'
                                            }}>
                                                <input
                                                    type="radio"
                                                    name={`q${i}`}
                                                    checked={answers[i] === oi}
                                                    onChange={() => handleOptionSelect(i, oi)}
                                                />
                                                <span>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            className="btn-formal"
                            style={{ width: '100%', marginTop: '20px', padding: '15px' }}
                            onClick={() => submitExam()}
                            disabled={Object.keys(answers).length < MCQS.length}
                        >
                            Finalize and Submit Assessment
                        </button>
                    </div>
                )}

                {step === 'results' && (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <h2 style={{ color: score >= 80 ? 'var(--good)' : 'var(--bad)' }}>
                            {score >= 80 ? "Congratulations!" : "Assessment Not Passed"}
                        </h2>
                        <div style={{ fontSize: '5em', fontWeight: 'bold', margin: '20px 0', color: score >= 80 ? 'var(--good)' : 'var(--bad)' }}>
                            {score}%
                        </div>
                        <p style={{ maxWidth: '500px', margin: '0 auto 30px', color: 'var(--muted)' }}>
                            {score >= 80
                                ? "Excellent work! You have demonstrated the clinical competency required for our platform. You can now proceed with your registration."
                                : "You didn't reach the required 80% passing score. Please review the material and try the assessment again."}
                        </p>
                        {score >= 80 ? (
                            <button className="btn-formal" style={{ padding: '12px 40px' }} onClick={() => navigate('register-counselor')}>Proceed to Registration</button>
                        ) : (
                            <button className="btn-formal" style={{ padding: '12px 40px' }} onClick={() => setStep('intro')}>Retry Assessment</button>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default CounselorTask;
