import React from 'react';
import { motion } from 'framer-motion';
import { report } from '../../data/demoData';

const EvidenceTrail = () => (
  <section className="section" style={{ borderTop: '1px solid var(--border-subtle)' }}>
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: '640px', marginBottom: '3.5rem' }}
      >
        <span className="badge badge-indigo">The Evidence Trail</span>
        <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.75rem)', margin: '1.25rem 0 1rem' }}>
          Every score is a claim. <span className="text-accent">Every claim is shown.</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Skill scores decompose into the exact phrases you produced — the strong signals and the
          missing ones — so the verdict is audit-able.
        </p>
      </motion.div>

      <div className="grid-2">
        {/* Skill bars */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="card"
          style={{ padding: '2rem' }}
        >
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.5rem' }}>Skill breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {report.skills.map((skill, i) => (
              <div key={skill.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{skill.name}</span>
                  <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{skill.score.toFixed(1)}</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-void)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(skill.score / skill.max) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-indigo), var(--accent-electric))' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Evidence chips */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="card"
          style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}
        >
          <div>
            <span className="mono" style={{ fontSize: '0.72rem', letterSpacing: '0.14em', color: 'var(--accent-success)' }}>CAPTURED</span>
            <ul style={{ listStyle: 'none', marginTop: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {report.evidence.strong.map((item) => (
                <li key={item} style={{ display: 'flex', gap: '0.6rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span className="mono" style={{ color: 'var(--accent-success)' }}>+</span>{item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="mono" style={{ fontSize: '0.72rem', letterSpacing: '0.14em', color: 'var(--accent-danger)' }}>MISSING</span>
            <ul style={{ listStyle: 'none', marginTop: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {report.evidence.weak.map((item) => (
                <li key={item} style={{ display: 'flex', gap: '0.6rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span className="mono" style={{ color: 'var(--accent-danger)' }}>−</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default EvidenceTrail;
