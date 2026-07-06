import React, { useState } from 'react';
import { FiDroplet, FiPlus, FiMinus, FiRefreshCw } from 'react-icons/fi';

const GLASSES = 8;
const ML_PER_GLASS = 250;

function WaterTrackerPage() {
  const [count, setCount]   = useState(0);
  const [custom, setCustom] = useState('');
  const [log, setLog]       = useState([]);

  const add = (glasses = 1) => {
    const newCount = Math.min(count + glasses, GLASSES * 2);
    setCount(newCount);
    setLog(prev => [{time: new Date().toLocaleTimeString(), glasses, ml: glasses * ML_PER_GLASS}, ...prev]);
  };

  const addCustom = () => {
    const ml = parseInt(custom);
    if (!ml || ml <= 0) return;
    const glasses = ml / ML_PER_GLASS;
    setCount(c => c + glasses);
    setLog(prev => [{time: new Date().toLocaleTimeString(), glasses, ml}, ...prev]);
    setCustom('');
  };

  const pct = Math.min((count / GLASSES) * 100, 100);
  const totalMl = count * ML_PER_GLASS;

  return (
    <div>
      <div className="page-header">
        <h1><FiDroplet style={{ color: '#0ea5e9' }} /> Water Intake Tracker</h1>
        <p>Track your daily water intake. Goal: {GLASSES} glasses ({GLASSES * ML_PER_GLASS}ml) per day.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: 800 }}>
        {/* Main tracker */}
        <div className="card card-accent-blue">
          <div className="card-header">
            <div className="card-title"><FiDroplet size={16} style={{ color: '#0ea5e9' }} /> Daily Goal</div>
            <button className="btn btn-ghost btn-sm" onClick={() => { setCount(0); setLog([]); }}><FiRefreshCw size={13} /> Reset</button>
          </div>

          {/* Big progress circle */}
          <div style={{ textAlign: 'center', margin: '1rem 0' }}>
            <div style={{
              width: 140, height: 140, borderRadius: '50%', margin: '0 auto',
              background: `conic-gradient(#0ea5e9 0% ${pct}%, var(--border) ${pct}% 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 24px rgba(14,165,233,.25)',
            }}>
              <div style={{ width: 106, height: 106, borderRadius: '50%', background: 'var(--surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0ea5e9', lineHeight: 1 }}>{count.toFixed(1)}</span>
                <span style={{ fontSize: '.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>of {GLASSES} glasses</span>
              </div>
            </div>
            <div style={{ marginTop: '.75rem', fontSize: '.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {totalMl}ml consumed · {Math.round((GLASSES * ML_PER_GLASS) - totalMl)}ml remaining
            </div>
          </div>

          {/* Glasses icons */}
          <div style={{ display: 'flex', gap: '.5rem', justifyContent: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {Array.from({ length: GLASSES }).map((_, i) => (
              <div key={i} style={{ fontSize: '1.6rem', filter: i < count ? 'none' : 'grayscale(1) opacity(.3)', transition: 'all .2s' }}>💧</div>
            ))}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'center', marginBottom: '1rem' }}>
            <button className="btn btn-outline-gray" onClick={() => setCount(c => Math.max(0, c - 1))}><FiMinus size={16} /></button>
            <button className="btn btn-primary btn-lg" style={{ background: '#0ea5e9', borderColor: '#0ea5e9', minWidth: 140 }} onClick={() => add(1)}>
              <FiPlus size={16} /> Add Glass
            </button>
            <button className="btn btn-outline-gray" onClick={() => add(0.5)}>+½</button>
          </div>

          {/* Custom ml */}
          <div style={{ display: 'flex', gap: '.5rem' }}>
            <input className="form-control" type="number" placeholder="Custom ml (e.g. 500)" value={custom} onChange={e => setCustom(e.target.value)} />
            <button className="btn btn-secondary" onClick={addCustom}>Add</button>
          </div>

          {pct >= 100 && (
            <div className="alert alert-success" style={{ marginTop: '1rem', textAlign: 'center' }}>
              🎉 Daily goal achieved! Great hydration!
            </div>
          )}
        </div>

        {/* Log */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: '1.25rem' }}>Today's Log</div>
          {log.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <FiDroplet size={32} style={{ opacity: .3, marginBottom: '.75rem' }} />
              <p>No entries yet. Start drinking!</p>
            </div>
          ) : (
            log.map((entry, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '.6rem 0', borderBottom: '1px solid var(--border)', fontSize: '.875rem' }}>
                <span style={{ color: '#0ea5e9' }}>💧 {entry.ml}ml</span>
                <span style={{ color: 'var(--text-secondary)' }}>{entry.time}</span>
              </div>
            ))
          )}
          <div className="disclaimer-box" style={{ marginTop: '1rem', fontSize: '.76rem' }}>
            General recommendation: 8 glasses/day. Individual needs vary. Consult your doctor for personalized advice.
          </div>
        </div>
      </div>
    </div>
  );
}

export default WaterTrackerPage;
