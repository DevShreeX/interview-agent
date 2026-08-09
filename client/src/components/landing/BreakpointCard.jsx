import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { report } from '../../data/demoData';

const BreakpointCard = () => (
  <section className="section" style={{ borderTop: '1px solid var(--border-subtle)' }}>
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center', marginBottom: '2.5rem' }}
      >
        <span className="badge badge-amber">Breakpoint Prediction</span>
        <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.75rem)', margin: '1.25rem 0 1rem' }}>
          We know exactly where you'll fail.
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          With {Math.round(report.breakpoint.confidence * 100)}% model confidence, the AI predicts
          the question most likely to expose your weakness.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="card"
        style={{
          maxWidth: '760px',
          margin: '0 auto',
          padding: '2.5rem',
          borderColor: 'rgba(245, 158, 11, 0.28)',
          background: 'linear-gradient(180deg, rgba(245,158,11,0.05), transparent 40%)',
          boxShadow: '0 0 40px rgba(245,158,11,0.05)',
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span className="mono" style={{
            width: '26px', height: '26px', borderRadius: '50%',
            border: '1px solid rgba(245,158,11,0.4)',
            color: 'var(--accent-amber)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.85rem', fontWeight: 500,
            boxShadow: '0 0 14px rgba(245,158,11,0.25), inset 0 0 8px rgba(245,158,11,0.15)',
          }}>
            !
          </span>
          <span className="mono" style={{ fontSize: '0.75rem', letterSpacing: '0.16em', color: 'var(--accent-amber)' }}>
            {report.breakpoint.area.toUpperCase()}
          </span>
        </div>

        <blockquote style={{ fontSize: '1.3rem', lineHeight: 1.55, color: 'var(--text-primary)', marginBottom: '2rem', borderLeft: '3px solid var(--accent-amber)', paddingLeft: '1.5rem' }}>
          “{report.breakpoint.prediction}”
        </blockquote>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            MODEL CONFIDENCE · {(report.breakpoint.confidence * 100).toFixed(0)}%
          </span>
          <Link to="/battle" className="btn" style={{ borderColor: 'rgba(245,158,11,0.4)', color: 'var(--accent-amber)' }}>
            PROVE THE AI WRONG →
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default BreakpointCard;
