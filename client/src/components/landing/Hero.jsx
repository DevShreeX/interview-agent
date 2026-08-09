import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NetworkCanvas = lazy(() => import('../NetworkCanvas'));

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Hero = () => (
  <section className="hero" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
    {/* Three.js network background (code-split) */}
    <Suspense fallback={null}>
      <NetworkCanvas intensity={0.9} />
    </Suspense>

    {/* Ambient blobs */}
    <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
      <motion.div
        animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(0,210,255,0.07), transparent 60%)', filter: 'blur(40px)' }}
      />
      <motion.div
        animate={{ opacity: [0.4, 0.8, 0.4], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', bottom: '-25%', right: '-15%', width: '55vw', height: '55vw', background: 'radial-gradient(circle, rgba(94,106,210,0.08), transparent 60%)', filter: 'blur(40px)' }}
      />
    </div>

    <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: '3rem', paddingBottom: '3rem' }}>
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
        <span className="badge badge-electric">Adaptive AI Technical Interviewer</span>
      </motion.div>

      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={1}
        style={{ fontSize: 'clamp(2.6rem, 7vw, 5rem)', lineHeight: 1.02, margin: '1.75rem 0 1.5rem', maxWidth: '900px' }}
      >
        Know what you know.
        <br />
        <span className="text-accent">Know what breaks you.</span>
      </motion.h1>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={2}
        style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '640px', marginBottom: '2.75rem', lineHeight: 1.7 }}
      >
        Interview Mirror measures what you know, how you reason, how accurately you judge your own
        depth — and predicts the exact weakness most likely to expose you in a real interview.
      </motion.p>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={3}
        style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}
      >
        <Link to="/interview" className="btn btn-primary" style={{ padding: '0.9rem 2rem' }}>
          Start an Interview
        </Link>
        <Link to="/interview?demo=true" className="btn" style={{ padding: '0.9rem 2rem', borderColor: 'var(--accent-electric)', color: 'var(--accent-electric)', background: 'rgba(0, 210, 255, 0.05)' }}>
          ▶ Launch Auto-Demo Mode
        </Link>
        <a href="#how-it-thinks" className="nav-link" style={{ fontSize: '0.95rem', letterSpacing: '0.05em' }}>
          See How It Works →
        </a>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={4}
        style={{ marginTop: '4.5rem', display: 'flex', gap: '2.5rem', flexWrap: 'wrap', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', letterSpacing: '0.08em' }}
      >
        <span><span style={{ color: 'var(--accent-electric)' }}>▸</span> MEASURES CONFIDENCE</span>
        <span><span style={{ color: 'var(--accent-indigo)' }}>▸</span> TRACES REASONING</span>
        <span><span style={{ color: 'var(--accent-amber)' }}>▸</span> PREDICTS BREAKPOINTS</span>
      </motion.div>
    </div>

    {/* Scroll cue */}
    <div aria-hidden style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
      <div style={{ width: '1px', height: '48px', background: 'linear-gradient(180deg, transparent, var(--text-muted), transparent)' }} />
    </div>
  </section>
);

export default Hero;
