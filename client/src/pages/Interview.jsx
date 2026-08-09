import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import InterviewHeader from '../components/interview/InterviewHeader';
import QuestionPanel from '../components/interview/QuestionPanel';
import ConfidenceSelector from '../components/interview/ConfidenceSelector';
import { startInterviewAPI, continueInterviewAPI, completeInterviewAPI } from '../services/api';

const Evaluating = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '1.5rem' }}
  >
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
          style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-electric)', boxShadow: '0 0 12px rgba(0,210,255,0.6)' }}
        />
      ))}
    </div>
    <span className="mono" style={{ fontSize: '0.8rem', letterSpacing: '0.16em', color: 'var(--text-secondary)' }}>
      EVALUATING REASONING THROUGH LANGGRAPH
    </span>
  </motion.div>
);

const Interview = () => {
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState({ number: 1, prompt: 'Loading system question...' });
  const [answer, setAnswer] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [status, setStatus] = useState('loading'); // loading | ready | evaluating
  const navigate = useNavigate();

  useEffect(() => {
    async function initSession() {
      try {
        const data = await startInterviewAPI('alex', 'Senior AI Engineer');
        setSessionId(data.sessionId);
        sessionStorage.setItem('currentSessionId', data.sessionId);
        setCurrentQuestion({
          number: data.questionNumber || 1,
          prompt: typeof data.question === 'object' ? data.question.prompt : data.question
        });
        setStatus('ready');
      } catch (err) {
        console.error('Failed to start interview:', err);
        // Fallback for demo display if server is down
        setCurrentQuestion({
          number: 1,
          prompt: "How do you design a scalable RAG pipeline that maintains low latency under high concurrent vector searches?"
        });
        setStatus('ready');
      }
    }
    initSession();
  }, []);

  const canSubmit = answer.trim().length > 0 && confidence > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || !sessionId) return;
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

  return (
    <div className="container-narrow section" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh', paddingTop: '3rem', paddingBottom: '3rem' }}>
      <AnimatePresence mode="wait">
        {status === 'evaluating' || status === 'loading' ? (
          <Evaluating key="evaluating" />
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
          >
            <InterviewHeader />

            <div className="card" style={{ padding: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
              <QuestionPanel question={currentQuestion} answer={answer} onChange={setAnswer} />

              <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '2rem 0' }} />

              <ConfidenceSelector value={confidence} onChange={setConfidence} />

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!canSubmit}
                  onClick={handleSubmit}
                  style={{ padding: '0.85rem 2.25rem', fontSize: '0.9rem' }}
                >
                  Submit →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Interview;
