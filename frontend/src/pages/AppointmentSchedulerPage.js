import React, { useState } from 'react';
import { FiCalendar, FiPlus, FiTrash2, FiClock } from 'react-icons/fi';

const DOCTORS = ['General Physician','Cardiologist','Dermatologist','Orthopedist','Neurologist','ENT Specialist','Gynecologist','Pediatrician','Psychiatrist'];

function AppointmentSchedulerPage() {
  const [appointments, setAppointments] = useState([
    { id: 1, doctor: 'Dr. Rajesh Sharma', specialty: 'General Physician', date: '2025-08-15', time: '10:30', notes: 'Annual checkup', status: 'upcoming' },
  ]);
  const [form, setForm]   = useState({ doctor: '', specialty: 'General Physician', date: '', time: '', notes: '' });
  const [adding, setAdding] = useState(false);

  const add = () => {
    if (!form.doctor || !form.date || !form.time) return;
    setAppointments(a => [...a, { ...form, id: Date.now(), status: 'upcoming' }]);
    setForm({ doctor: '', specialty: 'General Physician', date: '', time: '', notes: '' });
    setAdding(false);
  };

  const remove = id => setAppointments(a => a.filter(x => x.id !== id));

  return (
    <div>
      <div className="page-header">
        <h1><FiCalendar style={{ color: '#8a3ffc' }} /> Appointment Scheduler</h1>
        <p>Schedule and track your medical appointments. This is a personal organizer, not a booking system.</p>
      </div>
      <div style={{ maxWidth: 750 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Appointments ({appointments.length})</h2>
          <button className="btn btn-primary btn-sm" style={{ background: '#8a3ffc', borderColor: '#8a3ffc' }} onClick={() => setAdding(a => !a)}>
            <FiPlus size={14} /> Schedule
          </button>
        </div>

        {adding && (
          <div className="card card-accent-purple" style={{ marginBottom: '1.25rem' }}>
            <div className="card-title" style={{ marginBottom: '1rem' }}><FiPlus size={16} /> New Appointment</div>
            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Doctor's Name</label>
                <input className="form-control" placeholder="e.g. Dr. Smith" value={form.doctor} onChange={e => setForm(f => ({ ...f, doctor: e.target.value }))} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Specialty</label>
                <select className="form-control" value={form.specialty} onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))}>
                  {DOCTORS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row" style={{ marginTop: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Date</label>
                <input className="form-control" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Time</label>
                <input className="form-control" type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Notes</label>
              <input className="form-control" placeholder="Reason for visit..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: '.75rem' }}>
              <button className="btn btn-primary" style={{ background: '#8a3ffc', borderColor: '#8a3ffc' }} onClick={add} disabled={!form.doctor || !form.date || !form.time}>Save</button>
              <button className="btn btn-ghost" onClick={() => setAdding(false)}>Cancel</button>
            </div>
          </div>
        )}

        {appointments.map(a => (
          <div key={a.id} className="history-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--r-md)', background: 'var(--ibm-purple-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>🩺</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '.9rem' }}>{a.doctor}</div>
              <div style={{ fontSize: '.78rem', color: 'var(--text-secondary)', marginTop: '.2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <span>🏥 {a.specialty}</span>
                <span><FiCalendar size={11} /> {a.date}</span>
                <span><FiClock size={11} /> {a.time}</span>
              </div>
              {a.notes && <div style={{ fontSize: '.74rem', color: 'var(--text-muted)', marginTop: '.2rem' }}>📝 {a.notes}</div>}
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => remove(a.id)} style={{ color: 'var(--ibm-red)' }}><FiTrash2 size={14} /></button>
          </div>
        ))}

        {appointments.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <FiCalendar size={40} style={{ opacity: .3, marginBottom: '1rem' }} />
            <p>No appointments scheduled yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AppointmentSchedulerPage;
