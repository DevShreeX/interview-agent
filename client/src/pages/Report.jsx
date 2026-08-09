import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchReportAPI } from '../services/api';

const Report = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      const sessionId = sessionStorage.getItem('currentSessionId');
      if (!sessionId) {
        setLoading(false);
        return;
      }
      try {
        const data = await fetchReportAPI(sessionId);
        setReport(data);
      } catch (err) {
        console.error('Failed to load report:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, []);

  const overallScore = report ? Math.round(report.overallScore * 100) : 72;
  const confidenceScore = report?.calibration?.candidateAvgConfidence?.toFixed(1) || '4.6';
  const depthScore = report?.calibration?.evaluatorAvgScore ? (report.calibration.evaluatorAvgScore * 5).toFixed(1) : '2.8';
  const gapValue = report?.calibration?.gap ? (report.calibration.gap > 0 ? `+${report.calibration.gap.toFixed(1)}` : report.calibration.gap.toFixed(1)) : '+1.8';
  const gapCategory = report?.calibration?.category ? report.calibration.category.toUpperCase() : 'OVERCONFIDENCE';
  const thinkingStyle = report?.thinkingStyle?.primaryStyle || 'PATTERN MATCHER';
  const reasoningRisk = report?.thinkingStyle?.risk || 'Reasoning becomes less structured when the familiar pattern breaks.';
  const breakpointQuestion = report?.breakpoint?.challengeQuestion || "Your vector database is causing P95 latency to exceed 800ms. What changes first, and why?";

  if (loading) {
    return (
      <div className="container section" style={{ textAlign: 'center', paddingTop: '5rem' }}>
        <p className="mono" style={{ color: 'var(--text-secondary)' }}>GENERATING DOSSIER & PREDICTING BREAKPOINT...</p>
      </div>
    );
  }

  return (
    <div className="container section">
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <p style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>INTERVIEW READINESS DOSSIER</p>
        <h1 style={{ fontSize: '5rem', margin: 0, color: 'var(--accent-cyan)' }}>
          {overallScore} <span style={{ fontSize: '2rem', color: 'var(--text-secondary)' }}>/ 100</span>
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
        <div className="card">
          <h3 className="text-accent" style={{ marginBottom: '2rem' }}>Calibration Gap</h3>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <span>YOUR CONFIDENCE</span>
              <span>{confidenceScore} / 5</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${(Number(confidenceScore) / 5) * 100}%`, height: '100%', background: 'var(--text-primary)' }}></div>
            </div>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <span>DEMONSTRATED DEPTH</span>
              <span>{depthScore} / 5</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${(Number(depthScore) / 5) * 100}%`, height: '100%', background: 'var(--accent-cyan)' }}></div>
            </div>
          </div>
          <p style={{ fontWeight: 'bold', color: '#ef4444' }}>GAP: {gapValue} ({gapCategory})</p>
        </div>

        <div className="card">
          <h3 className="text-accent">Thinking Style</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '1rem 0' }}>{thinkingStyle.toUpperCase()}</p>
          <p style={{ color: 'var(--text-secondary)' }}><strong>Strength:</strong> Fast recognition of system requirements.</p>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}><strong>Risk:</strong> {reasoningRisk}</p>
        </div>
      </div>

      <div className="card" style={{ border: '1px solid #ef4444', textAlign: 'center', padding: '3rem' }}>
        <h2 style={{ color: '#ef4444', letterSpacing: '0.2em', marginBottom: '1rem', fontSize: '1.25rem' }}>⚠️ YOUR BREAKPOINT</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Question most likely to expose your weakness in System Design Depth:</p>
        <blockquote style={{ fontSize: '1.5rem', fontStyle: 'italic', marginBottom: '2rem', maxWidth: '800px', margin: '0 auto 2rem' }}>
          "{breakpointQuestion}"
        </blockquote>
        <Link to="/battle" className="btn btn-danger">PROVE THE AI WRONG</Link>
      </div>
    </div>
  );
};

export default Report;
