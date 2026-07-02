import React, { useState } from 'react';
import { FiFileText, FiDownload, FiSearch } from 'react-icons/fi';
import { fetchHistory, generateReport } from '../services/api';

function ReportGeneratorPage() {
  const [sessions, setSessions]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [genLoading, setGenLoading] = useState(null);
  const [error, setError]         = useState('');
  const [searched, setSearched]   = useState(false);

  const loadSessions = async () => {
    setLoading(true); setError('');
    try {
      const data = await fetchHistory(50, 0);
      const completed = (data.sessions || []).filter(s => s.state === 'complete' || s.state === 'emergency' || s.urgency_level);
      setSessions(completed);
      setSearched(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (sessionId) => {
    setGenLoading(sessionId);
    try {
      const data = await generateReport(sessionId);
      const report = data.report;

      // Build a nice text report
      const lines = [
        '========================================',
        '   HealthAI — AI Health Report',
        '========================================',
        `Generated: ${new Date(report.generated_at).toLocaleString()}`,
        `Session ID: ${report.session_id}`,
        '',
        '--- SYMPTOMS REPORTED ---',
        report.symptoms,
        '',
      ];

      if (report.patient_context && Object.keys(report.patient_context).length) {
        lines.push('--- PATIENT CONTEXT ---');
        Object.entries(report.patient_context).forEach(([k, v]) => {
          if (v) lines.push(`${k}: ${v}`);
        });
        lines.push('');
      }

      if (report.followups?.length) {
        lines.push('--- FOLLOW-UP Q&A ---');
        report.followups.forEach((f, i) => {
          lines.push(`Q${i+1}: ${f.question}`);
          lines.push(`A${i+1}: ${f.answer}`);
        });
        lines.push('');
      }

      const a = report.analysis || {};
      lines.push(`--- URGENCY LEVEL: ${report.urgency_level || a.urgency_level || 'N/A'} ---`);
      if (a.reason) lines.push(`Reason: ${a.reason}`);
      lines.push('');

      if (a.possible_conditions?.length) {
        lines.push('--- POSSIBLE CONDITIONS ---');
        a.possible_conditions.forEach(c => lines.push(`• ${c}`));
        lines.push('');
      }

      if (a.home_care?.length) {
        lines.push('--- HOME CARE ---');
        a.home_care.forEach(t => lines.push(`• ${t}`));
        lines.push('');
      }

      if (a.preventive_measures?.length) {
        lines.push('--- PREVENTIVE MEASURES ---');
        a.preventive_measures.forEach(m => lines.push(`• ${m}`));
        lines.push('');
      }

      if (a.when_to_consult?.length) {
        lines.push('--- WHEN TO CONSULT A DOCTOR ---');
        a.when_to_consult.forEach(w => lines.push(`• ${w}`));
        lines.push('');
      }

      lines.push('--- DISCLAIMER ---');
      lines.push(report.disclaimer || a.disclaimer || '');
      lines.push('');
      lines.push('========================================');
      lines.push('Powered by IBM watsonx.ai Granite');
      lines.push('========================================');

      const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
      const url  = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `HealthAI-Report-${report.session_id.slice(0, 8)}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    } finally {
      setGenLoading(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1><FiFileText style={{ color: 'var(--ibm-blue)' }} /> AI Health Report Generator</h1>
        <p>Generate and download structured health reports from your completed consultations.</p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }}>📄</div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '.5rem' }}>Generate Health Reports</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '.875rem', marginBottom: '1.25rem' }}>
          Load your completed consultations and download detailed reports as text files.
          Reports include symptoms, AI analysis, conditions, recommendations, and disclaimers.
        </p>
        <button
          className="btn btn-primary"
          onClick={loadSessions}
          disabled={loading}
        >
          {loading
            ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Loading...</>
            : <><FiSearch size={14} /> Load My Consultations</>}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {searched && !loading && sessions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
          No completed consultations found. Complete a <a href="/checker">Symptom Check</a> first.
        </div>
      )}

      {sessions.length > 0 && (
        <div>
          <h3 style={{ fontSize: '.9rem', fontWeight: 700, marginBottom: '.75rem', color: 'var(--text-secondary)' }}>
            {sessions.length} consultation{sessions.length !== 1 ? 's' : ''} available
          </h3>
          {sessions.map(s => (
            <div key={s.id} className="card" style={{ marginBottom: '.75rem', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '.9rem', marginBottom: '.25rem' }}>
                  {s.symptoms.slice(0, 100)}{s.symptoms.length > 100 ? '…' : ''}
                </div>
                <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '.75rem', color: 'var(--text-secondary)' }}>
                    {new Date(s.created_at).toLocaleDateString()}
                  </span>
                  {s.urgency_level && (
                    <span className={`badge badge-${s.urgency_level.toLowerCase()}`}>
                      {s.urgency_level}
                    </span>
                  )}
                </div>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => downloadReport(s.id)}
                disabled={genLoading === s.id}
              >
                {genLoading === s.id
                  ? <span className="spinner" style={{ width: 13, height: 13, borderWidth: 2 }} />
                  : <FiDownload size={13} />}
                {genLoading === s.id ? 'Generating...' : 'Download'}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="disclaimer-box" style={{ marginTop: '1.5rem' }}>
        <strong>⚕ Note:</strong> Reports are generated for educational purposes only.
        Share with your doctor for professional evaluation. These reports do not constitute a medical diagnosis.
      </div>
    </div>
  );
}

export default ReportGeneratorPage;
