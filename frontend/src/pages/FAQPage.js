import React, { useState } from 'react';
import { FiHelpCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const FAQS = [
  {
    cat: 'General',
    items: [
      { q: 'What is HealthAI?', a: 'HealthAI is an educational AI-powered health assistant built with IBM watsonx.ai Granite. It helps users understand possible health conditions, provides wellness guidance, and educational medical information. It does NOT diagnose diseases or prescribe medications.' },
      { q: 'Is HealthAI a replacement for a doctor?', a: 'No. HealthAI is strictly for educational purposes. It cannot replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical concerns.' },
      { q: 'Is my health data safe?', a: 'Your symptom data is stored locally in an SQLite database on your device/server. It is not shared with third parties. IBM Granite processes your prompts securely via IBM Cloud.' },
    ],
  },
  {
    cat: 'Symptom Checker',
    items: [
      { q: 'How does the Symptom Checker work?', a: 'The Symptom Checker uses an Agentic AI workflow: it first detects emergencies, then asks follow-up questions to gather complete information, builds a structured prompt, and sends it to IBM Granite for analysis. Results are educational guidance only.' },
      { q: 'What if my symptoms are an emergency?', a: 'If you describe symptoms like chest pain, difficulty breathing, or loss of consciousness, HealthAI will immediately alert you to call emergency services (911/999/112). Do not use the app during an emergency.' },
      { q: 'How accurate are the AI results?', a: 'IBM Granite provides educational possibilities based on your symptoms. These are NOT diagnoses. The model may be incorrect. Always consult a doctor for accurate diagnosis and treatment.' },
    ],
  },
  {
    cat: 'Features',
    items: [
      { q: 'What health tools are available?', a: 'HealthAI includes a BMI Calculator, Water Intake Tracker, Sleep Tracker, Health Analytics, Mental Wellness Assessment, Medicine Reminders, Appointment Scheduler, Family Health Profiles, Disease Library, and Medicine Guide.' },
      { q: 'Can I download my health reports?', a: 'Yes! After completing a symptom analysis, you can generate and download a detailed health report as a text file from the Health Reports page.' },
      { q: 'Does HealthAI support multiple languages?', a: 'The UI supports English, Hindi, and Marathi language selection. Full translation is being rolled out progressively.' },
    ],
  },
  {
    cat: 'Technical',
    items: [
      { q: 'What AI model powers HealthAI?', a: 'HealthAI uses IBM watsonx.ai with the ibm/granite-3-8b-instruct model — a production-grade foundation language model by IBM, optimized for structured and accurate responses.' },
      { q: 'What technologies are used?', a: 'Frontend: React.js with IBM Plex Sans typography. Backend: Python Flask with SQLAlchemy and SQLite. AI: IBM watsonx.ai Granite. Cloud: IBM Cloud Lite.' },
    ],
  },
];

function FAQItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '1rem' }}
      >
        <span style={{ fontWeight: 600, fontSize: '.9rem', color: 'var(--text)' }}>{item.q}</span>
        {open ? <FiChevronUp size={16} style={{ color: 'var(--ibm-blue)', flexShrink: 0 }} /> : <FiChevronDown size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
      </button>
      {open && (
        <div style={{ padding: '0 0 1rem', fontSize: '.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          {item.a}
        </div>
      )}
    </div>
  );
}

function FAQPage() {
  return (
    <div>
      <div className="page-header">
        <h1><FiHelpCircle style={{ color: 'var(--ibm-blue)' }} /> Frequently Asked Questions</h1>
        <p>Everything you need to know about HealthAI.</p>
      </div>

      <div style={{ maxWidth: 760 }}>
        {FAQS.map(cat => (
          <div key={cat.cat} className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-title" style={{ marginBottom: '1rem', color: 'var(--ibm-blue)' }}>{cat.cat}</div>
            {cat.items.map(item => <FAQItem key={item.q} item={item} />)}
          </div>
        ))}

        <div className="disclaimer-box">
          <strong>Still have questions?</strong> HealthAI is an educational tool. For medical questions, always consult a qualified healthcare professional.
        </div>
      </div>
    </div>
  );
}

export default FAQPage;
