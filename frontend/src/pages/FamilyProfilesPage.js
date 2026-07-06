import React, { useState } from 'react';
import { FiUsers, FiPlus, FiEdit2, FiTrash2, FiUser } from 'react-icons/fi';

const RELATIONS = ['Self','Spouse','Child','Parent','Sibling','Other'];

function FamilyProfilesPage() {
  const [profiles, setProfiles] = useState([
    { id: 1, name: 'John Doe', relation: 'Self', age: 35, bloodType: 'A+', conditions: 'None', medications: 'None', allergies: 'Penicillin' },
  ]);
  const [form, setForm]   = useState({ name: '', relation: 'Self', age: '', bloodType: '', conditions: '', medications: '', allergies: '' });
  const [adding, setAdding] = useState(false);

  const BLOOD_TYPES = ['A+','A-','B+','B-','AB+','AB-','O+','O-','Unknown'];

  const add = () => {
    if (!form.name) return;
    setProfiles(p => [...p, { ...form, id: Date.now() }]);
    setForm({ name: '', relation: 'Self', age: '', bloodType: '', conditions: '', medications: '', allergies: '' });
    setAdding(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1><FiUsers style={{ color: 'var(--ibm-teal)' }} /> Family Health Profiles</h1>
        <p>Keep health records for your entire family in one secure place.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>Family Members ({profiles.length})</h2>
        <button className="btn btn-primary btn-sm" style={{ background: 'var(--ibm-teal)', borderColor: 'var(--ibm-teal)' }} onClick={() => setAdding(a => !a)}>
          <FiPlus size={14} /> Add Member
        </button>
      </div>

      {adding && (
        <div className="card card-accent-teal" style={{ marginBottom: '1.5rem' }}>
          <div className="card-title" style={{ marginBottom: '1rem' }}>Add Family Member</div>
          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name</label>
              <input className="form-control" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Relation</label>
              <select className="form-control" value={form.relation} onChange={e => setForm(f => ({ ...f, relation: e.target.value }))}>
                {RELATIONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row" style={{ marginTop: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Age</label>
              <input className="form-control" type="number" placeholder="Age" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Blood Type</label>
              <select className="form-control" value={form.bloodType} onChange={e => setForm(f => ({ ...f, bloodType: e.target.value }))}>
                {BLOOD_TYPES.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Medical Conditions</label>
            <input className="form-control" placeholder="e.g. Diabetes, None" value={form.conditions} onChange={e => setForm(f => ({ ...f, conditions: e.target.value }))} />
          </div>
          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Current Medications</label>
              <input className="form-control" placeholder="e.g. Metformin, None" value={form.medications} onChange={e => setForm(f => ({ ...f, medications: e.target.value }))} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Allergies</label>
              <input className="form-control" placeholder="e.g. Penicillin, None" value={form.allergies} onChange={e => setForm(f => ({ ...f, allergies: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '.75rem', marginTop: '1rem' }}>
            <button className="btn btn-primary" style={{ background: 'var(--ibm-teal)', borderColor: 'var(--ibm-teal)' }} onClick={add} disabled={!form.name}>Save Profile</button>
            <button className="btn btn-ghost" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.25rem' }}>
        {profiles.map(p => (
          <div key={p.id} className="card card-accent-teal">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--ibm-teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                {p.relation === 'Child' ? '👶' : p.relation === 'Self' ? '👤' : '👥'}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem' }}>{p.name}</div>
                <span className="badge badge-teal">{p.relation}</span>
              </div>
              <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto', color: 'var(--ibm-red)' }} onClick={() => setProfiles(pp => pp.filter(x => x.id !== p.id))}><FiTrash2 size={14} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', fontSize: '.82rem' }}>
              {[['Age', p.age || '—'], ['Blood Type', p.bloodType || '—'], ['Conditions', p.conditions || 'None'], ['Medications', p.medications || 'None'], ['Allergies', p.allergies || 'None']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: '1rem' }}>
                  <span style={{ color: 'var(--text-secondary)', minWidth: 90, fontWeight: 600 }}>{k}:</span>
                  <span style={{ color: 'var(--text)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FamilyProfilesPage;
