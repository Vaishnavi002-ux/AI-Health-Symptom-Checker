import React, { useState } from 'react';
import { FiHeart, FiRefreshCw } from 'react-icons/fi';
import { getHealthTips } from '../services/api';
import Disclaimer from '../components/Disclaimer';

const CATEGORIES = [
  { label: 'General Wellness',    icon: '🌿', value: 'general wellness'     },
  { label: 'Nutrition & Diet',    icon: '🥗', value: 'nutrition and diet'   },
  { label: 'Exercise & Fitness',  icon: '🏃', value: 'exercise and fitness' },
  { label: 'Mental Health',       icon: '🧘', value: 'mental health'        },
  { label: 'Sleep Hygiene',       icon: '😴', value: 'sleep hygiene'        },
  { label: 'Heart Health',        icon: '❤️', value: 'heart health'         },
  { label: 'Diabetes Management', icon: '💉', value: 'diabetes management'  },
  { label: 'Immune System',       icon: '🛡️', value: 'immune system boost'  },
  { label: 'Skin Care',           icon: '✨', value: 'skin care'             },
  { label: 'Bone & Joint Health', icon: '🦴', value: 'bone and joint health'},
];

function AIContent({ text }) {
  if (!text) return null;
  return (
    <div className="ai-content">
      {text.split('\n').map((line, i) => {
        if (line.startsWith('## ')) return <h2 key={i}>{line.replace('## ', '')}</h2>;
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return (
            <p key={i} style={{ paddingLeft: '1rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: 'var(--ibm-green)' }}>•</span>
              {line.slice(2)}
            </p>
          );
        }
        if (line.trim()) return <p key={i}>{line}</p>;
        return null;
      })}
    </div>
  );
}

function HealthTipsPage() {
  const [selected, setSelected]   = useState(null);
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [age, setAge]             = useState('');
  const [gender, setGender]       = useState('');

  const fetchTips = async (cat) => {
    setSelected(cat);
    setLoading(true); setError(''); setResult(null);
    try {
      const data = await getHealthTips(cat.value, age, gender);
      setResult(data.tips);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1><FiHeart style={{ color: 'var(--ibm-red)' }} /> Health Tips</h1>
        <p>Select a wellness category to get personalized, AI-generated health tips from IBM Granite.</p>
      </div>

      {/* Optional personalization */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '1rem' }}>
        <div style={{ fontWeight: 700, fontSize: '.85rem', marginBottom: '.65rem', color: 'var(--text-secondary)' }}>
          Personalize Tips (optional)
        </div>
        <div className="form-row">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Age</label>
            <input
              className="form-control"
              type="text"
              placeholder="e.g. 35"
              value={age}
              onChange={e => setAge(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Biological Sex</label>
            <select className="form-control" value={gender} onChange={e => setGender(e.target.value)}>
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => fetchTips(cat)}
            disabled={loading}
            style={{
              background: selected?.value === cat.value ? 'var(--ibm-blue-light)' : 'var(--surface)',
              border: selected?.value === cat.value ? '2px solid var(--ibm-blue)' : '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem .75rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all .15s',
            }}
          >
            <div style={{ fontSize: '1.6rem', marginBottom: '.4rem' }}>{cat.icon}</div>
            <div style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--text)' }}>{cat.label}</div>
          </button>
        ))}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading && (
        <div className="loading-center">
          <span className="spinner" />
          <p>IBM Granite is generating tips for <strong>{selected?.label}</strong>...</p>
        </div>
      )}

      {result && !loading && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              {selected?.icon} {selected?.label} Tips
            </div>
            <div style={{ display: 'flex', gap: '.5rem' }}>
              <span className="badge badge-blue">IBM Granite</span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => fetchTips(selected)}
                title="Refresh tips"
              >
                <FiRefreshCw size={13} /> Refresh
              </button>
            </div>
          </div>
          <AIContent text={result} />
          <hr className="divider" />
          <Disclaimer compact />
        </div>
      )}

      {!loading && !result && !error && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
          <FiHeart size={36} style={{ opacity: .3, marginBottom: '1rem' }} />
          <p>Select a category above to generate health tips.</p>
        </div>
      )}
    </div>
  );
}

export default HealthTipsPage;
