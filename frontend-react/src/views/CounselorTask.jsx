import React, { useState, useEffect } from 'react';
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

const CounselorTask = () => {
    const { navigate, setStore } = useStore();
    const [step, setStep] = useState('intro'); // intro, exam, results
    const [answers, setAnswers] = useState({});
    const [startTime, setStartTime] = useState(0);
    const [elapsed, setElapsed] = useState(0);
    const [score, setScore] = useState(0);

    useEffect(() => {
        let interval;
        if (step === 'exam') {
            setStartTime(Date.now());
            interval = setInterval(() => {
                setElapsed(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, startTime]);

    const handleOptionSelect = (qIdx, oIdx) => {
        setAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
    };

    const submitExam = () => {
        let correct = 0;
        MCQS.forEach((m, i) => {
            if (answers[i] === m.c) correct++;
        });
        const perc = Math.round((correct / MCQS.length) * 100);
        setScore(perc);
        if (perc >= 80) {
            setStore(prev => ({ ...prev, counselorVerified: true }));
        }
        setStep('results');
    };

    return (
        <section className="view active">
            <div className="panel">
                <button className="back-btn" onClick={() => navigate('register-counselor')}>← Back to Registration</button>

                {step === 'intro' && (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <h2>Official Competency Assessment</h2>
                        <p>Please complete this official examination to verify your counseling proficiency. You need at least 80% to pass.</p>
                        <div style={{ marginTop: '30px', padding: '30px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '1.2em', marginBottom: '20px' }}>Assessment Status: <strong style={{ color: 'var(--accent)' }}>PENDING</strong></div>
                            <button className="btn-formal" style={{ padding: '12px 30px' }} onClick={() => setStep('exam')}>Start Official Exam</button>
                        </div>
                    </div>
                )}

                {step === 'exam' && (
                    <div>
                        <div style={{ background: 'rgba(50, 222, 132, 0.1)', border: '1px solid var(--accent)', padding: '12px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center', fontSize: '0.95em' }}>
                            <strong>Passing Requirement:</strong> You must earn at least <strong>80% marks</strong> to pass this examination and proceed with registration.
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', position: 'sticky', top: '0', background: 'var(--card)', padding: '10px', borderRadius: '8px', zIndex: 10 }}>
                            <div>Time: {Math.floor(elapsed / 60)}m {elapsed % 60}s</div>
                            <div>Progress: {Math.round((Object.keys(answers).length / MCQS.length) * 100)}%</div>
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
                            onClick={submitExam}
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
