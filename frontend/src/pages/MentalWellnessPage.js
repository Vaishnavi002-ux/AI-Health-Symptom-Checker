import React, { useState } from 'react';
import { FiStar, FiCheckCircle } from 'react-icons/fi';

const QUESTIONS = [
  { id: 'mood', q: 'How would you describe your overall mood today?', opts: ['Very Happy', 'Happy', 'Neutral', 'Sad', 'Very Sad'], scores: [5, 4, 3, 2, 1] },
  { id: 'stress', q: 'How stressed do you feel right now?', opts: ['Not at all', 'Slightly', 'Moderately', 'Very Stressed', 'Extremely'], scores: [5, 4, 3, 2, 1] },
  { id: 'sleep', q: 'How well did you sleep last night?', opts: ['Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'], scores: [5, 4, 3, 2, 1] },
  { id: 'anxiety', q: 'Have you been feeling anxious or worried?', opts: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], scores: [5, 4, 3, 2, 1] },
  { id: 'energy', q: 'What is your energy level today?', opts: ['Very High', 'High', 'Moderate', 'Low', 'Very Low'], scores: [5, 4, 3, 2, 1] },
  { id: 'focus', q: 'How is your ability to concentrate?', opts: ['Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'], scores: [5, 4, 3, 2, 1] },
];

const RESOURCES = [
  { title: 'Deep Breathing', desc: '4-7-8 breathing technique for instant calm', icon: '🧘', color: '#6366f1' },
  { title: 'Mindful Walk', desc: '10 minutes of focused walking outdoors', icon: '🚶', color: '#22c55e' },
  { title: 'Journaling', desc: 'Write your thoughts for 5 minutes', icon: '📓', color: '#ff832b' },
  { title: 'Progressive Muscle Relaxation', desc: 'Tense and release muscle groups', icon: '💪', color: '#0ea5e9' },
  { title: 'Gratitude Practice', desc: 'List 3 things you are grateful for', icon: '🙏', color: '#8a3ffc' },
  { title: 'Social Connection', desc: 'Call or text someone you trust', icon: '💬', color: '#07a2a4' },
];

function MentalWellnessPage() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const answer = (id, score) => setAnswers(a => ({ ...a, [id]: score }));
  const allAnswered = QUESTIONS.every(q => answers[q.id] !== undefined);

  const totalScore = allAnswered ? Object.values(answers).reduce((s, v) => s + v, 0) : 0;
  const maxScore = QUESTIONS.length * 5;
  const pct = (totalScore / maxScore) * 100;

  const getResult = () => {
    if (pct >= 80) return { label: 'Excellent Wellbeing', color: '#22c55e', msg: 'Your mental wellness scores are very positive. Keep up your current routines!' };
    if (pct >= 60) return { label: 'Good Wellbeing', color: '#0ea5e9', msg: 'You are doing well. Consider small habits to further boost your mood.' };
    if (pct >= 40) return { label: 'Moderate Wellbeing', color: '#ff832b', msg: 'You may benefit from self-care activities and speaking to someone you trust.' };
    return { label: 'Low Wellbeing', color: '#da1e28', msg: 'Please consider speaking to a mental health professional for support.' };
  };

  return (
    <div>
      <div className="page-header">
        <h1><FiStar style={{ color: '#6366f1' }} /> Mental Wellness Assessment</h1>
        <p>A quick self-check to understand your current mental wellness. This is educational only, not a clinical diagnosis.</p>
      </div>

      {!submitted ? (
        <div style={{ maxWidth: 700 }}>
          {QUESTIONS.map((q, qi) => (
            <div key={q.id} className="card" style={{ marginBottom: '1rem', borderLeft: `3px solid ${answers[q.id] ? '#6366f1' : 'var(--border)'}` }}>
              <div style={{ fontWeight: 700, fontSize: '.9rem', marginBottom: '.875rem' }}>
                <span style={{ color: '#6366f1', marginRight: '.5rem' }}>{qi + 1}.</span>{q.q}
              </div>
              <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                {q.opts.map((opt, oi) => (
                  <button
                    key={opt}
                    className={`btn btn-sm ${answers[q.id] === q.scores[oi] ? 'btn-primary' : 'btn-outline-gray'}`}
                    style={answers[q.id] === q.scores[oi] ? { background: '#6366f1', borderColor: '#6366f1' } : {}}
                    onClick={() => answer(q.id, q.scores[oi])}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button
            className="btn btn-gradient btn-lg"
            style={{ marginTop: '.5rem' }}
            disabled={!allAnswered}
            onClick={() => setSubmitted(true)}
          >
            <FiCheckCircle size={16} /> View My Assessment
          </button>
        </div>
      ) : (
        <div style={{ maxWidth: 700 }}>
          {/* Score */}
          <div className="card card-accent-purple" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginBottom: '.5rem', textTransform: 'uppercase', letterSpacing: '.06em' }}>Your Wellness Score</div>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: getResult().color, lineHeight: 1 }}>{totalScore}<span style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>/{maxScore}</span></div>
            <div style={{ fontWeight: 700, fontSize: '1.25rem', color: getResult().color, margin: '.5rem 0' }}>{getResult().label}</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '.875rem', maxWidth: 480, margin: '0 auto' }}>{getResult().msg}</p>
            <div className="progress-bar-wrap" style={{ marginTop: '1.25rem', height: 10 }}>
              <div className="progress-bar" style={{ width: `${pct}%`, background: getResult().color }} />
            </div>
          </div>

          {/* Resources */}
          <h3 className="section-title">Recommended Activities</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {RESOURCES.map(r => (
              <div key={r.title} className="card feature-card">
                <div style={{ fontSize: '2rem', marginBottom: '.625rem' }}>{r.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '.875rem', color: r.color }}>{r.title}</div>
                <div style={{ fontSize: '.78rem', color: 'var(--text-secondary)', marginTop: '.25rem' }}>{r.desc}</div>
              </div>
            ))}
          </div>

          <div className="disclaimer-box">
            <strong>⚕ Important:</strong> This assessment is for self-awareness and educational purposes only.
            It is NOT a clinical diagnosis. If you are struggling with mental health, please consult a licensed mental health professional or call a helpline.
          </div>

          <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => { setAnswers({}); setSubmitted(false); }}>
            Retake Assessment
          </button>
        </div>
      )}
    </div>
  );
}

export default MentalWellnessPage;
