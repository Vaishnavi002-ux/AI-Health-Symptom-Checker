import React, { useEffect, useState } from 'react';
import { fetchHistory } from '../services/api';
import { FiClock, FiAlertCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const URGENCY_META = {
  LOW:       { label: 'Low',       cls: 'badge-low' },
  MEDIUM:    { label: 'Medium',    cls: 'badge-medium' },
  HIGH:      { label: 'High',      cls: 'badge-high' },
  EMERGENCY: { label: 'Emergency', cls: 'badge-emergency' },
};

function SessionItem({ session }) {
  const [expanded, setExpanded] = useState(false);
  const urgency = URGENCY_META[session.urgency_level] || null;
  const date = new Date(session.created_at).toLocaleString();

  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <div
        style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', cursor: 'pointer' }}
        onClick={() => setExpanded(o => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setExpanded(o => !o)}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.3rem' }}>
            {session.symptoms.slice(0, 100)}{session.symptoms.length > 100 ? '...' : ''}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <FiClock size={12} /> {date}
            </span>
            {session.is_emergency && (
              <span className="badge badge-emergency">
                <FiAlertCircle size={10} /> Emergency
              </span>
            )}
            {urgency && (
              <span className={`badge ${urgency.cls}`}>{urgency.label}</span>
            )}
            <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', background: 'var(--surface-2)', padding: '0.2rem 0.5rem', borderRadius: '999px' }}>
              {session.state}
            </span>
          </div>
        </div>
        <button className="btn-icon" aria-label={expanded ? 'Collapse' : 'Expand'}>
          {expanded ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </div>

      {expanded && (
        <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          {session.followups?.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Follow-up Q&A
              </div>
              {session.followups.map((f, i) => (
                <div key={i} style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  <div style={{ color: 'var(--primary)', fontWeight: 600 }}>Q: {f.question}</div>
                  <div style={{ color: 'var(--text)', paddingLeft: '0.75rem' }}>A: {f.answer || '—'}</div>
                </div>
              ))}
            </div>
          )}
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Session ID: <code>{session.id}</code>
          </div>
        </div>
      )}
    </div>
  );
}

function HistoryPage() {
  const [sessions, setSessions] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [offset, setOffset] = useState(0);
  const LIMIT = 10;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchHistory(LIMIT, offset);
        setSessions(data.sessions || []);
        setTotal(data.total || 0);
      } catch {
        setError('Could not load history. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [offset]);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <h1 className="section-title">Session History</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
        Review your past symptom checking sessions. Total: <strong>{total}</strong>
      </p>

      {loading && (
        <div className="loading-overlay">
          <span className="spinner" />
          Loading history...
        </div>
      )}

      {error && (
        <div className="disclaimer-box" style={{ background: '#fce8e6', borderColor: '#ea4335', color: '#c5221f' }}>
          {error}
        </div>
      )}

      {!loading && !error && sessions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No sessions found. Start a{' '}
          <a href="/checker" style={{ color: 'var(--primary)' }}>symptom check</a> to see history here.
        </div>
      )}

      {!loading && sessions.map(s => (
        <SessionItem key={s.id} session={s} />
      ))}

      {/* Pagination */}
      {total > LIMIT && (
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'center' }}>
          <button
            className="btn btn-secondary"
            disabled={offset === 0}
            onClick={() => setOffset(Math.max(0, offset - LIMIT))}
          >
            ← Previous
          </button>
          <span style={{ lineHeight: '2.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {offset + 1}–{Math.min(offset + LIMIT, total)} of {total}
          </span>
          <button
            className="btn btn-secondary"
            disabled={offset + LIMIT >= total}
            onClick={() => setOffset(offset + LIMIT)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
