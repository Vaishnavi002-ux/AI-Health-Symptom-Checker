import React from 'react';
import {
  FiActivity, FiAlertTriangle, FiHome, FiShield,
  FiCalendar, FiAlertCircle, FiDownload, FiFileText
} from 'react-icons/fi';
import { generateReport } from '../services/api';

const URGENCY = {
  LOW:       { label: 'Low',       cls: 'urgency-low',       badge: 'badge-low'       },
  MEDIUM:    { label: 'Medium',    cls: 'urgency-medium',    badge: 'badge-medium'    },
  HIGH:      { label: 'High',      cls: 'urgency-high',      badge: 'badge-high'      },
  EMERGENCY: { label: 'Emergency', cls: 'urgency-emergency', badge: 'badge-emergency' },
};

function ResultsDisplay({ sessionState, onReset }) {
  const analysis = sessionState?.analysis;
  if (!analysis) return null;

  const urgency = URGENCY[analysis.urgency_level] || URGENCY.LOW;

  const handleDownload = async () => {
    try {
      const result = await generateReport(sessionState.session_id);
      const dataStr = JSON.stringify(result.report, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `healthai-report-${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Could not generate report. Please try again.');
    }
  };

  return (
    <div>
      {/* Urgency banner */}
      <div className={`urgency-banner ${urgency.cls}`}>
        <FiAlertCircle size={22} />
        <div>
          <div style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.06em', opacity: .8 }}>Urgency Level</div>
          <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{urgency.label}</div>
        </div>
        {analysis.reason && (
          <div style={{ flex: 1, fontSize: '.85rem', opacity: .9 }}>{analysis.reason}</div>
        )}
      </div>

      {/* Emergency warning */}
      {analysis.emergency_warning && (
        <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '.75rem', fontWeight: 600 }}>
          <FiAlertTriangle size={18} />
          {analysis.emergency_warning}
        </div>
      )}

      {/* Results grid */}
      <div className="results-grid">
        {analysis.possible_conditions?.length > 0 && (
          <div className="result-card" style={{ gridColumn: '1 / -1' }}>
            <h3><FiActivity /> Possible Conditions</h3>
            <ul className="result-list">
              {analysis.possible_conditions.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
            <p style={{ fontSize: '.75rem', color: 'var(--text-secondary)', marginTop: '.75rem', fontStyle: 'italic' }}>
              Educational possibilities only — not a diagnosis.
            </p>
          </div>
        )}

        {analysis.home_care?.length > 0 && (
          <div className="result-card">
            <h3><FiHome /> Home Care</h3>
            <ul className="result-list">
              {analysis.home_care.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        )}

        {analysis.preventive_measures?.length > 0 && (
          <div className="result-card">
            <h3><FiShield /> Preventive Measures</h3>
            <ul className="result-list">
              {analysis.preventive_measures.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </div>
        )}

        {analysis.when_to_consult?.length > 0 && (
          <div className="result-card">
            <h3><FiCalendar /> When to Consult a Doctor</h3>
            <ul className="result-list">
              {analysis.when_to_consult.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        )}
      </div>

      {analysis.disclaimer && (
        <div className="disclaimer-box" style={{ marginTop: '1.25rem' }}>
          <FiFileText style={{ marginRight: '.35rem', verticalAlign: 'middle' }} />
          {analysis.disclaimer}
        </div>
      )}

      <div style={{ display: 'flex', gap: '.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
        <button className="btn btn-secondary" onClick={onReset}>
          Check New Symptoms
        </button>
        <button className="btn btn-primary" onClick={handleDownload}>
          <FiDownload size={14} /> Download Report
        </button>
      </div>
    </div>
  );
}

export default ResultsDisplay;
