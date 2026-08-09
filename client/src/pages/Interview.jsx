import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import InterviewHeader from '../components/interview/InterviewHeader';
import QuestionPanel from '../components/interview/QuestionPanel';
import ConfidenceSelector from '../components/interview/ConfidenceSelector';
import { startInterviewAPI, continueInterviewAPI, completeInterviewAPI } from '../services/api';
import { personas } from '../data/demoData';

const EvaluatingState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.96 }}
    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '55vh', gap: '1.75rem', textAlign: 'center' }}
  >
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        style={{ width: '70px', height: '70px', borderRadius: '50%', border: '2px solid rgba(0, 210, 255, 0.15)', borderTopColor: 'var(--accent-electric)', borderRightColor: 'var(--accent-indigo)' }}
      />
      <div style={{ position: 'absolute', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0, 210, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: 'var(--accent-electric)' }}>
        🧠
      </div>
    </div>

    <div>
      <span className="mono" style={{ fontSize: '0.85rem', letterSpacing: '0.16em', color: 'var(--accent-electric)', display: 'block', marginBottom: '0.5rem' }}>
        LANGGRAPH METACOGNITIVE ENGINE EVALUATING...
      </span>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '440px', margin: 0 }}>
        Evaluating technical depth, first-principles logic, and calibration delta via NVIDIA NIM (Llama 3.3 70B).
      </p>
    </div>
  </motion.div>
);

const Interview = () => {
  const [sessionId, setSessionId] = useState(null);
  const [currentPersonaId, setCurrentPersonaId] = useState('alex');
  const [currentQuestion, setCurrentQuestion] = useState({ number: 1, prompt: 'Loading system question...' });
  const [answer, setAnswer] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [status, setStatus] = useState('loading'); // loading | ready | evaluating
  const navigate = useNavigate();

  useEffect(() => {
    async function initSession() {
      try {
        const data = await startInterviewAPI(currentPersonaId, 'Senior AI Engineer');
        setSessionId(data.sessionId);
        sessionStorage.setItem('currentSessionId', data.sessionId);
        setCurrentQuestion({
          number: data.questionNumber || 1,
          prompt: typeof data.question === 'object' ? data.question.prompt : data.question
        });
        setStatus('ready');
      } catch (err) {
        console.error('Failed to start interview:', err);
        setCurrentQuestion({
          number: 1,
          prompt: "How do you design a scalable RAG pipeline that maintains low latency under high concurrent vector searches?"
        });
        setStatus('ready');
      }
    }
    initSession();
  }, [currentPersonaId]);

  const canSubmit = answer.trim().length > 0 && confidence > 0;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!canSubmit || !sessionId || status === 'evaluating') return;
    setStatus('evaluating');

    try {
      const res = await continueInterviewAPI(sessionId, answer, confidence);
      if (res.completed) {
        await completeInterviewAPI(sessionId);
        setTimeout(() => navigate('/report'), 1000);
      } else {
        setCurrentQuestion({
          number: res.questionNumber,
          prompt: typeof res.question === 'object' ? res.question.prompt : res.question
        });
        setAnswer('');
        setConfidence(0);
        setStatus('ready');
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      setTimeout(() => navigate('/report'), 1500);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const activePersona = personas.find((p) => p.id === currentPersonaId) || personas[0];

  return (
    <div className="container section" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      <AnimatePresence mode="wait">
        {status === 'evaluating' || status === 'loading' ? (
          <EvaluatingState key="evaluating" />
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            <InterviewHeader
              currentPersonaId={currentPersonaId}
              questionNumber={currentQuestion.number}
              confidenceScore={confidence}
            />

            {/* Main Dual-Column Split Studio Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', alignItems: 'start' }}>
              {/* Left Column: Interviewer Persona Selector & Metacognitive Telemetry */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Persona Cards */}
                <div className="card" style={{ padding: '1.25rem' }}>
                  <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>
                    SELECT INTERVIEWER PERSONA
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {personas.map((p) => {
                      const isSelected = p.id === currentPersonaId;
                      return (
                        <button
                          key={p.id}
                          onClick={() => setCurrentPersonaId(p.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            border: isSelected ? `1px solid ${p.accent}` : '1px solid var(--border-subtle)',
                            background: isSelected ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
                            color: 'var(--text-primary)',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <span style={{ width: '28px', height: '28px', borderRadius: '50%', border: `1px solid ${p.accent}`, color: p.accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                            {p.glyph}
                          </span>
                          <div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{p.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{p.role}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Agent Style & Focus */}
                <div className="card" style={{ padding: '1.25rem', borderLeft: `3px solid ${activePersona.accent}` }}>
                  <span className="mono" style={{ fontSize: '0.72rem', color: activePersona.accent, display: 'block', marginBottom: '0.4rem' }}>
                    {activePersona.name.toUpperCase()}'S EVALUATION STYLE
                  </span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {activePersona.style}
                  </p>
                </div>

                {/* LangGraph Node Status */}
                <div className="card" style={{ padding: '1.25rem' }}>
                  <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.8rem', letterSpacing: '0.1em' }}>
                    LANGGRAPH ENGINE NODES
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-success)' }}>
                      <span>✓</span> Node 1: Planner Node (Curriculum Match)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-electric)' }}>
                      <span style={{ animation: 'blink 1.2s infinite' }}>●</span> Node 2: Thinking Node (Self-Critique)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                      <span>○</span> Node 3: Evaluator Node (Score Delta)
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Question Panel & Confidence Workspace */}
              <div className="card" style={{ padding: 'clamp(1.75rem, 4vw, 2.5rem)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <QuestionPanel
                  question={currentQuestion}
                  answer={answer}
                  onChange={setAnswer}
                  onKeyDown={handleKeyDown}
                  isSubmitting={status === 'evaluating'}
                />

                <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

                <ConfidenceSelector value={confidence} onChange={setConfidence} />

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={!canSubmit}
                    onClick={handleSubmit}
                    style={{ padding: '0.85rem 2.25rem', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
                  >
                    Submit Answer →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Interview;
