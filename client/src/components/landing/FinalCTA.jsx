import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FinalCTA = () => (
  <section className="section" style={{ paddingTop: '2rem' }}>
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          textAlign: 'center',
          padding: 'clamp(3rem, 8vw, 6rem)',
          border: '1px solid var(--border-accent)',
          borderRadius: 'var(--radius-lg)',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0,210,255,0.07), transparent 55%), var(--bg-elevated)',
          boxShadow: 'var(--glow-electric)',
        }}
      >
        <span className="mono" style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>
          10 QUESTIONS · 20 MINUTES · 1 VERDICT
        </span>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: '1.5rem auto', maxWidth: '640px' }}>
          Find out where you actually stand.
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto 2.5rem' }}>
          One session. A calibrated readiness score, a thinking style, and the exact question that
          would break you.
        </p>
        <Link to="/interview" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1rem' }}>
          Start an Interview
        </Link>
      </motion.div>
    </div>
  </section>
);

export default FinalCTA;
