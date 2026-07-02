import React from 'react';

const STEPS = [
  { label: 'Symptoms' },
  { label: 'Follow-up' },
  { label: 'Analysis' },
  { label: 'Results' },
];

function getIdx(state) {
  switch (state) {
    case 'collecting': return 1;
    case 'ready_to_analyze': return 2;
    case 'complete': return 3;
    case 'emergency': return 3;
    default: return 0;
  }
}

function ProgressStepper({ state }) {
  const activeIdx = getIdx(state);

  return (
    <div className="stepper">
      {STEPS.map((step, idx) => {
        const isDone   = idx < activeIdx;
        const isActive = idx === activeIdx;
        return (
          <React.Fragment key={step.label}>
            <div className={`step-item ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}
              style={{ flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div className="step-dot">
                {isDone ? '✓' : idx + 1}
              </div>
              <div className="step-label">{step.label}</div>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`step-line ${isDone ? 'done' : ''}`} style={{ flex: 1, alignSelf: 'flex-start', marginTop: 14 }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default ProgressStepper;
