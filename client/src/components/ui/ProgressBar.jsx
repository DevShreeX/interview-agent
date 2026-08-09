import React from 'react';

const ProgressBar = ({ pct, color = 'var(--accent-electric)', height = 8, delay = 0, animated = false }) => (
  <div
    className="progress-track"
    style={{ height, borderRadius: height / 2, overflow: 'hidden', background: 'var(--bg-elevated)' }}
  >
    <div
      className={animated ? 'progress-fill' : ''}
      style={{
        width: `${pct}%`,
        height: '100%',
        background: color,
        transition: `width 1.4s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
      }}
    />
  </div>
);

export default ProgressBar;
