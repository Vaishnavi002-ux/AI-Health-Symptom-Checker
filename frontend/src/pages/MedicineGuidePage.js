import React, { useState } from 'react';
import { FiSearch, FiPackage } from 'react-icons/fi';
import { getMedicineInfo } from '../services/api';
import Disclaimer from '../components/Disclaimer';

const POPULAR = [
  'Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Metformin', 'Lisinopril',
  'Omeprazole', 'Atorvastatin', 'Aspirin', 'Cetirizine', 'Azithromycin',
  'Salbutamol', 'Amlodipine', 'Losartan', 'Sertraline', 'Prednisone',
];

function AIContent({ text }) {
  if (!text) return null;
  return (
    <div className="ai-content">
      {text.split('\n').map((line, i) => {
        if (line.startsWith('## ')) return <h2 key={i}><FiPackage size={13} /> {line.replace('## ', '')}</h2>;
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return (
            <p key={i} style={{ paddingLeft: '1rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: 'var(--ibm-blue)' }}>•</span>
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

function MedicineGuidePage() {
  const [query, setQuery]     = useState('');
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [searched, setSearched] = useState('');

  const search = async (med) => {
    const q = (med || query).trim();
    if (!q) return;
    setLoading(true); setError(''); setResult(null); setSearched(q);
    try {
      const data = await getMedicineInfo(q);
      setResult(data.content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1><FiPackage style={{ color: 'var(--ibm-blue)' }} /> Medicine Information Guide</h1>
        <p>Search any medication for educational information about uses, side effects, and warnings. Never self-medicate.</p>
      </div>

      {/* Warning */}
      <div className="alert alert-warning" style={{ marginBottom: '1.25rem' }}>
        ⚠ <strong>Important:</strong> Never self-medicate based on this information. Always consult a licensed doctor or pharmacist before taking any medication.
      </div>

      {/* Search */}
      <div className="search-box">
        <input
          className="search-input"
          type="text"
          placeholder="Search a medication (e.g. Paracetamol, Metformin, Amoxicillin)..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
        />
        <button
          className="btn btn-primary"
          onClick={() => search()}
          disabled={loading || !query.trim()}
        >
          {loading
            ? <span className="spinner" style={{ width:16, height:16, borderWidth:2 }} />
            : <FiSearch size={15} />}
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Popular tags */}
      <div>
        <div style={{ fontSize: '.8rem', color: 'var(--text-secondary)', marginBottom: '.5rem', fontWeight: 600 }}>
          Common Medications
        </div>
        <div className="tag-list">
          {POPULAR.map(m => (
            <button key={m} className="tag" onClick={() => { setQuery(m); search(m); }} disabled={loading}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="alert alert-danger" style={{ marginTop: '1.25rem' }}>{error}</div>}

      {loading && (
        <div className="loading-center">
          <span className="spinner" />
          <p>IBM Granite is retrieving information about <strong>{searched}</strong>...</p>
        </div>
      )}

      {result && !loading && (
        <div className="card" style={{ marginTop: '1.25rem' }}>
          <div className="card-header">
            <div className="card-title"><FiPackage size={16} /> {searched}</div>
            <span className="badge badge-blue">IBM Granite</span>
          </div>
          <AIContent text={result} />
          <hr className="divider" />
          <Disclaimer compact />
        </div>
      )}

      {!loading && !result && !error && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <FiPackage size={40} style={{ opacity: .3, marginBottom: '1rem' }} />
          <p>Search a medication or click a common drug to get started.</p>
        </div>
      )}
    </div>
  );
}

export default MedicineGuidePage;
