import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiActivity, FiBook, FiPackage, FiHeart, FiFileText,
  FiClock, FiAlertTriangle, FiTrendingUp, FiCheckCircle
} from 'react-icons/fi';
import { getDashboardStats } from '../services/api';

const QUICK_ACTIONS = [
  { to: '/checker',    icon: '🩺', label: 'Check Symptoms',  desc: 'AI analysis' },
  { to: '/diseases',   icon: '📚', label: 'Disease Info',    desc: 'Learn about conditions' },
  { to: '/medicines',  icon: '💊', label: 'Medicine Guide',  desc: 'Drug information' },
  { to: '/health-tips',icon: '🌿', label: 'Health Tips',     desc: 'Wellness advice' },
  { to: '/reports',    icon: '📄', label: 'Generate Report', desc: 'Download health report' },
  { to: '/emergency',  icon: '🚨', label: 'Emergency Help',  desc: 'Critical contacts' },
];

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendOk, setBackendOk] = useState(null);

  useEffect(() => {
    getDashboardStats()
      .then(data => { setStats(data); setBackendOk(true); })
      .catch(() => setBackendOk(false))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { color: 'blue',   icon: <FiActivity />, value: stats?.total_sessions ?? 0,      label: 'Total Sessions' },
    { color: 'green',  icon: <FiCheckCircle />, value: stats?.completed_analyses ?? 0, label: 'Completed Analyses' },
    { color: 'orange', icon: <FiTrendingUp />, value: stats?.urgency_distribution?.MEDIUM ?? 0, label: 'Medium Urgency' },
    { color: 'red',    icon: <FiAlertTriangle />, value: stats?.emergency_alerts ?? 0, label: 'Emergency Alerts' },
  ];

  return (
    <div>
      {/* Welcome header */}
      <div className="page-header">
        <h1>
          <FiActivity style={{ color: 'var(--ibm-blue)' }} />
          Welcome to HealthAI
        </h1>
        <p>
          Your AI-powered healthcare assistant, powered by IBM watsonx.ai Granite.
          Get symptom analysis, disease information, medicine guidance, and personalized health tips.
        </p>
      </div>

      {/* Backend status */}
      {backendOk === false && (
        <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
          <strong>⚠ Backend Offline:</strong> Cannot connect to the Flask server.
          Run <code style={{ background: '#fff1f1', padding: '.1rem .4rem', borderRadius: 3 }}>python app.py</code> in the <code>backend/</code> folder.
        </div>
      )}

      {backendOk === true && (
        <div className="alert alert-success" style={{ marginBottom: '1.25rem' }}>
          ✅ Backend connected — IBM Granite AI is online and ready.
        </div>
      )}

      {/* Stat cards */}
      {!loading && (
        <div className="stat-grid">
          {statCards.map(s => (
            <div key={s.label} className={`stat-card ${s.color}`}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="stat-grid">
          {[1,2,3,4].map(i => (
            <div key={i} className="stat-card blue" style={{ opacity: .4 }}>
              <div style={{ height: 80, background: 'var(--border)', borderRadius: 6 }} />
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-secondary)' }}>
        Quick Actions
      </h2>
      <div className="quick-actions">
        {QUICK_ACTIONS.map(q => (
          <Link key={q.to} to={q.to} className="qa-card">
            <span className="qa-icon">{q.icon}</span>
            <div className="qa-label">{q.label}</div>
            <div className="qa-desc">{q.desc}</div>
          </Link>
        ))}
      </div>

      {/* Recent sessions */}
      {stats?.recent_sessions?.length > 0 && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div className="card-header">
            <div className="card-title">
              <FiClock size={16} /> Recent Consultations
            </div>
            <Link to="/history" className="btn btn-ghost btn-sm">View All</Link>
          </div>
          <div>
            {stats.recent_sessions.map(s => (
              <div key={s.id} style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '.65rem 0', borderBottom: '1px solid var(--border)'
              }}>
                <div style={{ flex: 1, fontSize: '.875rem', color: 'var(--text)' }}>
                  {s.symptoms.slice(0, 80)}{s.symptoms.length > 80 ? '...' : ''}
                </div>
                {s.urgency_level && (
                  <span className={`badge badge-${s.urgency_level.toLowerCase()}`}>
                    {s.urgency_level}
                  </span>
                )}
                <span style={{ fontSize: '.75rem', color: 'var(--text-secondary)' }}>
                  {new Date(s.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="disclaimer-box" style={{ marginTop: '1.5rem' }}>
        <strong>⚕ Medical Disclaimer:</strong> HealthAI provides educational health information only.
        It does not diagnose, treat, or prescribe. Always consult a qualified healthcare professional.
        In emergencies, call 911 / 999 / 112.
      </div>
    </div>
  );
}

export default DashboardPage;
