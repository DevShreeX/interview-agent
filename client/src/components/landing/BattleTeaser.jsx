import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const BattleTeaser = () => (
  <section className="section" style={{ borderTop: '1px solid var(--border-subtle)' }}>
    <div className="container">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: 'linear-gradient(180deg, var(--bg-elevated), var(--bg-void))',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'clamp(2.5rem, 6vw, 5rem)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div aria-hidden style={{ position: 'absolute', top: '-40%', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '300px', background: 'radial-gradient(ellipse, rgba(0,210,255,0.06), transparent 60%)', filter: 'blur(30px)' }} />

        <div style={{ position: 'relative' }}>
          <span className="mono" style={{ fontSize: '0.75rem', letterSpacing: '0.22em', color: 'var(--accent-electric)' }}>BATTLE MODE</span>
          <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.75rem)', margin: '1.25rem auto 1rem', maxWidth: '560px' }}>
            Face the breakpoint. Defend your architecture.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto 2.25rem' }}>
            Battle Mode re-opens your predicted failure under a harder constraint — and measures
            whether you recover.
          </p>
          <Link to="/battle" className="btn btn-primary" style={{ padding: '0.9rem 2.25rem' }}>Enter Battle Mode</Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default BattleTeaser;
