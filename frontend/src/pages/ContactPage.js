import React, { useState } from 'react';
import { FiMail, FiGithub, FiAlertTriangle, FiSend } from 'react-icons/fi';

function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, wire this to an email service (e.g. SendGrid, Formspree).
    setSubmitted(true);
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: 720 }}>
      <h1 className="section-title">Contact Us</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
        Have questions, feedback, or want to report an issue? We'd love to hear from you.
      </p>

      {/* Contact cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <FiMail size={24} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
          <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Email</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            healthai@example.com
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <FiGithub size={24} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
          <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>GitHub</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            github.com/healthai-checker
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center', background: '#fff8e1', borderColor: '#f9a825' }}>
          <FiAlertTriangle size={24} style={{ color: '#f9a825', marginBottom: '0.5rem' }} />
          <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Medical Emergency</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Call 911 / 999 / 112 immediately
          </div>
        </div>
      </div>

      {/* Contact form */}
      {submitted ? (
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ marginBottom: '0.5rem' }}>Message Sent!</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Thank you for reaching out. We'll get back to you shortly.
          </p>
          <button
            className="btn btn-primary"
            style={{ marginTop: '1.5rem' }}
            onClick={() => { setForm({ name: '', email: '', subject: '', message: '' }); setSubmitted(false); }}
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Send a Message</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Your Name *</label>
              <input
                className="form-control"
                type="text"
                name="name"
                placeholder="Jane Doe"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                className="form-control"
                type="email"
                name="email"
                placeholder="jane@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Subject *</label>
            <input
              className="form-control"
              type="text"
              name="subject"
              placeholder="Feedback, question, or issue report"
              value={form.subject}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Message *</label>
            <textarea
              className="form-control"
              name="message"
              rows={5}
              placeholder="Write your message here..."
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{
            background: '#fff8e1', borderRadius: '8px', padding: '0.75rem 1rem',
            fontSize: '0.82rem', color: '#5d4037', marginBottom: '1rem'
          }}>
            <FiAlertTriangle style={{ marginRight: '0.4rem', verticalAlign: 'middle', color: '#f9a825' }} />
            Do not send medical questions through this form. This is for feedback and technical inquiries only.
            For medical emergencies, call your local emergency number immediately.
          </div>
          <button type="submit" className="btn btn-primary">
            <FiSend /> Send Message
          </button>
        </form>
      )}
    </div>
  );
}

export default ContactPage;
