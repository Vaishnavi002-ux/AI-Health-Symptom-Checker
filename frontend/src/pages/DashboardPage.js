import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiActivity, FiCheckCircle, FiAlertTriangle, FiTrendingUp,
  FiClock, FiHeart, FiZap, FiStar, FiDroplet, FiMoon,
  FiBook, FiPackage, FiFileText, FiUsers, FiCalendar
} from 'react-icons/fi';
import { getDashboardStats } from '../services/api';

const QUICK_ACTIONS = [
  { to: '/checker',      icon: '🩺', label: 'Check Symptoms',   desc: 'AI analysis',         color: '#0f62fe' },
  { to: '/diseases',     icon: '📚', label: 'Disease Library',  desc: 'Learn conditions',    color: '#07a2a4' },
  { to: '/medicines',    icon: '💊', label: 'Medicine Guide',   desc: 'Drug information',    color: '#8a3ffc' },
  { to: '/bmi',          icon: '⚖️', label: 'BMI Calculator',  desc: 'Check your weight',   color: '#22c55e' },
  { to: '/water',        icon: '💧', label: 'Water Tracker',    desc: 'Daily hydration',     color: '#0ea5e9' },
  { to: '/sleep',        icon: '😴', label: 'Sleep Tracker',    desc: 'Track sleep quality', color: '#6366f1' },
  { to: '/health-tips',  icon: '🌿', label: 'Health Tips',      desc: 'Wellness advice',     color: '#16a34a' },
  { to: '/reports',      icon: '📄', label: 'Health Reports',   desc: 'Download reports',    color: '#ff832b' },
  { to: '/emergency',    icon: '🚨', label: 'Emergency Help',   desc: 'Critical contacts',   color: '#da1e28' },
];

const DAILY_TIPS = [
  '💧 Drink at least 8 glasses of water today to stay hydrated.',
  '🚶 Take a 30-minute walk to boost cardiovascular health.',
  '🧘 Practice 10 minutes of deep breathing to reduce stress.',
  '🥗 Include at least 5 servings of fruits and vegetables today.',
  '😴 Aim for 7-9 hours of quality sleep every night.',
  '🌞 Get 15-20 minutes of sunlight for natural Vitamin D.',
  '🧠 Engage in mentally stimulating activities to keep your mind sharp.',
];

function HealthScoreRing({ score = 78 }) {
  const pct = Math.min(Math.max(score, 0), 100);
  const color = pct >= 80 ? '#22c55e' : pct >= 60 ? '#ff832b' : '#da1e28';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        width: 110, height: 110, borderRadius: '50%',
        background: `conic-gradient(${color} 0% ${pct}%, var(--border) ${pct}% 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 20px ${color}40`,
      }}>
        <div style={{
          width: 82, height: 82, borderRadius: '50%', background: 'var(--surface)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: '.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>/100</span>
        </div>
      </div>
      <div style={{ marginTop: '.5rem', fontSize: '.75rem', fontWeight: 700, color }}>
        {pct >= 80 ? 'Excellent' : pct >= 60 ? 'Good' : 'Needs Attention'}
      </div>
    </div>
  );
}

function MiniBar({ label, value, max, color }) {
  return (
    <div style={{ marginBottom: '.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.3rem', fontSize: '.8rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontWeight: 700, color: 'var(--text)' }}>{value}/{max}</span>
      </div>
      <div className="progress-bar-wrap">
        <div className={`progress-bar ${color}`} style={{ width: `${(value / max) * 100}%` }} />
      </div>
    </div>
  );
}

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendOk, setBackendOk] = useState(null);
  const tip = DAILY_TIPS[new Date().getDay() % DAILY_TIPS.length];

  useEffect(() => {
    getDashboardStats()
      .then(data => { setStats(data); setBackendOk(true); })
      .catch(() => setBackendOk(false))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { color: 'blue',   icon: <FiActivity size={20}/>,      value: stats?.total_sessions ?? 0,      label: 'Total Sessions'      },
    { color: 'green',  icon: <FiCheckCircle size={20}/>,   value: stats?.completed_analyses ?? 0,   label: 'Completed Analyses'  },
    { color: 'orange', icon: <FiTrendingUp size={20}/>,    value: stats?.urgency_distribution?.MEDIUM ?? 0, label: 'Medium Urgency' },
    { color: 'red',    icon: <FiAlertTriangle size={20}/>, value: stats?.emergency_alerts ?? 0,     label: 'Emergency Alerts'    },
  ];

  return (
    <div>
      {/* Hero Card */}
      <div className="hero-card">
        <div className="hero-card-inner">
          <div className="hero-overline">Welcome Back</div>
          <div className="hero-title">Your AI Health Dashboard</div>
          <div className="hero-subtitle">
            Powered by IBM watsonx.ai Granite — your intelligent health companion
            for symptom analysis, wellness tracking, and health education.
          </div>
          <div className="hero-actions">
            <Link to="/checker" className="hero-btn">
              <FiActivity size={16} /> Check Symptoms
            </Link>
            <Link to="/analytics" className="hero-btn-outline">
              <FiTrendingUp size={16} /> View Analytics
            </Link>
          </div>
          <div className="hero-stats">
            <div>
              <div className="hero-stat-value">{stats?.total_sessions ?? '—'}</div>
              <div className="hero-stat-label">Consultations</div>
            </div>
            <div>
              <div className="hero-stat-value">{stats?.completed_analyses ?? '—'}</div>
              <div className="hero-stat-label">Analyses Done</div>
            </div>
            <div>
              <div className="hero-stat-value">IBM</div>
              <div className="hero-stat-label">Granite AI</div>
            </div>
          </div>
        </div>
      </div>

      {/* Status alerts */}
      {backendOk === false && (
        <div className="alert alert-danger">
          <strong>⚠ Backend Offline:</strong> Run <code>python app.py</code> in the <code>backend/</code> folder.
        </div>
      )}
      {backendOk === true && (
        <div className="alert alert-success">
          ✅ IBM Granite AI is online and ready — backend connected successfully.
        </div>
      )}

      {/* KPI Stats */}
      <div className="stat-grid">
        {(loading ? [1,2,3,4] : statCards).map((s, i) => (
          loading ? (
            <div key={i} className="stat-card blue" style={{ opacity: .35 }}>
              <div className="skeleton" style={{ height: 80, borderRadius: 8 }} />
            </div>
          ) : (
            <div key={s.label} className={`stat-card ${s.color}`}>
              <div className="stat-icon-wrap">{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          )
        ))}
      </div>

      {/* Health Score + Daily Tip + Mini Trackers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: '1.25rem', marginBottom: '2rem', alignItems: 'start' }}>
        {/* Health Score */}
        <div className="card card-accent-green" style={{ textAlign: 'center', minWidth: 180 }}>
          <div className="card-title" style={{ justifyContent: 'center', marginBottom: '1.25rem' }}>
            <FiHeart size={16} style={{ color: 'var(--medical-green)' }} />Health Score
          </div>
          <HealthScoreRing score={78} />
          <div style={{ marginTop: '1rem', fontSize: '.78rem', color: 'var(--text-secondary)' }}>
            Based on your activity
          </div>
        </div>

        {/* Daily Tip */}
        <div className="card card-accent-blue">
          <div className="card-header">
            <div className="card-title"><FiZap size={16} style={{ color: 'var(--ibm-blue)' }} />Today's Health Tip</div>
            <span className="badge badge-blue">Daily</span>
          </div>
          <p style={{ fontSize: '.9rem', color: 'var(--text)', lineHeight: 1.7, marginBottom: '1rem' }}>{tip}</p>
          <div className="disclaimer-box" style={{ fontSize: '.75rem' }}>
            This tip is for general wellness education only.
          </div>
        </div>

        {/* Mini Trackers */}
        <div className="card card-accent-teal">
          <div className="card-header">
            <div className="card-title"><FiStar size={16} style={{ color: 'var(--ibm-teal)' }} />Today's Progress</div>
          </div>
          <MiniBar label="💧 Water" value={6} max={8} color="blue" />
          <MiniBar label="😴 Sleep (hrs)" value={7} max={9} color="teal" />
          <MiniBar label="🚶 Steps (k)" value={5} max={10} color="green" />
          <MiniBar label="🧘 Mindfulness (min)" value={10} max={20} color="orange" />
          <div style={{ marginTop: '.75rem' }}>
            <Link to="/analytics" className="btn btn-ghost btn-sm" style={{ fontSize: '.75rem', padding: '.25rem .6rem' }}>
              View Full Analytics →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>Quick Actions</h2>
        <span style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>Tap any card to get started</span>
      </div>
      <div className="quick-actions">
        {QUICK_ACTIONS.map(q => (
          <Link key={q.to} to={q.to} className="qa-card">
            <div className="qa-icon-wrap" style={{ background: `${q.color}18`, color: q.color }}>
              <span>{q.icon}</span>
            </div>
            <div className="qa-label">{q.label}</div>
            <div className="qa-desc">{q.desc}</div>
          </Link>
        ))}
      </div>

      {/* Recent Consultations */}
      {stats?.recent_sessions?.length > 0 && (
        <div className="card card-accent-blue" style={{ marginTop: '1.5rem' }}>
          <div className="card-header">
            <div className="card-title"><FiClock size={16} /> Recent Consultations</div>
            <Link to="/history" className="btn btn-ghost btn-sm">View All →</Link>
          </div>
          {stats.recent_sessions.map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '.7rem 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ibm-blue)', flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: '.875rem', color: 'var(--text)' }}>
                {s.symptoms?.slice(0, 80)}{s.symptoms?.length > 80 ? '…' : ''}
              </div>
              {s.urgency_level && <span className={`badge badge-${s.urgency_level.toLowerCase()}`}>{s.urgency_level}</span>}
              <span style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}>{new Date(s.created_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}

      {/* Medical Disclaimer */}
      <div className="disclaimer-box" style={{ marginTop: '1.5rem' }}>
        <strong>⚕ Medical Disclaimer:</strong> HealthAI provides educational health information only. It does not diagnose,
        treat, or prescribe. Always consult a qualified healthcare professional. In emergencies, call 911 / 999 / 112.
      </div>
    </div>
  );
}

export default DashboardPage;
