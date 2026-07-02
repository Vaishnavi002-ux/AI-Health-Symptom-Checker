import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiSend, FiMic, FiMicOff, FiRefreshCw } from 'react-icons/fi';
import { analyzeSymptoms, sendFollowupAnswer } from '../services/api';
import ProgressStepper from '../components/ProgressStepper';
import ResultsDisplay from '../components/ResultsDisplay';
import Disclaimer from '../components/Disclaimer';

const AI_INTRO = {
  id: 'intro', role: 'ai',
  text: "Hello! I'm your IBM Granite AI Health Assistant. Please describe your symptoms in detail — the more information you provide, the better I can guide you. Remember: I provide educational information only, not medical diagnoses.",
};

function SymptomCheckerPage() {
  const [messages, setMessages]       = useState([AI_INTRO]);
  const [input, setInput]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [session, setSession]         = useState(null);
  const [listening, setListening]     = useState(false);
  const [patientCtx, setPatientCtx]   = useState({ age:'', gender:'', medical_history:'', medications:'' });
  const [showCtx, setShowCtx]         = useState(false);
  const [error, setError]             = useState('');
  const bottomRef  = useRef(null);
  const recogRef   = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  // Voice recognition setup
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.continuous = false; r.interimResults = false; r.lang = 'en-US';
    r.onresult = e => { setInput(p => p + e.results[0][0].transcript + ' '); setListening(false); };
    r.onerror = () => setListening(false);
    r.onend   = () => setListening(false);
    recogRef.current = r;
  }, []);

  const addMsg = useCallback((role, text, extra = {}) => {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), role, text, ...extra }]);
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput(''); setError('');
    addMsg('user', text);
    setLoading(true);

    try {
      let result;
      if (!session) {
        // Build patient context (only include non-empty values)
        const ctx = Object.fromEntries(
          Object.entries(patientCtx).filter(([, v]) => v.trim())
        );
        result = await analyzeSymptoms(text, ctx);
      } else if (session.state === 'collecting') {
        result = await sendFollowupAnswer(session.session_id, text);
      } else {
        return;
      }

      setSession(result);

      if (result.state === 'emergency') {
        addMsg('ai', result.message, { emergency: true });
      } else if (result.state === 'collecting') {
        addMsg('ai', result.message || result.current_question);
      } else if (result.state === 'complete') {
        addMsg('system', '✅ Analysis complete — results are shown below.');
      } else if (result.state === 'error') {
        setError(result.error || 'Analysis failed. Please try again.');
      }
    } catch (err) {
      setError(err.message);
      addMsg('ai', `⚠ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleReset = () => {
    setMessages([AI_INTRO]);
    setSession(null); setInput(''); setError(''); setShowCtx(false);
  };

  const toggleVoice = () => {
    if (!recogRef.current) return;
    if (listening) { recogRef.current.stop(); setListening(false); }
    else           { recogRef.current.start(); setListening(true); }
  };

  const isCollecting = !session || session.state === 'collecting';
  const isComplete   = session?.state === 'complete';
  const isEmergency  = session?.state === 'emergency';

  return (
    <div>
      <div className="page-header">
        <h1>🩺 AI Symptom Checker</h1>
        <p>Describe your symptoms naturally. IBM Granite AI will ask follow-up questions and provide structured health guidance.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isComplete ? '1fr' : 'minmax(0,1fr) minmax(0,320px)', gap: '1.25rem', alignItems: 'start' }}>

        {/* Chat panel */}
        <div>
          <ProgressStepper state={session?.state || 'idle'} />

          {/* Patient context toggle */}
          <div style={{ marginBottom: '1rem' }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setShowCtx(o => !o)}
              style={{ borderColor: 'var(--border)', border: '1px solid' }}
            >
              {showCtx ? '▲ Hide' : '▼ Add'} Patient Details (optional)
            </button>
            {showCtx && (
              <div className="card" style={{ marginTop: '.75rem', padding: '1rem' }}>
                <div className="form-row">
                  {[
                    { key: 'age',            label: 'Age',             ph: 'e.g. 35' },
                    { key: 'gender',         label: 'Biological Sex',  ph: 'Male / Female / Other' },
                    { key: 'medical_history',label: 'Medical History', ph: 'e.g. Diabetes, None' },
                    { key: 'medications',    label: 'Current Meds',    ph: 'e.g. Metformin, None' },
                  ].map(f => (
                    <div className="form-group" key={f.key} style={{ marginBottom: 0 }}>
                      <label className="form-label">{f.label}</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={f.ph}
                        value={patientCtx[f.key]}
                        onChange={e => setPatientCtx(p => ({ ...p, [f.key]: e.target.value }))}
                        disabled={!!session}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Error alert */}
          {error && <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>{error}</div>}

          {/* Chat messages */}
          <div className="chat-container">
            <div className="chat-messages" role="log" aria-live="polite">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`chat-bubble ${
                    msg.role === 'user'    ? 'bubble-user' :
                    msg.emergency         ? 'bubble-emergency' :
                    msg.role === 'system' ? 'bubble-system' :
                    'bubble-ai'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {loading && (
                <div className="chat-bubble bubble-ai" style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  IBM Granite is thinking...
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input area — visible while collecting */}
            {isCollecting && !loading && (
              <div className="chat-input-row">
                <textarea
                  className="chat-textarea"
                  placeholder={session ? 'Type your answer...' : 'Describe your symptoms here...'}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  rows={1}
                />
                {recogRef.current && (
                  <button
                    className="btn btn-ghost btn-icon"
                    onClick={toggleVoice}
                    title={listening ? 'Stop recording' : 'Voice input'}
                    style={{
                      width: 46, height: 46, borderRadius: '50%',
                      border: '1.5px solid var(--border-strong)',
                      background: listening ? 'var(--ibm-red)' : 'transparent',
                      color: listening ? '#fff' : 'var(--text-secondary)',
                    }}
                  >
                    {listening ? <FiMicOff size={16} /> : <FiMic size={16} />}
                  </button>
                )}
                <button
                  className="send-btn"
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                >
                  <FiSend size={16} />
                </button>
              </div>
            )}

            {(isEmergency || isComplete) && (
              <button className="btn btn-secondary" onClick={handleReset} style={{ marginTop: '.75rem' }}>
                <FiRefreshCw size={14} /> Start New Session
              </button>
            )}
          </div>
        </div>

        {/* Sidebar info (only while collecting, not complete) */}
        {!isComplete && (
          <div>
            <div className="card">
              <div className="card-title" style={{ marginBottom: '.75rem' }}>How It Works</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
                {[
                  { n: 1, t: 'Describe Symptoms',   d: 'Type your symptoms naturally' },
                  { n: 2, t: 'AI Follow-up',         d: 'IBM Granite asks clarifying questions' },
                  { n: 3, t: 'Full Analysis',        d: 'Complete symptom analysis' },
                  { n: 4, t: 'Health Guidance',      d: 'Structured recommendations' },
                ].map(step => (
                  <div key={step.n} style={{ display: 'flex', gap: '.75rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%', background: 'var(--ibm-blue)',
                      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '.75rem', fontWeight: 700, flexShrink: 0
                    }}>{step.n}</div>
                    <div>
                      <div style={{ fontSize: '.85rem', fontWeight: 700 }}>{step.t}</div>
                      <div style={{ fontSize: '.78rem', color: 'var(--text-secondary)' }}>{step.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: '.75rem' }}>
              <Disclaimer compact />
            </div>
          </div>
        )}
      </div>

      {/* Results panel */}
      {isComplete && (
        <div style={{ marginTop: '1.25rem' }}>
          <ResultsDisplay sessionState={session} onReset={handleReset} />
        </div>
      )}
    </div>
  );
}

export default SymptomCheckerPage;
