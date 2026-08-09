import React from 'react';
import { motion } from 'framer-motion';

const CONFIDENCE_LABELS = {
  1: 'Uncertain / Speculative',
  2: 'Moderate Familiarity',
  3: 'Solid Practical Knowledge',
  4: 'Strong Architecture Insight',
  5: 'Expert / Production Mastery'
};

const ConfidenceSelector = ({ value, onChange }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
        Rate your confidence level in this architecture answer:
      </p>
      <span className="mono" style={{ fontSize: '0.75rem', color: value ? 'var(--accent-electric)' : 'var(--text-muted)' }}>
        {value ? CONFIDENCE_LABELS[value] : 'REQUIRED (1–5)'}
      </span>
    </div>

    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
      {[1, 2, 3, 4, 5].map((num) => {
        const selected = value === num;
        return (
          <motion.button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-pressed={selected}
            aria-label={`Confidence ${num} of 5: ${CONFIDENCE_LABELS[num]}`}
            title={CONFIDENCE_LABELS[num]}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: selected ? '2px solid var(--accent-electric)' : '1px solid var(--border-subtle)',
              background: selected ? 'rgba(0, 210, 255, 0.12)' : 'var(--bg-surface)',
              color: selected ? 'var(--accent-electric)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '1rem',
              fontWeight: selected ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: selected ? '0 0 20px rgba(0, 210, 255, 0.35), inset 0 0 12px rgba(0, 210, 255, 0.15)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {num}
          </motion.button>
        );
      })}

      <motion.span
        key={value || 'none'}
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        className="mono"
        style={{ fontSize: '0.85rem', color: value ? 'var(--accent-electric)' : 'var(--text-muted)', marginLeft: '0.5rem' }}
      >
        {value ? `${value} / 5` : 'Select score'}
      </motion.span>
    </div>
  </div>
);

export default ConfidenceSelector;
