import React, { useState } from 'react';
import { FiTrendingUp, FiInfo } from 'react-icons/fi';

const BMI_CATEGORIES = [
  { range: '< 18.5',   label: 'Underweight', color: '#0ea5e9', bg: '#eff6ff' },
  { range: '18.5–24.9',label: 'Normal',      color: '#22c55e', bg: '#f0fdf4' },
  { range: '25–29.9',  label: 'Overweight',  color: '#ff832b', bg: '#fff7ed' },
  { range: '≥ 30',     label: 'Obese',       color: '#da1e28', bg: '#fef2f2' },
];

function BMIPage() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [unit, setUnit]     = useState('metric');
  const [result, setResult] = useState(null);

  const calculate = () => {
    let w = parseFloat(weight);
    let h = parseFloat(height);
    if (!w || !h || w <= 0 || h <= 0) return;
    let bmi;
    if (unit === 'metric') {
      bmi = w / ((h / 100) ** 2);
    } else {
      bmi = (703 * w) / (h ** 2);
    }
    bmi = Math.round(bmi * 10) / 10;
    let cat;
    if (bmi < 18.5) cat = BMI_CATEGORIES[0];
    else if (bmi < 25) cat = BMI_CATEGORIES[1];
    else if (bmi < 30) cat = BMI_CATEGORIES[2];
    else cat = BMI_CATEGORIES[3];
    setResult({ bmi, cat });
  };

  return (
    <div>
      <div className="page-header">
        <h1><FiTrendingUp style={{ color: 'var(--medical-green)' }} /> BMI Calculator</h1>
        <p>Calculate your Body Mass Index (BMI) — an educational indicator of healthy weight range.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: 800 }}>
        {/* Calculator */}
        <div className="card card-accent-green">
          <div className="card-header">
            <div className="card-title"><FiTrendingUp size={16} /> BMI Calculator</div>
            <div style={{ display: 'flex', gap: '.5rem' }}>
              {['metric','imperial'].map(u => (
                <button key={u} className={`btn btn-sm ${unit === u ? 'btn-primary' : 'btn-outline-gray'}`} onClick={() => setUnit(u)}>
                  {u === 'metric' ? 'Metric (kg/cm)' : 'Imperial (lb/in)'}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
            <input className="form-control" type="number" min="1" placeholder={unit === 'metric' ? 'e.g. 70' : 'e.g. 154'} value={weight} onChange={e => setWeight(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Height ({unit === 'metric' ? 'cm' : 'inches'})</label>
            <input className="form-control" type="number" min="1" placeholder={unit === 'metric' ? 'e.g. 170' : 'e.g. 67'} value={height} onChange={e => setHeight(e.target.value)} />
          </div>
          <button className="btn btn-success btn-lg" style={{ width: '100%' }} onClick={calculate} disabled={!weight || !height}>
            Calculate BMI
          </button>

          {result && (
            <div style={{ marginTop: '1.5rem', textAlign: 'center', padding: '1.5rem', background: result.cat.bg, borderRadius: 'var(--r-lg)', border: `2px solid ${result.cat.color}` }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: result.cat.color, lineHeight: 1 }}>{result.bmi}</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: result.cat.color, marginTop: '.375rem' }}>{result.cat.label}</div>
              <div style={{ fontSize: '.82rem', color: 'var(--text-secondary)', marginTop: '.5rem' }}>Your BMI is {result.bmi}</div>
            </div>
          )}
        </div>

        {/* BMI Reference */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: '1.25rem' }}><FiInfo size={16} /> BMI Reference Chart</div>
          {BMI_CATEGORIES.map(cat => (
            <div key={cat.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '.75rem', background: result?.cat.label === cat.label ? cat.bg : 'transparent', borderRadius: 'var(--r-sm)', border: `1px solid ${result?.cat.label === cat.label ? cat.color : 'transparent'}`, marginBottom: '.5rem', transition: 'all .2s' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '.875rem', color: cat.color }}>{cat.label}</div>
                <div style={{ fontSize: '.78rem', color: 'var(--text-secondary)' }}>BMI {cat.range}</div>
              </div>
              {result?.cat.label === cat.label && <span className="badge" style={{ background: cat.color, color: '#fff' }}>Your Range</span>}
            </div>
          ))}

          <div className="disclaimer-box" style={{ marginTop: '1rem', fontSize: '.76rem' }}>
            BMI is a general educational indicator. It does not account for muscle mass, age, or other health factors. Consult your doctor for a complete assessment.
          </div>
        </div>
      </div>
    </div>
  );
}

export default BMIPage;
