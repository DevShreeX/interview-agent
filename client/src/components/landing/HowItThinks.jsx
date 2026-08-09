import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    n: '01',
    tag: 'MEASURE',
    title: 'Confidence, per answer',
    body: 'After every answer you rate your own certainty on a 1–5 scale — the raw signal most interviews throw away.',
    accent: 'var(--accent-electric)',
  },
  {
    n: '02',
    tag: 'PROBE',
    title: 'Depth, under pressure',
    body: 'The AI pushes past pattern-matching with follow-ups and constraints until it finds the edge of your reasoning.',
    accent: 'var(--accent-indigo)',
  },
  {
    n: '03',
    tag: 'PREDICT',
    title: 'Your exact breakpoint',
    body: 'It cross-references confidence against demonstrated depth to predict the question that breaks you.',
    accent: 'var(--accent-amber)',
  },
];

const HowItThinks = () => (
  <section id="how-it-thinks" className="section" style={{ borderTop: '1px solid var(--border-subtle)' }}>
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: '640px', marginBottom: '3.5rem' }}
      >
        <span className="badge badge-electric">How It Thinks</span>
        <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.75rem)', margin: '1.25rem 0 1rem' }}>
          Three passes. One verdict.
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Every answer is measured, probed, and scored against a traceable evidence trail — no
          vibes, no opaque verdicts.
        </p>
      </motion.div>

      <div className="grid-3" style={{ position: 'relative' }}>
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: i * 0.15 }}
            className="card card-interactive"
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: '0.9rem', color: s.accent }}>{s.n}</span>
              <span className="mono" style={{ fontSize: '0.68rem', letterSpacing: '0.14em', color: 'var(--text-muted)' }}>{s.tag}</span>
            </div>
            <h3 style={{ fontSize: '1.15rem', margin: 0 }}>{s.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>{s.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItThinks;
