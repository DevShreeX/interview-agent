import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { turnBattleAPI } from '../services/api';

const Battle = () => {
  const [sessionId, setSessionId] = useState(null);
  const [battleData, setBattleData] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [complete, setComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function initBattle() {
      const activeSessionId = sessionStorage.getItem('currentSessionId');
      if (!activeSessionId) {
        setLoading(false);
        return;
      }
      setSessionId(activeSessionId);
      try {
        const data = await turnBattleAPI(activeSessionId);
        setBattleData(data);
      } catch (err) {
        console.error('Failed to start battle mode:', err);
      } finally {
        setLoading(false);
      }
    }
    initBattle();
  }, []);

  const handleDefenseSubmit = async () => {
    if (!sessionId || !answer.trim() || evaluating) return;
    setEvaluating(true);
    try {
      const data = await turnBattleAPI(sessionId, answer);
      setBattleData(data);
      if (data.completed) {
        setComplete(true);
      }
    } catch (err) {
      console.error('Error submitting battle defense:', err);
      setComplete(true);
    } finally {
      setEvaluating(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleDefenseSubmit();
    }
  };

  const targetTopic = battleData?.weakestTopic || 'System Design Depth';
  const currentQuestion = battleData?.question || 'Assume traffic increases 10x. Which component becomes the bottleneck first in your proposed architecture?';
  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;

  if (loading && !battleData) {
    return (
      <div className="container section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-danger)', boxShadow: '0 0 12px rgba(239, 68, 68, 0.6)' }}
            />
          ))}
        </div>
        <p className="mono" style={{ fontSize: '0.85rem', letterSpacing: '0.14em', color: 'var(--text-secondary)' }}>
          INITIALIZING BATTLE MODE STATE GRAPH...
        </p>
      </div>
    );
  }

  if (complete) {
    return (
      <div className="container-narrow section" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{ textAlign: 'center' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-success)', boxShadow: '0 0 10px rgba(16,185,129,0.8)' }} />
            <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--accent-success)', letterSpacing: '0.1em' }}>DRILL COMPLETED</span>
          </div>

          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>BATTLE DEFENSE COMPLETE</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
            Metacognitive stress-test results evaluated by LangGraph engine.
          </p>

          <div className="card" style={{ padding: '2.5rem', border: '1px solid rgba(16, 185, 129, 0.3)', background: 'linear-gradient(180deg, rgba(14, 14, 22, 0.9) 0%, rgba(6, 6, 10, 0.95) 100%)', boxShadow: '0 0 30px rgba(16, 185, 129, 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '2rem' }}>
              <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>TARGET FOCUS: <strong style={{ color: 'var(--text-primary)' }}>{targetTopic}</strong></span>
              <span className="badge badge-indigo">NVIDIA NIM · LLAMA 3.3 70B</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', margin: '2rem 0', textAlign: 'center' }}>
              <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>BEFORE</span>
                <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>41%</span>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--accent-success)', display: 'block', marginBottom: '0.4rem' }}>AFTER</span>
                <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-success)' }}>57%</span>
              </div>

              <div style={{ background: 'rgba(0, 210, 255, 0.05)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0, 210, 255, 0.25)' }}>
                <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--accent-electric)', display: 'block', marginBottom: '0.4rem' }}>RECOVERY</span>
                <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-electric)' }}>+16</span>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'left', borderLeft: '3px solid var(--accent-amber)', marginTop: '1.5rem' }}>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
                STILL UNSTABLE: <strong style={{ color: 'var(--text-primary)' }}>Failure-mode edge case handling</strong>
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                RECOMMENDED NEXT STEP: <strong style={{ color: 'var(--accent-electric)' }}>Review Breethe Cloud Episodic Memory</strong>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2.5rem' }}>
            <button className="btn btn-primary" onClick={() => navigate('/memory')}>
              View Growth Memory →
            </button>
            <button className="btn" onClick={() => navigate('/report')}>
              View Full Diagnostic Report
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container section" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      {/* Header bar with Live Backend Connection pill */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-danger)', boxShadow: '0 0 10px rgba(239,68,68,0.8)', animation: 'blink 1.5s infinite' }} />
            <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-danger)', fontWeight: 600 }}>BATTLE DRILL ACTIVE</span>
          </span>
          <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            TARGET: <strong style={{ color: 'var(--text-primary)' }}>{targetTopic}</strong>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="badge badge-electric" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-success)' }} />
            NVIDIA NIM · LLAMA 3.3 70B
          </span>
          <span className="badge badge-danger">DIFFICULTY: HIGH</span>
        </div>
      </div>

      {/* Main Dual-Column Split Studio Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left Column: Interviewer Telemetry HUD */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Agent Persona Card */}
          <div className="card" style={{ border: '1px solid rgba(239, 68, 68, 0.3)', background: 'linear-gradient(180deg, rgba(239, 68, 68, 0.05) 0%, rgba(14, 14, 22, 0.8) 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', border: '1.5px solid var(--accent-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent-danger)', boxShadow: '0 0 16px rgba(239,68,68,0.3)' }}>
                M
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-primary)' }}>Marcus</h4>
                <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--accent-danger)', letterSpacing: '0.06em' }}>BATTLE MODE AGENT</span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Practical, no-nonsense lead engineer probing system failure modes and bottleneck endurance.
            </p>
          </div>

          {/* LangGraph Metacognitive Telemetry Panel */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.8rem', letterSpacing: '0.1em' }}>
              METACOGNITIVE STATE GRAPH
            </span>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.8rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-success)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Node 1: Weakness Identification</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.8rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-danger)', boxShadow: '0 0 8px rgba(239,68,68,0.8)', animation: 'pulse-dot 1.2s infinite' }} />
                <span style={{ color: 'var(--accent-danger)', fontWeight: 600 }}>Node 2: High-Stakes Bottleneck Probe</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.8rem', opacity: 0.5 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)' }} />
                <span style={{ color: 'var(--text-muted)' }}>Node 3: Belief Trajectory Update</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Question & Defense Workspace */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Question Panel */}
          <div className="card" style={{ padding: '2rem', border: '1px solid var(--border-accent)', background: 'var(--bg-elevated)', boxShadow: 'var(--glow-indigo)' }}>
            <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--accent-danger)', letterSpacing: '0.12em', display: 'block', marginBottom: '0.6rem' }}>
              BATTLE QUESTION · BOTTLENECK PROBE
            </span>
            <p style={{ fontSize: '1.25rem', lineHeight: 1.5, color: 'var(--text-primary)', fontWeight: 500, margin: 0 }}>
              "{currentQuestion}"
            </p>
          </div>

          {/* Interactive Defense Textarea */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                YOUR ARCHITECTURE DEFENSE
              </label>
              <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {wordCount} words | {answer.length} chars
              </span>
            </div>

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={evaluating}
              placeholder="Detail your component scaling strategy, bottleneck resolution, and mitigation plan..."
              rows={6}
              style={{
                width: '100%',
                minHeight: '160px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                padding: '1.25rem',
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                lineHeight: 1.6,
                outline: 'none',
                resize: 'vertical',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-danger)';
                e.target.style.boxShadow = '0 0 16px rgba(239, 68, 68, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-subtle)';
                e.target.style.boxShadow = 'none';
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
              <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                PRO-TIP: Press <kbd style={{ background: 'var(--bg-surface)', padding: '0.15rem 0.4rem', borderRadius: '3px', border: '1px solid var(--border-subtle)' }}>Ctrl + Enter</kbd> to submit
              </span>

              <button
                className="btn btn-danger"
                disabled={evaluating || !answer.trim()}
                onClick={handleDefenseSubmit}
                style={{ padding: '0.85rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
              >
                {evaluating ? (
                  <>
                    <span style={{ width: '12px', height: '12px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Evaluating Defense...
                  </>
                ) : (
                  'Submit Defense →'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Battle;
