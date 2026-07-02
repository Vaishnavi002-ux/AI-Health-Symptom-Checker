import React, { useEffect, useState } from 'react';
import { FiClock, FiAlertCircle, FiChevronDown, FiChevronUp, FiRefreshCw } from 'react-icons/fi';
import { fetchHistory, generateReport } from '../services/api';

const URGENCY_BADGE = {
  LOW:       'badge-low',
  MEDIUM:    'badge-medium',
  HIGH:      'badge-high',
  EMERGENCY: 'badge-emergency',
};

function SessionCard({ session }) {
  const [expanded, setExpanded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const date = new Date(session.created_at).toLocaleString();

  const handleDownload = async (e) => {
    e.stopPropagation();
    if (session.state !== 'complete') {
      alert('Analysis not completed for this session yet.');
      return;
    }
    setDownloading(true);
    try {
      const data = await generateReport(session.id);
      const blob = new Blob([JSON.stringify(data.report, null, 2)], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url;
      a.download = `healthai-${session.id.slice(0,8)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="card" style={{ marginBottom: '.75rem', padding: '1rem' }}>
      <div
        style={{ display: 'flex', alignItems: 'flex-start', gap: '.75rem', cursor: 'pointer' }}
        onClick={() => setExpanded(o => !o)}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '.9rem', marginBottom: '.25rem' }}>
            {session.symptoms.slice(0, 100)}{session.symptoms.length > 100 ? '…' : ''}
          </div>
          <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '.75rem', color: 'var(--text-secondary)', display:'flex', alignItems:'center', gap: '.25rem' }}>
              <FiClock size={11} /> {date}
            </span>
            {session.is_emergency && (
              <span className="badge badge-emergency">
                <FiAlertCircle size={9} /> Emergency
              </span>
            )}
            {session.urgency_level && (
              <span className={`badge ${URGENCY_BADGE[session.urgency_level] || 'badge-gray'}`}>
                {session.urgency_level}
              </span>
            )}
            <span className="badge badge-gray">{session.state}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleDownload}
            disabled={downloading}
            title="Download report"
          >
            {downloading ? <span className="spinner" style={{ width:13, height:13, borderWidth:2 }} /> : '⬇'}
          </button>
          {expanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          {session.followups?.length > 0 && (
            <div style={{ marginBottom: '.75rem' }}>
              <div style={{ fontWeight: 700, fontSize: '.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '.4rem' }}>
                Follow-up Q&A
              </div>
              {session.followups.map((f, i) => (
                <div key={i} style={{ marginBottom: '.4rem', fontSize: '.85rem' }}>
                  <div style={{ color: 'var(--ibm-blue)', fontWeight: 600 }}>Q: {f.question}</div>
                  <div style={{ color: 'var(--text)', paddingLeft: '.75rem' }}>A: {f.answer || '—'}</div>
                </div>
              ))}
            </div>
          )}
          <div style={{ fontSize: '.72rem', color: 'var(--text-secondary)' }}>
            Session ID: <code style={{ background: 'var(--surface-2)', padding: '.1rem .35rem', borderRadius: 3 }}>{session.id}</code>
          </div>
        </div>
      )}
    </div>
  );
}

function ConsultationHistoryPage() {
  const [sessions, setSessions] = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [offset, setOffset]     = useState(0);
  const LIMIT = 10;

  const load = async () => {
    setLoading(true); setError('');
    try {
      const data = await fetchHistory(LIMIT, offset);
      setSessions(data.sessions || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [offset]);

  return (
    <div>
      <div className="page-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <h1><FiClock style={{ color:'var(--ibm-blue)' }} /> Consultation History</h1>
          <p>All your past AI health consultations. Total: <strong>{total}</strong></p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={load} disabled={loading}>
          <FiRefreshCw size={13} /> Refresh
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading && (
        <div className="loading-center">
          <span className="spinner" />Loading history...
        </div>
      )}

      {!loading && sessions.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <FiClock size={40} style={{ opacity: .3, marginBottom: '1rem' }} />
          <p>No sessions yet. Start a <a href="/checker">symptom check</a> to see it here.</p>
        </div>
      )}

      {!loading && sessions.map(s => <SessionCard key={s.id} session={s} />)}

      {/* Pagination */}
      {total > LIMIT && (
        <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'center', marginTop: '1.25rem' }}>
          <button className="btn btn-secondary btn-sm" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - LIMIT))}>
            ← Prev
          </button>
          <span style={{ lineHeight: '2rem', color: 'var(--text-secondary)', fontSize: '.85rem' }}>
            {offset + 1}–{Math.min(offset + LIMIT, total)} of {total}
          </span>
          <button className="btn btn-secondary btn-sm" disabled={offset + LIMIT >= total} onClick={() => setOffset(offset + LIMIT)}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default ConsultationHistoryPage;
