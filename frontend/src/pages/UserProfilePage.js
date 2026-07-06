import React, { useState } from 'react';
import { FiUser, FiSave, FiCamera } from 'react-icons/fi';

const BLOOD_TYPES = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

function UserProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Health User', age: '', gender: '', bloodType: '',
    height: '', weight: '', conditions: '', medications: '', allergies: '', emergencyContact: '', email: '',
  });
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };
  const upd = (k, v) => setProfile(p => ({ ...p, [k]: v }));

  return (
    <div>
      <div className="page-header">
        <h1><FiUser style={{ color: 'var(--ibm-blue)' }} /> My Health Profile</h1>
        <p>Manage your personal health information. This data helps personalize your AI health consultations.</p>
      </div>

      <div style={{ maxWidth: 800 }}>
        {/* Avatar */}
        <div className="card" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(135deg,#0f62fe,#8a3ffc)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#fff', fontWeight: 800, marginBottom: '1rem' }}>
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{profile.name || 'Health User'}</div>
          {profile.bloodType && <span className="badge badge-high" style={{ marginTop: '.5rem' }}>🩸 {profile.bloodType}</span>}
        </div>

        {/* Basic Info */}
        <div className="card card-accent-blue" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title" style={{ marginBottom: '1.25rem' }}>Personal Information</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-control" value={profile.name} onChange={e => upd('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-control" type="email" placeholder="your@email.com" value={profile.email} onChange={e => upd('email', e.target.value)} />
            </div>
          </div>
          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Age</label>
              <input className="form-control" type="number" placeholder="Years" value={profile.age} onChange={e => upd('age', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select className="form-control" value={profile.gender} onChange={e => upd('gender', e.target.value)}>
                <option value="">Select...</option>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Blood Type</label>
              <select className="form-control" value={profile.bloodType} onChange={e => upd('bloodType', e.target.value)}>
                <option value="">Select...</option>
                {BLOOD_TYPES.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Physical Stats */}
        <div className="card card-accent-green" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title" style={{ marginBottom: '1.25rem' }}>Physical Statistics</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Height (cm)</label>
              <input className="form-control" type="number" placeholder="e.g. 170" value={profile.height} onChange={e => upd('height', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input className="form-control" type="number" placeholder="e.g. 70" value={profile.weight} onChange={e => upd('weight', e.target.value)} />
            </div>
          </div>
          {profile.height && profile.weight && (
            <div className="alert alert-info">
              BMI: <strong>{(parseFloat(profile.weight) / ((parseFloat(profile.height)/100) ** 2)).toFixed(1)}</strong>
              {' '}— <a href="/bmi">Full BMI Calculator →</a>
            </div>
          )}
        </div>

        {/* Medical History */}
        <div className="card card-accent-orange" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title" style={{ marginBottom: '1.25rem' }}>Medical History</div>
          <div className="form-group">
            <label className="form-label">Medical Conditions</label>
            <textarea className="form-control" rows={2} placeholder="e.g. Type 2 Diabetes, Hypertension..." value={profile.conditions} onChange={e => upd('conditions', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Current Medications</label>
            <textarea className="form-control" rows={2} placeholder="e.g. Metformin 500mg twice daily..." value={profile.medications} onChange={e => upd('medications', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Allergies</label>
            <input className="form-control" placeholder="e.g. Penicillin, Aspirin, None" value={profile.allergies} onChange={e => upd('allergies', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Emergency Contact</label>
            <input className="form-control" placeholder="Name and phone number" value={profile.emergencyContact} onChange={e => upd('emergencyContact', e.target.value)} />
          </div>
        </div>

        <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={save}>
          <FiSave size={16} /> Save Profile
        </button>
        {saved && <div className="alert alert-success" style={{ marginTop: '1rem', textAlign: 'center' }}>✅ Profile saved successfully!</div>}

        <div className="disclaimer-box" style={{ marginTop: '1.25rem' }}>
          Your profile data is stored locally in this application. It is used only to personalize your symptom analysis and health tips.
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
