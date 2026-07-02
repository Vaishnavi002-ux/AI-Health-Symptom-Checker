import React from 'react';
import { Link } from 'react-router-dom';
import { FiActivity, FiAlertTriangle } from 'react-icons/fi';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div>
            <div className="footer-brand">
              <FiActivity style={{ marginRight: '0.3rem' }} />
              HealthAI
            </div>
            <div className="footer-tagline">
              Agentic AI Health Symptom Checker · Powered by IBM watsonx.ai Granite
            </div>
          </div>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/checker">Symptom Checker</Link></li>
            <li><Link to="/emergency">Emergency</Link></li>
            <li><Link to="/history">History</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-bottom">
          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <FiAlertTriangle style={{ color: '#f9a825' }} />
            <strong>Educational purposes only.</strong> Not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            © {new Date().getFullYear()} HealthAI Symptom Checker. Built with IBM watsonx.ai Granite on IBM Cloud Lite.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
