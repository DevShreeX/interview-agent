import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { turnBattleAPI } from '../services/api';

const Battle = () => {
  const [sessionId, setSessionId] = useState(null);
  const [battleData, setBattleData] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
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
    if (!sessionId || !answer.trim()) return;
    setLoading(true);
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
      setLoading(false);
    }
  };

  const targetTopic = battleData?.weakestTopic || 'System Design Depth';
  const currentQuestion = battleData?.question || '"Assume traffic increases 10x. Which component becomes the bottleneck first in your proposed architecture?"';

  if (loading && !battleData) {
    return (
      <div className="container section" style={{ textAlign: 'center', paddingTop: '5rem' }}>
        <p className="mono" style={{ color: 'var(--text-secondary)' }}>INITIALIZING BATTLE MODE STATE GRAPH...</p>
      </div>
    );
  }

  if (complete) {
    return (
      <div className="container section" style={{ textAlign: 'center' }}>
        <h1 style={{ color: '#4ade80', marginBottom: '2rem' }}>BATTLE COMPLETE</h1>
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
          <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Target: {targetTopic}</p>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2rem 0', fontSize: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', display: 'block' }}>BEFORE</span>
              41%
            </div>
            <div>
              <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', display: 'block' }}>AFTER</span>
              <span style={{ color: '#4ade80' }}>57%</span>
            </div>
            <div>
              <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', display: 'block' }}>RECOVERY</span>
              <span style={{ color: 'var(--accent-cyan)' }}>+16</span>
            </div>
          </div>
          
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>STILL UNSTABLE: <strong style={{ color: 'var(--text-primary)' }}>Failure-mode reasoning</strong></p>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>NEXT ACTION: <strong style={{ color: 'var(--text-primary)' }}>30-minute production architecture drill</strong></p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/memory')} style={{ marginTop: '2rem' }}>View Growth Memory</button>
      </div>
    );
  }

  return (
    <div className="container section">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
        <div><span style={{ color: 'var(--text-secondary)' }}>TARGET:</span> {targetTopic}</div>
        <div><span style={{ color: 'var(--text-secondary)' }}>INTERVIEWER:</span> Marcus (Battle Mode Agent)</div>
        <div><span style={{ color: '#ef4444' }}>DIFFICULTY:</span> High</div>
      </div>

      <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '4px', marginBottom: '2rem' }}>
        <p style={{ color: 'var(--accent-violet)', fontWeight: 'bold', marginBottom: '0.5rem' }}>Marcus:</p>
        <p style={{ fontSize: '1.25rem' }}>{currentQuestion}</p>
      </div>

      <textarea 
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        style={{ 
          width: '100%', 
          minHeight: '150px', 
          background: 'rgba(0,0,0,0.2)', 
          border: '1px solid var(--border-accent)',
          color: 'var(--text-primary)',
          padding: '1rem',
          borderRadius: '4px',
          fontFamily: 'inherit',
          marginBottom: '2rem'
        }}
        placeholder="Defend your architecture..."
      />

      <button className="btn btn-danger" disabled={loading || !answer.trim()} onClick={handleDefenseSubmit}>
        {loading ? 'Evaluating Defense...' : 'Submit Defense'}
      </button>
    </div>
  );
};

export default Battle;
