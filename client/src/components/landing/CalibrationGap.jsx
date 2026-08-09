import React, { useEffect, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useTransform } from 'framer-motion';
import { gapBars } from '../../data/demoData';

const ease = [0.22, 1, 0.36, 1];

const BarRow = ({ bar, delay, animating }) => (
  <div style={{ marginBottom: '2rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.6rem' }}>
      <span className="mono" style={{ fontSize: '0.78rem', letterSpacing: '0.12em', color: 'var(--text-secondary)' }}>
        {bar.label}
      </span>
      <span className="mono" style={{ fontSize: '1.1rem', color: bar.color }}>
        {bar.score.toFixed(1)} <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>/ {bar.max}</span>
      </span>
    </div>
    <div style={{ height: 10, borderRadius: 5, background: 'var(--bg-void)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={animating ? { width: `${bar.pct}%` } : {}}
        transition={{ duration: 1.3, delay, ease }}
        style={{ height: '100%', background: bar.color, boxShadow: `0 0 14px ${bar.color === 'var(--text-primary)' ? 'rgba(237,237,239,0.25)' : 'rgba(94,106,210,0.5)'}` }}
      />
    </div>
  </div>
);

const CalibrationGap = () => {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [showWhy, setShowWhy] = useState(false);

  const gapValue = useMotionValue(0);
  const gapText = useTransform(gapValue, (v) => `+${v.toFixed(1)}`);

  useEffect(() => {
    if (inView) {
      const controls = animate(gapValue, 1.8, { duration: 1.2, delay: 2.2, ease });
      return controls.stop;
    }
    return undefined;
  }, [inView, gapValue]);

  return (
    <section className="section" style={{ borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: '640px', marginBottom: '3.5rem' }}
        >
          <span className="badge badge-amber">The Calibration Gap</span>
          <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.75rem)', margin: '1.25rem 0 1rem' }}>
            What you think you know <span className="text-accent">vs.</span> what you demonstrated.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            The single most predictive signal in a technical interview is how accurately you judge
            your own knowledge. Scroll — this is the gap that decides.
          </p>
        </motion.div>

        <div ref={ref} className="grid-calibration" style={{ alignItems: 'stretch' }}>
          {/* Bars */}
          <div className="card" style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {gapBars.map((bar, i) => (
              <BarRow key={bar.label} bar={bar} delay={i === 0 ? 0.2 : 1.1} animating={inView} />
            ))}

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 2.2 }}
              style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.75rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}
            >
              <span className="mono" style={{ fontSize: '1.6rem', fontWeight: 500, color: 'var(--accent-amber)', textShadow: '0 0 18px rgba(245,158,11,0.35)' }}>
                <motion.span>{gapText}</motion.span>
              </span>
              <span className="badge badge-amber" style={{ fontSize: '0.8rem' }}>HIGH OVERCONFIDENCE</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 2.6 }}
              style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}
            >
              “You don't have a knowledge problem here. You have a depth problem.”
            </motion.p>
          </div>

          {/* Evidence card with WHY */}
          <motion.div
            initial={{ opacity: 0, rotateX: -40 }}
            animate={inView ? { opacity: 1, rotateX: 0 } : {}}
            transition={{ duration: 0.8, delay: 2.9, ease }}
            className="card"
            style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', transformStyle: 'preserve-3d' }}
          >
            <span className="mono" style={{ fontSize: '0.72rem', letterSpacing: '0.14em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              EVIDENCE TRAIL · SESSION 04
            </span>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>+1.8 overconfidence</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Confidence of 4.6 against demonstrated depth of 2.8 across System Design.
            </p>

            <button
              onClick={() => setShowWhy((s) => !s)}
              className="btn"
              style={{ alignSelf: 'flex-start', fontSize: '0.78rem' }}
              aria-expanded={showWhy}
            >
              {showWhy ? 'Hide Evidence' : 'WHY?'}
            </button>

            <motion.div
              initial={false}
              animate={{ height: showWhy ? 'auto' : 0, opacity: showWhy ? 1 : 0 }}
              transition={{ duration: 0.4, ease }}
              style={{ overflow: 'hidden', marginTop: showWhy ? '1.25rem' : 0 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  <span className="mono" style={{ color: 'var(--accent-success)' }}>+</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Mentioned caching, chunking, and scoped concurrency</span>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  <span className="mono" style={{ color: 'var(--accent-success)' }}>+</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Identified core retrieval bottlenecks</span>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  <span className="mono" style={{ color: 'var(--accent-danger)' }}>−</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No failure recovery or observability plan</span>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  <span className="mono" style={{ color: 'var(--accent-danger)' }}>−</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No quantified recall / latency trade-offs</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CalibrationGap;
