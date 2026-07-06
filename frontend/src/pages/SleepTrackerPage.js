import React, { useState } from 'react';
import { FiMoon, FiPlus, FiRefreshCw, FiInfo } from 'react-icons/fi';

const QUALITY_OPTS = ['Excellent', 'Good', 'Fair', 'Poor'];
const RECOMMENDED = 8;

function SleepTrackerPage() {
  const [bedtime, setBedtime]     = useState('');
  const [wakeTime, setWakeTime]   = useState('');
  const [quality, setQuality]     = useState('Good');
  const [log, setLog]             = useState([]);
  const [notes, setNotes]         = useState('');

  const calcDuration = (bed, wake) => {
    if (!bed || !wake) return null;
    const [bh, bm] = bed.split(':').map(Number);
    const [wh, wm] = wake.split(':').map(Number);
    let mins = (wh * 60 + wm) - (bh * 60 + bm);
    if (mins < 0) mins += 24 * 60;
    return (mins / 60).toFixed(1);
  };

  const addEntry = () => {
    const dur = calcDuration(bedtime, wakeTime);
    if (!dur) return;
    setLog(prev => [{
      date: new Date().toLocaleDateString(),
      bedtime, wakeTime,
      duration: parseFloat(dur),
      quality, notes,
    }, ...prev]);
    setBedtime(''); setWakeTime(''); setNotes('');
  };

  const avg = log.length ? (log.reduce((s, e) => s + e.duration, 0) / log.length).toFixed(1) : null;

  const qualityColor = q => q === 'Excellent' ? '#22c55e' : q === 'Good' ? '#0ea5e9' : q === 'Fair' ? '#ff832b' : '#da1e28';

  return (
    <div>
      <div className="page-header">
        <h1><FiMoon style={{ color: '#6366f1' }} /> Sleep Tracker</h1>
        <p>Track your sleep patterns. Recommended: 7–9 hours of quality sleep per night.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: 900 }}>
        {/* Log entry */}
        <div className="card card-accent-purple">
          <div className="card-title" style={{ marginBottom: '1.25rem' }}><FiPlus size={16} /> Log Last Night's Sleep</div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Bedtime</label>
              <input className="form-control" type="time" value={bedtime} onChange={e => setBedtime(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Wake Time</label>
              <input className="form-control" type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} />
            </div>
          </div>

          {bedtime && wakeTime && (
            <div style={{ textAlign: 'center', padding: '.75rem', background: 'var(--ibm-purple-light)', borderRadius: 'var(--r-sm)', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--ibm-purple)' }}>
                {calcDuration(bedtime, wakeTime)} hrs
              </span>
              <span style={{ fontSize: '.8rem', color: 'var(--text-secondary)', marginLeft: '.5rem' }}>duration</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Sleep Quality</label>
            <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
              {QUALITY_OPTS.map(q => (
                <button key={q} className={`btn btn-sm ${quality === q ? 'btn-primary' : 'btn-outline-gray'}`}
                  style={quality === q ? { background: qualityColor(q), borderColor: qualityColor(q) } : {}}
                  onClick={() => setQuality(q)}>{q}</button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes (optional)</label>
            <input className="form-control" placeholder="e.g. Had a nightmare, woke up early..." value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

          <button className="btn btn-primary" style={{ background: '#6366f1', borderColor: '#6366f1', width: '100%' }} onClick={addEntry} disabled={!bedtime || !wakeTime}>
            <FiPlus size={15} /> Log Sleep
          </button>
        </div>

        {/* History */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><FiMoon size={16} /> Sleep History</div>
            {avg && <span style={{ fontSize: '.8rem', color: 'var(--text-secondary)' }}>Avg: <strong style={{ color: '#6366f1' }}>{avg} hrs</strong></span>}
          </div>

          {log.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <FiMoon size={32} style={{ opacity: .3, marginBottom: '.75rem' }} />
              <p>No entries yet. Log your sleep!</p>
            </div>
          ) : (
            log.map((e, i) => (
              <div key={i} style={{ padding: '.75rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${qualityColor(e.quality)}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>😴</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '.875rem' }}>{e.duration} hrs · {e.date}</div>
                  <div style={{ fontSize: '.78rem', color: qualityColor(e.quality) }}>{e.quality} quality · {e.bedtime} → {e.wakeTime}</div>
                  {e.notes && <div style={{ fontSize: '.72rem', color: 'var(--text-muted)', marginTop: '.2rem' }}>{e.notes}</div>}
                </div>
                <span style={{ fontSize: '1.5rem' }}>
                  {e.duration >= RECOMMENDED - 1 ? '✅' : e.duration >= 6 ? '⚠️' : '❌'}
                </span>
              </div>
            ))
          )}

          <div className="disclaimer-box" style={{ marginTop: '1rem', fontSize: '.76rem' }}>
            <FiInfo size={12} style={{ marginRight: '.3rem' }} />
            Adults typically need 7–9 hours. Consult a healthcare provider for persistent sleep issues.
          </div>
        </div>
      </div>
    </div>
  );
}

export default SleepTrackerPage;
