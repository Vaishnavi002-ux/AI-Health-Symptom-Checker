import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiSend, FiMic, FiMicOff } from 'react-icons/fi';
import { analyzeSymptoms, sendFollowupAnswer } from '../services/api';
import ProgressStepper from './ProgressStepper';
import ResultsDisplay from './ResultsDisplay';
import Disclaimer from './Disclaimer';

const INTRO_MSG = {
  id: 'intro',
  role: 'ai',
  text: "Hello! I'm HealthAI, your AI health education assistant powered by IBM Granite. Please describe your symptoms in as much detail as possible, and I'll help guide you. Remember: I provide educational information only — not medical diagnoses.",
};

function ChatInterface() {
  const [messages, setMessages] = useState([INTRO_MSG]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionState, setSessionState] = useState(null);
  const [listening, setListening] = useState(false);
  const [patientCtx, setPatientCtx] = useState({});
  const [showCtx, setShowCtx] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // ---------------------------------------------------------------------------
  // Voice input setup
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';
      rec.onresult = (e) => {
        setInput(prev => prev + e.results[0][0].transcript + ' ');
        setListening(false);
      };
      rec.onerror = () => setListening(false);
      rec.onend = () => setListening(false);
      recognitionRef.current = rec;
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  // ---------------------------------------------------------------------------
  // Add a message to the chat
  // ---------------------------------------------------------------------------
  const addMessage = useCallback((role, text, extra = {}) => {
    setMessages(prev => [
      ...prev,
      { id: Date.now() + Math.random(), role, text, ...extra },
    ]);
  }, []);

  // ---------------------------------------------------------------------------
  // Send handler
  // ---------------------------------------------------------------------------
  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    addMessage('user', text);
    setLoading(true);

    try {
      let result;

      if (!sessionState) {
        // First message — start a new session
        result = await analyzeSymptoms(text, patientCtx);
      } else if (sessionState.state === 'collecting') {
        // Answer to follow-up question
        result = await sendFollowupAnswer(sessionState.session_id, text);
      } else {
        return;
      }

      setSessionState(result);

      if (result.state === 'emergency') {
        addMessage('ai', result.message, { emergency: true });
      } else if (result.state === 'collecting') {
        addMessage('ai', result.message || result.current_question);
      } else if (result.state === 'complete') {
        addMessage('ai', "✅ I've completed my analysis. Here are your results:");
      } else if (result.state === 'ready_to_analyze') {
        addMessage('ai', 'Analyzing your symptoms now, please wait...');
      } else if (result.state === 'error') {
        addMessage('ai', `Sorry, an error occurred: ${result.error}. Please try again.`);
      }
    } catch (err) {
      const msg = err?.response?.data?.error || 'Network error. Please check your connection and try again.';
      addMessage('ai', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([INTRO_MSG]);
    setSessionState(null);
    setInput('');
    setShowCtx(false);
  };

  const isFinished = sessionState?.state === 'complete' || sessionState?.state === 'emergency';
  const isCollecting = !sessionState || sessionState?.state === 'collecting';

  return (
    <div className="chat-container">
      {/* Progress stepper */}
      <ProgressStepper state={sessionState?.state || 'idle'} />

      {/* Optional patient context form */}
      <div style={{ margin: '1rem 0' }}>
        <button
          className="btn btn-secondary"
          style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}
          onClick={() => setShowCtx(o => !o)}
        >
          {showCtx ? '▲ Hide' : '▼ Add'} Patient Context (optional)
        </button>
        {showCtx && (
          <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[
              { key: 'age', label: 'Age', placeholder: 'e.g. 35' },
              { key: 'gender', label: 'Biological Sex', placeholder: 'e.g. Male, Female' },
              { key: 'medical_history', label: 'Medical History', placeholder: 'e.g. Diabetes, Hypertension' },
              { key: 'medications', label: 'Current Medications', placeholder: 'e.g. Metformin, None' },
            ].map(field => (
              <div className="form-group" key={field.key} style={{ marginBottom: 0 }}>
                <label className="form-label">{field.label}</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder={field.placeholder}
                  value={patientCtx[field.key] || ''}
                  onChange={e => setPatientCtx(p => ({ ...p, [field.key]: e.target.value }))}
                  style={{ fontSize: '0.85rem' }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat messages */}
      <div className="chat-messages" role="log" aria-live="polite">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`chat-bubble ${
              msg.role === 'user'
                ? 'chat-bubble-user'
                : msg.emergency
                ? 'chat-bubble-emergency'
                : 'chat-bubble-ai'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="chat-bubble chat-bubble-ai" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
            IBM Granite is thinking...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Results display */}
      {sessionState?.state === 'complete' && (
        <ResultsDisplay sessionState={sessionState} onReset={handleReset} />
      )}

      {/* Emergency state — show reset only */}
      {sessionState?.state === 'emergency' && (
        <div style={{ marginTop: '1rem' }}>
          <button className="btn btn-secondary" onClick={handleReset}>
            Start New Session
          </button>
        </div>
      )}

      {/* Input area — only visible when still collecting */}
      {isCollecting && !loading && (
        <div className="chat-input-area">
          <textarea
            ref={textareaRef}
            className="chat-input"
            placeholder={
              sessionState
                ? 'Type your answer...'
                : 'Describe your symptoms (e.g. "I have a headache and fever for 2 days")...'
            }
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            aria-label="Message input"
          />
          {recognitionRef.current && (
            <button
              className="btn-icon"
              onClick={toggleVoice}
              title={listening ? 'Stop listening' : 'Start voice input'}
              aria-label="Voice input"
              style={{
                width: 48, height: 48, borderRadius: '50%',
                border: '1.5px solid var(--border)',
                background: listening ? 'var(--danger)' : 'var(--surface)',
                color: listening ? '#fff' : 'var(--text-muted)',
              }}
            >
              {listening ? <FiMicOff /> : <FiMic />}
            </button>
          )}
          <button
            className="chat-send-btn"
            onClick={handleSend}
            disabled={!input.trim() || loading}
            aria-label="Send message"
          >
            <FiSend />
          </button>
        </div>
      )}

      <Disclaimer compact />
    </div>
  );
}

export default ChatInterface;
