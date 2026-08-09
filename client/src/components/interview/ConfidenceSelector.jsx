import React from 'react';
import { motion } from 'framer-motion';

const ConfidenceSelector = ({ value, onChange }) => (
  <div>
    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
      How confident are you in this answer?
    </p>

    <div style={{ display: 'flex', gap: '1.1rem', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((num) => {
        const selected = value === num;
        return (
          <motion.button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.94 }}
            aria-pressed={selected}
            aria-label={`Confidence ${num} of 5`}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: selected ? '1.5px solid var(--accent-electric)' : '1px solid var(--border-subtle)',
              background: selected ? 'rgba(0,210,255,0.1)' : 'var(--bg-surface)',
              color: selected ? 'var(--accent-electric)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease, color 0.2s ease, background 0.2s ease',
              boxShadow: selected ? '0 0 18px rgba(0,210,255,0.35), inset 0 0 12px rgba(0,210,255,0.15)' : 'none',
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
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mono"
        style={{ fontSize: '0.85rem', color: value ? 'var(--accent-electric)' : 'var(--text-muted)', marginLeft: '0.5rem' }}
      >
        {value ? `${value} / 5` : 'SELECT'}
      </motion.span>
    </div>
  </div>
);

export default ConfidenceSelector;
