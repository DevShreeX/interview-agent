import React from 'react';
import { motion } from 'framer-motion';

const AutoDemoBar = ({ isPlaying, onTogglePlay, speed, onChangeSpeed, onQuickFill, onSkip }) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        background: 'rgba(14, 14, 22, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-accent)',
        borderRadius: '30px',
        padding: '0.6rem 1.4rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: '0 10px 30px rgba(0, 210, 255, 0.2), inset 0 0 15px rgba(0, 210, 255, 0.08)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isPlaying ? 'var(--accent-electric)' : 'var(--accent-amber)', boxShadow: isPlaying ? '0 0 10px rgba(0,210,255,0.8)' : 'none', animation: isPlaying ? 'blink 1.2s infinite' : 'none' }} />
        <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.08em' }}>
          {isPlaying ? 'AUTO-DEMO ACTIVE' : 'DEMO READY'}
        </span>
      </div>

      <div style={{ height: '16px', width: '1px', background: 'var(--border-subtle)' }} />

      <button
        onClick={onTogglePlay}
        className="btn btn-primary"
        style={{ padding: '0.4rem 0.9rem', fontSize: '0.78rem', borderRadius: '20px' }}
      >
        {isPlaying ? '⏸ Pause' : '▶ Auto-Play Demo'}
      </button>

      <button
        onClick={onQuickFill}
        className="btn"
        style={{ padding: '0.4rem 0.9rem', fontSize: '0.78rem', borderRadius: '20px', borderColor: 'var(--accent-indigo)', color: 'var(--accent-indigo)' }}
      >
        ⚡ Auto-Fill Answer
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'var(--bg-surface)', padding: '0.2rem 0.5rem', borderRadius: '15px', border: '1px solid var(--border-subtle)' }}>
        <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>SPEED:</span>
        {[1, 2, 5].map((s) => (
          <button
            key={s}
            onClick={() => onChangeSpeed(s)}
            style={{
              background: speed === s ? 'var(--accent-electric)' : 'transparent',
              color: speed === s ? '#000' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '10px',
              padding: '0.15rem 0.45rem',
              fontSize: '0.7rem',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer'
            }}
          >
            {s}x
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default AutoDemoBar;
