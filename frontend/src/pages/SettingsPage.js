import React, { useState } from 'react';
import { FiSettings, FiSave, FiMoon, FiSun, FiBell, FiShield } from 'react-icons/fi';

function SettingsPage() {
  const [settings, setSettings] = useState({
    darkMode: localStorage.getItem('healthai-theme') === 'dark',
    notifications: true,
    language: 'en',
    fontSize: 'medium',
    aiTimeout: 90,
    disclaimer: true,
  });
  const [saved, setSaved] = useState(false);

  const upd = (k, v) => setSettings(s => ({ ...s, [k]: v }));

  const save = () => {
    localStorage.setItem('healthai-theme', settings.darkMode ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', settings.darkMode ? 'dark' : 'light');
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Section = ({ title, icon, children, accent }) => (
    <div className={`card card-accent-${accent || 'blue'}`} style={{ marginBottom: '1.5rem' }}>
      <div className="card-title" style={{ marginBottom: '1.25rem' }}>{icon} {title}</div>
      {children}
    </div>
  );

  const Toggle = ({ label, desc, k }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.75rem 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: '.875rem' }}>{label}</div>
        {desc && <div style={{ fontSize: '.78rem', color: 'var(--text-muted)', marginTop: '.15rem' }}>{desc}</div>}
      </div>
      <button
        onClick={() => upd(k, !settings[k])}
        style={{
          width: 46, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
          background: settings[k] ? 'var(--ibm-blue)' : 'var(--border-strong)',
          position: 'relative', transition: 'background .2s', flexShrink: 0,
        }}
      >
        <span style={{
          position: 'absolute', top: 3, left: settings[k] ? 23 : 3,
          width: 20, height: 20, borderRadius: '50%', background: '#fff',
          transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.3)',
        }} />
      </button>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h1><FiSettings style={{ color: 'var(--ibm-blue)' }} /> Settings</h1>
        <p>Customize your HealthAI experience.</p>
      </div>

      <div style={{ maxWidth: 700 }}>
        <Section title="Appearance" icon={<FiSun size={16} />} accent="blue">
          <Toggle label="Dark Mode" desc="Enable dark theme for low-light environments" k="darkMode" />
          <div style={{ padding: '.875rem 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 600, fontSize: '.875rem', marginBottom: '.625rem' }}>Font Size</div>
            <div style={{ display: 'flex', gap: '.5rem' }}>
              {['small','medium','large'].map(f => (
                <button key={f} className={`btn btn-sm ${settings.fontSize === f ? 'btn-primary' : 'btn-outline-gray'}`} style={{ textTransform: 'capitalize' }} onClick={() => upd('fontSize', f)}>{f}</button>
              ))}
            </div>
          </div>
          <div style={{ padding: '.875rem 0' }}>
            <div style={{ fontWeight: 600, fontSize: '.875rem', marginBottom: '.625rem' }}>Language</div>
            <div style={{ display: 'flex', gap: '.5rem' }}>
              {[['en','English'],['hi','हिन्दी'],['mr','मराठी']].map(([code, name]) => (
                <button key={code} className={`btn btn-sm ${settings.language === code ? 'btn-primary' : 'btn-outline-gray'}`} onClick={() => upd('language', code)}>{name}</button>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Notifications" icon={<FiBell size={16} />} accent="green">
          <Toggle label="Enable Notifications" desc="Receive medicine reminders and health tips" k="notifications" />
        </Section>

        <Section title="AI Settings" icon="🤖" accent="purple">
          <div style={{ padding: '.875rem 0' }}>
            <label className="form-label">AI Response Timeout (seconds)</label>
            <input className="form-control" type="number" min="30" max="180" value={settings.aiTimeout} onChange={e => upd('aiTimeout', parseInt(e.target.value))} style={{ maxWidth: 140 }} />
            <div className="form-hint">Default: 90 seconds. Increase if you have a slow connection.</div>
          </div>
        </Section>

        <Section title="Privacy & Safety" icon={<FiShield size={16} />} accent="orange">
          <Toggle label="Always show Medical Disclaimer" desc="Display safety disclaimer on all pages" k="disclaimer" />
        </Section>

        <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={save}>
          <FiSave size={16} /> Save Settings
        </button>

        {saved && <div className="alert alert-success" style={{ marginTop: '1rem', textAlign: 'center' }}>✅ Settings saved!</div>}
      </div>
    </div>
  );
}

export default SettingsPage;
