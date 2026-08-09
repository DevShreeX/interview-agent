import React from 'react';
import { motion } from 'framer-motion';

const items = ['PII excluded', 'Session isolation', 'Traceable evidence', 'Aggregate cohort data'];

const PrivacySection = () => (
  <section className="section" style={{ borderTop: '1px solid var(--border-subtle)' }}>
    <div className="container" style={{ textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: '560px', margin: '0 auto' }}
      >
        <span className="badge">Privacy by Design</span>
        <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.4rem)', margin: '1.25rem 0 1.5rem' }}>
          Your data stays yours.
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {items.map((item) => (
            <span key={item} className="badge badge-success" style={{ fontSize: '0.78rem' }}>
              <span aria-hidden style={{ color: 'var(--accent-success)' }}>✓</span> {item}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default PrivacySection;
