import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

function Disclaimer({ compact = false }) {
  return (
    <div className="disclaimer-box" role="note">
      <strong>
        <FiAlertTriangle style={{ marginRight: '.35rem', verticalAlign: 'middle' }} />
        Medical Disclaimer
      </strong>
      {compact ? (
        <span style={{ marginLeft: '.35rem' }}>
          For educational purposes only. Not a substitute for professional medical advice.{' '}
          <strong>Always consult a qualified healthcare professional.</strong>
        </span>
      ) : (
        <p style={{ marginTop: '.3rem', marginBottom: 0 }}>
          This application provides general health education only. It does <strong>not</strong>{' '}
          diagnose diseases, prescribe medications, or replace professional medical advice.
          Responses are AI-generated and may not be accurate.{' '}
          <strong>Always seek advice from a licensed healthcare provider</strong> for any medical
          concern. For emergencies, call 911 / 999 / 112 immediately.
        </p>
      )}
    </div>
  );
}

export default Disclaimer;
