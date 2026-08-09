import React from 'react';
import { interview, personas } from '../../data/demoData';

const InterviewHeader = () => {
  const persona = personas.find((p) => p.id === interview.personaId);

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--accent-danger)' }}>
          <span aria-hidden style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-danger)', boxShadow: '0 0 10px rgba(239,68,68,0.8)', animation: 'blink 1.6s infinite' }} />
          LIVE
        </span>
        <span className="badge badge-electric" style={{ fontSize: '0.78rem' }}>
          <span aria-hidden style={{ width: '22px', height: '22px', borderRadius: '50%', border: `1px solid ${persona.accent}`, color: persona.accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{persona.glyph}</span>
          {persona.name.toUpperCase()}
        </span>
        <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          Q {String(interview.currentIndex + 1).padStart(2, '0')} / {interview.totalQuestions}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
        <span>{interview.track} TRACK</span>
        <span>CONFIDENCE <span style={{ color: 'var(--accent-electric)' }}>{interview.confidence.toFixed(1)}</span></span>
      </div>
    </header>
  );
};

export default InterviewHeader;
