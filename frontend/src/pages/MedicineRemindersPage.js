import React, { useState } from 'react';
import { FiCalendar, FiBell, FiPlus, FiTrash2, FiClock } from 'react-icons/fi';

function MedicineRemindersPage() {
  const [reminders, setReminders] = useState([
    { id: 1, name: 'Metformin 500mg', time: '08:00', freq: 'Daily', notes: 'Take with breakfast' },
    { id: 2, name: 'Lisinopril 10mg', time: '20:00', freq: 'Daily', notes: 'Take at night' },
  ]);
  const [form, setForm] = useState({ name: '', time: '', freq: 'Daily', notes: '' });
  const [adding, setAdding] = useState(false);

  const add = () => {
    if (!form.name || !form.time) return;
    setReminders(r => [...r, { ...form, id: Date.now() }]);
    setForm({ name: '', time: '', freq: 'Daily', notes: '' });
    setAdding(false);
  };

  const remove = (id) => setReminders(r => r.filter(x => x.id !== id));

  const FREQS = ['Daily', 'Twice Daily', 'Weekly', 'As Needed'];

  return (
    <div>
      <div className="page-header">
        <h1><FiBell style={{ color: 'var(--ibm-orange)' }} /> Medicine Reminders</h1>
        <p>Set reminders for your medications. Note: This is an educational tracker, not a medical device.</p>
      </div>

      <div style={{ maxWidth: 700 }}>
        <div className="alert alert-warning">
          ⚕ Always follow your doctor's prescribed dosage and schedule. This tool is for tracking purposes only.
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Your Reminders ({reminders.length})</h2>
          <button className="btn btn-primary btn-sm" onClick={() => setAdding(a => !a)}>
            <FiPlus size={14} /> Add Reminder
          </button>
        </div>

        {adding && (
          <div className="card card-accent-orange" style={{ marginBottom: '1.25rem' }}>
            <div className="card-title" style={{ marginBottom: '1rem' }}><FiPlus size={16} /> New Reminder</div>
            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Medicine Name</label>
                <input className="form-control" placeholder="e.g. Aspirin 100mg" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Time</label>
                <input className="form-control" type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Frequency</label>
              <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                {FREQS.map(f => (
                  <button key={f} className={`btn btn-sm ${form.freq === f ? 'btn-primary' : 'btn-outline-gray'}`} onClick={() => setForm(x => ({ ...x, freq: f }))}>{f}</button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <input className="form-control" placeholder="e.g. Take with food" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: '.75rem' }}>
              <button className="btn btn-primary" onClick={add} disabled={!form.name || !form.time}>Save Reminder</button>
              <button className="btn btn-ghost" onClick={() => setAdding(false)}>Cancel</button>
            </div>
          </div>
        )}

        {reminders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <FiBell size={40} style={{ opacity: .3, marginBottom: '1rem' }} />
            <p>No reminders yet. Add your first medicine reminder.</p>
          </div>
        ) : (
          reminders.map(r => (
            <div key={r.id} className="history-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--r-md)', background: 'var(--ibm-orange-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>💊</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '.9rem' }}>{r.name}</div>
                <div style={{ fontSize: '.78rem', color: 'var(--text-secondary)', marginTop: '.2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <span><FiClock size={11} /> {r.time}</span>
                  <span>🔁 {r.freq}</span>
                  {r.notes && <span>📝 {r.notes}</span>}
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => remove(r.id)} style={{ color: 'var(--ibm-red)' }}><FiTrash2 size={15} /></button>
            </div>
          ))
        )}

        <div className="disclaimer-box" style={{ marginTop: '1.5rem' }}>
          This reminder tool is for personal tracking only. Always follow your doctor's prescribed medication schedule.
        </div>
      </div>
    </div>
  );
}

export default MedicineRemindersPage;
