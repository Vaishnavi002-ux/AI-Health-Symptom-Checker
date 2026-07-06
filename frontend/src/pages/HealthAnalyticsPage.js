import React, { useState } from 'react';
import { FiRadio, FiTrendingUp, FiActivity, FiDroplet, FiMoon, FiHeart } from 'react-icons/fi';

function Bar({ label, value, max, color, icon }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ marginBottom: '1.125rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.4rem' }}>
        <span style={{ fontSize: '.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '.35rem' }}>{icon} {label}</span>
        <span style={{ fontWeight: 700, fontSize: '.875rem', color: 'var(--text)' }}>{value}<span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>/{max}</span></span>
      </div>
      <div className="progress-bar-wrap">
        <div className={`progress-bar ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

const WEEKLY = [
  { day: 'Mon', sleep: 7.5, water: 6, steps: 8200 },
  { day: 'Tue', sleep: 6.8, water: 7, steps: 6100 },
  { day: 'Wed', sleep: 8.1, water: 8, steps: 10200 },
  { day: 'Thu', sleep: 7.2, water: 5, steps: 7500 },
  { day: 'Fri', sleep: 6.5, water: 6, steps: 5900 },
  { day: 'Sat', sleep: 9.0, water: 9, steps: 12000 },
  { day: 'Sun', sleep: 8.5, water: 8, steps: 9800 },
];

function HealthAnalyticsPage() {
  const [tab, setTab] = useState('overview');

  const avgSleep = (WEEKLY.reduce((s, d) => s + d.sleep, 0) / WEEKLY.length).toFixed(1);
  const avgWater = (WEEKLY.reduce((s, d) => s + d.water, 0) / WEEKLY.length).toFixed(1);
  const avgSteps = Math.round(WEEKLY.reduce((s, d) => s + d.steps, 0) / WEEKLY.length);

  return (
    <div>
      <div className="page-header">
        <h1><FiRadio style={{ color: 'var(--ibm-teal)' }} /> Health Analytics</h1>
        <p>Visual overview of your weekly health metrics and trends.</p>
      </div>

      {/* Summary Cards */}
      <div className="stat-grid">
        {[
          { color: 'blue',  icon: <FiMoon size={20}/>,     value: avgSleep+'h', label: 'Avg Sleep / Night'  },
          { color: 'teal',  icon: <FiDroplet size={20}/>,  value: avgWater+'g', label: 'Avg Water / Day'   },
          { color: 'green', icon: <FiActivity size={20}/>, value: avgSteps,     label: 'Avg Steps / Day'   },
          { color: 'purple',icon: <FiHeart size={20}/>,    value: '78',         label: 'Health Score'      },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div className="stat-icon-wrap">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        {['overview','sleep','water','steps'].map(t => (
          <button key={t} className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="card card-accent-blue">
            <div className="card-title" style={{ marginBottom: '1.25rem' }}><FiTrendingUp size={16} /> Weekly Progress</div>
            <Bar label="Sleep" value={avgSleep} max={9} color="teal" icon="😴" />
            <Bar label="Water (glasses)" value={avgWater} max={8} color="blue" icon="💧" />
            <Bar label="Steps (thousands)" value={Math.round(avgSteps/1000)} max={10} color="green" icon="🚶" />
            <Bar label="Health Score" value={78} max={100} color="orange" icon="❤️" />
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: '1.25rem' }}>📅 This Week</div>
            {WEEKLY.map(d => (
              <div key={d.day} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '.5rem 0', borderBottom: '1px solid var(--border)', fontSize: '.875rem' }}>
                <div style={{ width: 36, fontWeight: 700, color: 'var(--ibm-blue)' }}>{d.day}</div>
                <div style={{ flex: 1 }}>
                  <div className="progress-bar-wrap" style={{ height: 6 }}>
                    <div className="progress-bar blue" style={{ width: `${(d.steps / 15000) * 100}%` }} />
                  </div>
                </div>
                <div style={{ fontSize: '.78rem', color: 'var(--text-secondary)', minWidth: 60, textAlign: 'right' }}>{d.steps.toLocaleString()} steps</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sleep chart */}
      {tab === 'sleep' && (
        <div className="card card-accent-teal">
          <div className="card-title" style={{ marginBottom: '1.25rem' }}>😴 Sleep Duration — This Week</div>
          <div style={{ display: 'flex', align: 'end', gap: '.75rem', height: 160, alignItems: 'flex-end', padding: '0 1rem' }}>
            {WEEKLY.map(d => {
              const h = (d.sleep / 10) * 100;
              const good = d.sleep >= 7;
              return (
                <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem' }}>
                  <span style={{ fontSize: '.72rem', fontWeight: 700, color: good ? 'var(--medical-green-dark)' : 'var(--ibm-orange)' }}>{d.sleep}h</span>
                  <div style={{ width: '100%', height: `${h}%`, background: good ? 'var(--medical-green)' : 'var(--ibm-orange)', borderRadius: '4px 4px 0 0', transition: 'height .5s ease' }} />
                  <span style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}>{d.day}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '.78rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}><span style={{ width: 10, height: 10, background: 'var(--medical-green)', borderRadius: 2, display: 'inline-block' }} />≥7h (Recommended)</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}><span style={{ width: 10, height: 10, background: 'var(--ibm-orange)', borderRadius: 2, display: 'inline-block' }} />Under 7h</span>
          </div>
        </div>
      )}

      {/* Water chart */}
      {tab === 'water' && (
        <div className="card" style={{ borderTop: '3px solid #0ea5e9' }}>
          <div className="card-title" style={{ marginBottom: '1.25rem' }}>💧 Water Intake — This Week</div>
          <div style={{ display: 'flex', gap: '.75rem', height: 160, alignItems: 'flex-end', padding: '0 1rem' }}>
            {WEEKLY.map(d => {
              const h = (d.water / 10) * 100;
              const good = d.water >= 8;
              return (
                <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem' }}>
                  <span style={{ fontSize: '.72rem', fontWeight: 700, color: good ? '#0ea5e9' : 'var(--ibm-orange)' }}>{d.water}g</span>
                  <div style={{ width: '100%', height: `${h}%`, background: good ? '#0ea5e9' : 'var(--ibm-orange)', borderRadius: '4px 4px 0 0', transition: 'height .5s ease' }} />
                  <span style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}>{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Steps chart */}
      {tab === 'steps' && (
        <div className="card card-accent-green">
          <div className="card-title" style={{ marginBottom: '1.25rem' }}>🚶 Daily Steps — This Week</div>
          <div style={{ display: 'flex', gap: '.75rem', height: 160, alignItems: 'flex-end', padding: '0 1rem' }}>
            {WEEKLY.map(d => {
              const h = (d.steps / 15000) * 100;
              const good = d.steps >= 8000;
              return (
                <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem' }}>
                  <span style={{ fontSize: '.7rem', fontWeight: 700, color: good ? 'var(--medical-green-dark)' : 'var(--text-secondary)' }}>{(d.steps/1000).toFixed(1)}k</span>
                  <div style={{ width: '100%', height: `${h}%`, background: good ? 'var(--medical-green)' : 'var(--border-strong)', borderRadius: '4px 4px 0 0', transition: 'height .5s ease' }} />
                  <span style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}>{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="disclaimer-box" style={{ marginTop: '1.5rem' }}>
        Analytics are based on manually logged data and are for educational tracking purposes only.
      </div>
    </div>
  );
}

export default HealthAnalyticsPage;
