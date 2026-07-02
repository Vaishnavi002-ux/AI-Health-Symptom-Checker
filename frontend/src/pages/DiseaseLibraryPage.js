import React, { useState } from 'react';
import { FiSearch, FiBook, FiLoader } from 'react-icons/fi';
import { getDiseaseInfo } from '../services/api';
import Disclaimer from '../components/Disclaimer';

const POPULAR = [
  'Diabetes', 'Hypertension', 'Asthma', 'Migraine', 'Arthritis',
  'Pneumonia', 'Anemia', 'Thyroid disorders', 'COVID-19', 'Depression',
  'Appendicitis', 'Kidney stones', 'GERD', 'Eczema', 'Sinusitis',
];

function AIContent({ text }) {
  if (!text) return null;
  // Convert ## headers and bullet lists to styled HTML
  const lines = text.split('\n');
  return (
    <div className="ai-content">
      {lines.map((line, i) => {
        if (line.startsWith('## ')) {
          return <h2 key={i}><FiBook size={14} /> {line.replace('## ', '')}</h2>;
        }
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return <p key={i} style={{ paddingLeft: '1rem', position: 'relative' }}>
            <span style={{ position: 'absolute', left: 0, color: 'var(--ibm-blue)' }}>•</span>
            {line.slice(2)}
          </p>;
        }
        if (line.trim()) return <p key={i}>{line}</p>;
        return null;
      })}
    </div>
  );
}

function DiseaseLibraryPage() {
  const [query, setQuery]     = useState('');
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [searched, setSearched] = useState('');

  const search = async (disease) => {
    const q = (disease || query).trim();
    if (!q) return;
    setLoading(true); setError(''); setResult(null); setSearched(q);
    try {
      const data = await getDiseaseInfo(q);
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
        <h1><FiBook style={{ color: 'var(--ibm-blue)' }} /> Disease Information Library</h1>
        <p>Search any disease or health condition. IBM Granite provides structured educational information.</p>
      </div>

      {/* Search */}
      <div className="search-box">
        <input
          className="search-input"
          type="text"
          placeholder="Search a disease or condition (e.g. Diabetes, Asthma, Migraine)..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
        />
        <button
          className="btn btn-primary"
          onClick={() => search()}
          disabled={loading || !query.trim()}
        >
          {loading ? <span className="spinner" style={{ width:16, height:16, borderWidth:2 }} /> : <FiSearch size={15} />}
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Popular tags */}
      <div>
        <div style={{ fontSize: '.8rem', color: 'var(--text-secondary)', marginBottom: '.5rem', fontWeight: 600 }}>
          Popular Conditions
        </div>
        <div className="tag-list">
          {POPULAR.map(d => (
            <button
              key={d}
              className="tag"
              onClick={() => { setQuery(d); search(d); }}
              disabled={loading}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && <div className="alert alert-danger" style={{ marginTop: '1.25rem' }}>{error}</div>}

      {/* Loading */}
      {loading && (
        <div className="loading-center">
          <span className="spinner" />
          <p>IBM Granite is retrieving information about <strong>{searched}</strong>...</p>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="card" style={{ marginTop: '1.25rem' }}>
          <div className="card-header">
            <div className="card-title">
              <FiBook size={16} /> {searched}
            </div>
            <span className="badge badge-blue">IBM Granite</span>
          </div>
          <AIContent text={result} />
          <hr className="divider" />
          <Disclaimer compact />
        </div>
      )}

      {!loading && !result && !error && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <FiBook size={40} style={{ opacity: .3, marginBottom: '1rem' }} />
          <p>Search a disease or click a popular condition to get started.</p>
        </div>
      )}
    </div>
  );
}

export default DiseaseLibraryPage;
