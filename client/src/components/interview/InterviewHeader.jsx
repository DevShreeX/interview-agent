import React from 'react';
import { personas } from '../../data/demoData';

const InterviewHeader = ({ currentPersonaId = 'alex', questionNumber = 1, totalQuestions = 5, trackName = 'SYSTEM ARCHITECTURE', confidenceScore = 0 }) => {
  const persona = personas.find((p) => p.id === currentPersonaId) || personas[0];

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--accent-electric)' }}>
          <span aria-hidden style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-electric)', boxShadow: '0 0 10px rgba(0,210,255,0.8)', animation: 'blink 1.6s infinite' }} />
          LIVE INTERVIEW SESSION
        </span>

        <span className="badge badge-electric" style={{ fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <span aria-hidden style={{ width: '22px', height: '22px', borderRadius: '50%', border: `1px solid ${persona.accent}`, color: persona.accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
            {persona.glyph}
          </span>
          {persona.name.toUpperCase()} (INTERVIEWER)
        </span>

        <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          QUESTION <strong style={{ color: 'var(--text-primary)' }}>{String(questionNumber).padStart(2, '0')}</strong> / {totalQuestions}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
        <span className="badge badge-indigo" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-success)' }} />
          NVIDIA NIM · LLAMA 3.3 70B
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <span>{trackName}</span>
          {confidenceScore > 0 && (
            <span>CONFIDENCE: <strong style={{ color: 'var(--accent-electric)' }}>{confidenceScore} / 5</strong></span>
          )}
        </div>
      </div>
    </header>
  );
};

export default InterviewHeader;
