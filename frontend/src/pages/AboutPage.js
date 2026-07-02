import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import Disclaimer from '../components/Disclaimer';

const TECH = [
  { name: 'React.js', role: 'Frontend UI framework' },
  { name: 'Python Flask', role: 'Backend REST API' },
  { name: 'IBM watsonx.ai', role: 'AI inference platform' },
  { name: 'IBM Granite', role: 'Foundation language model' },
  { name: 'IBM Cloud Lite', role: 'Cloud deployment' },
  { name: 'SQLite', role: 'Session & history storage' },
];

const SAFETY = [
  'Never diagnoses diseases or medical conditions.',
  'Never prescribes or recommends medications.',
  'Never suggests medication dosages.',
  'Always includes an educational disclaimer.',
  'Immediately escalates potential emergencies.',
  'Encourages consultation with qualified healthcare professionals.',
];

const AGENTIC = [
  { step: 1, title: 'Receive Symptoms', desc: 'User enters symptoms in natural language.' },
  { step: 2, title: 'Emergency Detection', desc: 'Instantly checks for life-threatening keywords and escalates if found.' },
  { step: 3, title: 'Information Assessment', desc: 'Determines whether sufficient context exists for analysis.' },
  { step: 4, title: 'Follow-up Questions', desc: 'Generates targeted questions to fill information gaps.' },
  { step: 5, title: 'Prompt Construction', desc: 'Builds a structured prompt from the complete conversation.' },
  { step: 6, title: 'IBM Granite Inference', desc: 'Sends the prompt to IBM Granite for analysis.' },
  { step: 7, title: 'Response Parsing', desc: 'Extracts structured sections from the model response.' },
  { step: 8, title: 'Display Results', desc: 'Presents educational guidance with urgency classification.' },
];

function AboutPage() {
  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ maxWidth: 720 }}>
        <h1 className="section-title">About HealthAI Symptom Checker</h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginTop: '0.75rem', lineHeight: 1.7 }}>
          HealthAI is an educational health tool that uses an <strong>agentic AI workflow</strong> powered
          by IBM watsonx.ai Granite. It goes beyond simple Q&A — it thinks, asks questions, and gathers
          complete context before providing structured health guidance.
        </p>
      </div>

      {/* Agentic Workflow */}
      <section style={{ marginTop: '3rem' }}>
        <h2 className="section-title" style={{ fontSize: '1.4rem' }}>The Agentic Workflow</h2>
        <p className="section-subtitle">How HealthAI processes your symptoms — step by step.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
          {AGENTIC.map(item => (
            <div
              key={item.step}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '1rem',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '10px', padding: '1rem 1.25rem'
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.85rem', flexShrink: 0
              }}>
                {item.step}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ marginTop: '3rem' }}>
        <h2 className="section-title" style={{ fontSize: '1.4rem' }}>Technology Stack</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {TECH.map(t => (
            <div key={t.name} className="card" style={{ padding: '1rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)' }}>{t.name}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Safety Rules */}
      <section style={{ marginTop: '3rem' }}>
        <h2 className="section-title" style={{ fontSize: '1.4rem' }}>Safety & Ethics</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
          HealthAI is designed with safety as the top priority. The system:
        </p>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {SAFETY.map((item, i) => (
            <li key={i} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              fontSize: '0.9rem', color: 'var(--text)'
            }}>
              <span style={{
                width: 20, height: 20, borderRadius: '50%', background: '#e6f4ea',
                color: '#137333', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0
              }}>✓</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <div style={{ marginTop: '3rem' }}>
        <Disclaimer />
        <Link to="/checker" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Try Symptom Checker <FiArrowRight />
        </Link>
      </div>
    </div>
  );
}

export default AboutPage;
