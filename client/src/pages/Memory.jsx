import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMemoryAPI } from '../services/api';

const Memory = () => {
  const [memoryData, setMemoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMemory() {
      try {
        const data = await fetchMemoryAPI('CAND-001');
        setMemoryData(data.memory);
      } catch (err) {
        console.error('Failed to fetch memory data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMemory();
  }, []);

  const readinessHistory = memoryData?.trajectory?.readinessHistory || [58, 64, 72];
  const calibrationHistory = memoryData?.trajectory?.calibrationGapHistory || ['+1.7', '+1.1', '+0.4'];
  const staleTopics = memoryData?.staleTopics || [];

  return (
    <div className="container section">
      <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>Growth Memory (Breethe Cloud API)</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
        <div className="card">
          <h3 className="text-accent" style={{ marginBottom: '1.5rem' }}>Readiness History</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {readinessHistory.map((val, idx) => (
              <React.Fragment key={idx}>
                <span style={{ color: idx === readinessHistory.length - 1 ? 'var(--accent-cyan)' : 'var(--text-secondary)' }}>{val}</span>
                {idx < readinessHistory.length - 1 && <span style={{ color: 'var(--border-subtle)' }}>→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-accent" style={{ marginBottom: '1.5rem' }}>Calibration Gap History</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {calibrationHistory.map((gap, idx) => (
              <React.Fragment key={idx}>
                <span style={{ color: idx === calibrationHistory.length - 1 ? '#4ade80' : '#ef4444' }}>{gap}</span>
                {idx < calibrationHistory.length - 1 && <span style={{ color: 'var(--border-subtle)' }}>→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {staleTopics.length > 0 && (
        <div className="card" style={{ marginBottom: '2rem', borderColor: 'var(--accent-amber)' }}>
          <h4 style={{ color: 'var(--accent-amber)', marginBottom: '0.5rem' }}>⚠️ Stale Topics Detected</h4>
          <p style={{ color: 'var(--text-secondary)' }}>
            The following topics haven't been evaluated in past sessions: <strong>{staleTopics.join(', ')}</strong>
          </p>
        </div>
      )}

      <div className="card" style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>AI Insight</h3>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', fontStyle: 'italic', borderLeft: '3px solid var(--accent-cyan)', paddingLeft: '1.5rem' }}>
          "Your confidence is becoming more aligned with your demonstrated knowledge. Last time, failure-mode reasoning was your biggest weakness. Today we tested it under a production constraint, and you showed marked improvement."
        </p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Link to="/interview" className="btn btn-primary">Start Next Session</Link>
      </div>
    </div>
  );
};

export default Memory;
