import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiAlertTriangle, FiNavigation } from 'react-icons/fi';

const HOSPITAL_DATA = [
  { name: 'City General Hospital', type: 'Government', distance: '1.2 km', phone: '911', emergency: true, rating: '4.2' },
  { name: 'Apollo Hospitals', type: 'Private', distance: '2.8 km', phone: '+1-800-APOLLO', emergency: true, rating: '4.7' },
  { name: 'Fortis Healthcare', type: 'Private', distance: '3.5 km', phone: '+1-800-FORTIS', emergency: true, rating: '4.5' },
  { name: 'Primary Health Centre', type: 'Government', distance: '0.8 km', phone: '108', emergency: false, rating: '3.8' },
  { name: 'St. Mary Medical Center', type: 'Private', distance: '4.1 km', phone: '+1-800-STMARY', emergency: true, rating: '4.4' },
];

function NearbyHospitalsPage() {
  return (
    <div>
      <div className="emergency-top-banner">
        🚨 In a medical emergency, CALL 911 / 999 / 112 immediately. Do not search for hospitals.
      </div>

      <div className="page-header">
        <h1><FiMapPin style={{ color: 'var(--ibm-red)' }} /> Nearby Hospitals</h1>
        <p>Find medical facilities near you. For emergencies, always call emergency services first.</p>
      </div>

      <div className="alert alert-info">
        <FiNavigation size={16} style={{ marginRight: '.5rem' }} />
        <strong>Note:</strong> This shows sample hospital data. In the production version, this integrates with Google Maps API to show real nearby hospitals based on your location.
      </div>

      {/* Emergency Numbers */}
      <div className="card card-accent-red" style={{ marginBottom: '2rem' }}>
        <div className="card-title" style={{ marginBottom: '1.25rem', color: 'var(--ibm-red)' }}><FiPhone size={16} /> Emergency Numbers</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '1rem' }}>
          {[['USA', '911'],['UK', '999'],['EU', '112'],['India', '108'],['Australia', '000'],['Canada', '911']].map(([r, n]) => (
            <div key={r} className="emergency-number-card">
              <div className="emergency-number">{n}</div>
              <div className="emergency-region">{r}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Hospital List */}
      <h2 className="section-title">Hospitals Near You</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(310px,1fr))', gap: '1.25rem' }}>
        {HOSPITAL_DATA.map((h, i) => (
          <div key={i} className="card feature-card" style={{ borderLeft: h.emergency ? '3px solid var(--ibm-red)' : '3px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '.75rem' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '.95rem', color: 'var(--text)' }}>{h.name}</div>
                <div style={{ fontSize: '.78rem', color: 'var(--text-secondary)', marginTop: '.2rem' }}>{h.type}</div>
              </div>
              {h.emergency && <span className="badge badge-high">Emergency</span>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem', fontSize: '.82rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}><FiMapPin size={13} /> {h.distance} away</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}><FiPhone size={13} /> {h.phone}</div>
              <div>⭐ {h.rating} / 5.0</div>
            </div>
            <div style={{ display: 'flex', gap: '.5rem', marginTop: '1rem' }}>
              <a href={`tel:${h.phone}`} className="btn btn-sm btn-danger" style={{ flex: 1, justifyContent: 'center' }}><FiPhone size={13} /> Call</a>
              <a href={`https://www.google.com/maps/search/${encodeURIComponent(h.name)}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-gray" style={{ flex: 1, justifyContent: 'center' }}><FiMapPin size={13} /> Directions</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NearbyHospitalsPage;
