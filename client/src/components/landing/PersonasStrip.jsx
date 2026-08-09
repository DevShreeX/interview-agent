import React from 'react';
import { motion } from 'framer-motion';
import { personas } from '../../data/demoData';

const PersonasStrip = () => (
  <section className="section" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
    <div className="container">
      <div className="grid-3">
        {personas.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: i * 0.1 }}
            className="card card-interactive"
            style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', borderColor: 'var(--border-subtle)' }}
          >
            {/* Monochrome avatar glyph */}
            <div aria-hidden style={{
              width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
              border: `1px solid ${p.accent}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: p.accent,
              background: 'var(--bg-void)',
              boxShadow: `0 0 16px ${p.accent.replace(')', ', 0.2)')}`,
            }}>
              {p.glyph}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '1rem', fontFamily: 'var(--font-display)' }}>{p.name}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.focus}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PersonasStrip;
