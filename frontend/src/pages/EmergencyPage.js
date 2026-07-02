import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiAlertTriangle } from 'react-icons/fi';

const EMERGENCY_NUMBERS = [
  { region: 'United States',  number: '911',  color: '#0f62fe' },
  { region: 'United Kingdom', number: '999',  color: '#0f62fe' },
  { region: 'European Union', number: '112',  color: '#0f62fe' },
  { region: 'Australia',      number: '000',  color: '#0f62fe' },
  { region: 'India',          number: '108',  color: '#0f62fe' },
  { region: 'Canada',         number: '911',  color: '#0f62fe' },
];

const WARNING_SIGNS = [
  { icon: '🫀', text: 'Chest pain or pressure (possible heart attack)' },
  { icon: '🫁', text: 'Difficulty breathing or shortness of breath' },
  { icon: '😵', text: 'Loss of consciousness or unresponsiveness' },
  { icon: '🩸', text: 'Severe or uncontrollable bleeding' },
  { icon: '🧠', text: 'Sudden face drooping, arm weakness, slurred speech (STROKE)' },
  { icon: '⚡', text: 'Seizures or convulsions' },
  { icon: '🐝', text: 'Severe allergic reaction (anaphylaxis)' },
  { icon: '💊', text: 'Suspected poisoning or overdose' },
  { icon: '🚫', text: 'Choking or inability to breathe' },
  { icon: '🆘', text: 'Suicidal thoughts or self-harm intent' },
];

const FAST = [
  { letter: 'F', title: 'Face Drooping',   desc: 'Is one side of the face drooping or numb? Ask the person to smile. Is the smile uneven?' },
  { letter: 'A', title: 'Arm Weakness',    desc: 'Is one arm weak or numb? Ask them to raise both arms. Does one arm drift downward?' },
  { letter: 'S', title: 'Speech Trouble',  desc: 'Is speech slurred? Is the person unable to speak or hard to understand?' },
  { letter: 'T', title: 'Time to Call',    desc: 'If you observe ANY of these signs, call emergency services IMMEDIATELY. Note the time.' },
];

function EmergencyPage() {
  return (
    <div>
      {/* Top banner */}
      <div className="emergency-banner-top">
        🚨 If you are experiencing a medical emergency, call emergency services IMMEDIATELY. Do not use this app during an emergency.
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '1.5rem 0' }}>
        <div className="page-header">
          <h1><FiAlertTriangle style={{ color: 'var(--ibm-red)' }} /> Emergency Help</h1>
          <p>Critical emergency contacts and warning signs. Always call emergency services first.</p>
        </div>

        {/* Emergency Numbers */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <FiPhone style={{ color: 'var(--ibm-red)' }} /> Emergency Numbers
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            {EMERGENCY_NUMBERS.map(e => (
              <div key={e.region} className="emergency-number-card">
                <div className="emergency-number">{e.number}</div>
                <div style={{ fontSize: '.82rem', color: 'var(--text-secondary)', marginTop: '.25rem', fontWeight: 600 }}>
                  {e.region}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Warning signs */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
            <FiAlertTriangle style={{ color: 'var(--ibm-red)', marginRight: '.5rem' }} />
            Call Emergency Services Immediately If You Have:
          </h2>
          <div style={{ background: 'var(--ibm-red-light)', border: '1px solid var(--ibm-red)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
              {WARNING_SIGNS.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '.75rem', fontSize: '.875rem', color: 'var(--ibm-red)' }}>
                  <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{s.icon}</span>
                  <span style={{ fontWeight: 500 }}>{s.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAST */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
            🧠 Stroke Warning — F.A.S.T.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {FAST.map(f => (
              <div key={f.letter} style={{
                background: f.letter === 'T' ? 'var(--ibm-red)' : 'var(--surface)',
                color: f.letter === 'T' ? '#fff' : 'var(--text)',
                border: `1px solid ${f.letter === 'T' ? 'var(--ibm-red)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '1.1rem',
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1, marginBottom: '.35rem' }}>{f.letter}</div>
                <div style={{ fontWeight: 700, fontSize: '.9rem', marginBottom: '.3rem' }}>{f.title}</div>
                <div style={{ fontSize: '.8rem', opacity: .85 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ display: 'flex', gap: '.75rem' }}>
          <Link to="/checker" className="btn btn-secondary">Go to Symptom Checker</Link>
          <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}

export default EmergencyPage;
