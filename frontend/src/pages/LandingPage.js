import React from 'react';
import { Link } from 'react-router-dom';
import { FiActivity, FiAlertTriangle, FiShield, FiMessageCircle,
         FiClock, FiBarChart2, FiList, FiArrowRight } from 'react-icons/fi';
import Disclaimer from '../components/Disclaimer';

const FEATURES = [
  { icon: <FiMessageCircle />, title: 'Natural Language Input', desc: 'Describe symptoms in your own words — no medical jargon needed.' },
  { icon: <FiList />, title: 'Intelligent Follow-up', desc: 'Agentic AI gathers missing information before analyzing, just like a real intake assessment.' },
  { icon: <FiBarChart2 />, title: 'Possible Conditions', desc: 'Understand potential health conditions in plain language (educational only).' },
  { icon: <FiClock />, title: 'Urgency Classification', desc: 'Automatically classified as Low, Medium, High, or Emergency.' },
  { icon: <FiShield />, title: 'Home Care & Prevention', desc: 'Actionable home care tips and preventive measures tailored to your symptoms.' },
  { icon: <FiAlertTriangle />, title: 'Emergency Detection', desc: 'Instantly detects life-threatening symptoms and redirects to emergency guidance.' },
];

const STEPS = [
  { num: '01', title: 'Describe Symptoms', desc: 'Type or speak your symptoms naturally.' },
  { num: '02', title: 'Answer Questions', desc: 'AI asks clarifying questions to gather full context.' },
  { num: '03', title: 'AI Analysis', desc: 'IBM Granite analyzes your complete symptom history.' },
  { num: '04', title: 'View Results', desc: 'Get structured health guidance with urgency level.' },
];

function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="badge badge-low" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            Powered by IBM watsonx.ai Granite
          </div>
          <h1 className="hero-title">
            Your AI <span>Health Symptom</span> Checker
          </h1>
          <p className="hero-subtitle">
            Describe your symptoms in natural language. Our agentic AI asks intelligent
            follow-up questions and delivers structured health education — instantly.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/checker" className="btn btn-primary btn-lg">
              <FiActivity /> Start Symptom Check
            </Link>
            <Link to="/about" className="btn btn-secondary btn-lg">
              Learn How It Works <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Core Features</h2>
          <p className="section-subtitle">
            Everything you need for intelligent, safe health education.
          </p>
          <div className="features-grid">
            {FEATURES.map(f => (
              <div className="feature-card" key={f.title}>
                <span className="feature-icon" style={{ color: 'var(--primary)' }}>{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">The agentic AI workflow — 4 simple steps.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
            {STEPS.map((s, i) => (
              <div key={s.num} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'var(--primary)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', fontWeight: 800, margin: '0 auto 1rem',
                }}>
                  {i + 1}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>{s.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/checker" className="btn btn-primary btn-lg">
              Try It Now <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="section">
        <div className="container">
          <Disclaimer />
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
