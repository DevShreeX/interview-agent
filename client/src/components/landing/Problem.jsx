import React from 'react';
import { motion } from 'framer-motion';

const failures = [
  {
    tag: 'NO CALIBRATION',
    title: 'They never measure confidence.',
    body: 'Interviews test whether you can recite a pattern — never whether you know how deep your own understanding runs.',
  },
  {
    tag: 'NO FAILURE MODE',
    title: 'They never find your edge.',
    body: 'Nobody identifies the exact question that breaks your reasoning. You walk out knowing you passed, not what you are.',
  },
  {
    tag: 'NO MEMORY',
    title: 'They forget you between rounds.',
    body: 'Every interview starts from zero. Your growth, your earlier blind spots — none of it carries into the next session.',
  },
];

const Problem = () => (
  <section id="problem" className="section" style={{ borderTop: '1px solid var(--border-subtle)' }}>
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: '640px', marginBottom: '3.5rem' }}
      >
        <span className="badge">The Problem</span>
        <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.75rem)', margin: '1.25rem 0 1rem' }}>
          Traditional interviews are blind.
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          They measure recitation, not understanding. They ignore how you judge yourself. They
          never surface the precise failure that would cost you the offer.
        </p>
      </motion.div>

      <div className="grid-3">
        {failures.map((f, i) => (
          <motion.div
            key={f.tag}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: i * 0.12 }}
            className="card card-interactive"
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.72rem', letterSpacing: '0.14em' }}>
              {String(i + 1).padStart(2, '0')} · {f.tag}
            </span>
            <h3 style={{ fontSize: '1.15rem', margin: 0 }}>{f.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>{f.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Problem;
