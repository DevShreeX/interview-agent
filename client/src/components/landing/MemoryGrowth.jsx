import React from 'react';
import { motion } from 'framer-motion';
import { memory } from '../../data/demoData';

const W = 640;
const H = 160;
const PAD = 20;

const MemoryGrowth = () => {
  const scores = memory.sessions.map((s) => s.readiness);
  const min = Math.min(...scores) - 6;
  const max = Math.max(...scores) + 6;
  const pts = scores.map((v, i) => {
    const x = PAD + (i / (scores.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((v - min) / (max - min)) * (H - PAD * 2);
    return [x, y];
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${H - PAD} L${pts[0][0].toFixed(1)},${H - PAD} Z`;

  return (
    <section className="section" style={{ borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: '640px', marginBottom: '3rem' }}
        >
          <span className="badge badge-electric">Memory & Growth</span>
          <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.75rem)', margin: '1.25rem 0 1rem' }}>
            It remembers. It compounds.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Readiness climbs while the calibration gap closes — session after session, the AI
            carries your weaknesses forward and tests them again.
          </p>
        </motion.div>

        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span className="mono" style={{ fontSize: '0.72rem', letterSpacing: '0.14em', color: 'var(--text-muted)' }}>READINESS INDEX</span>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {scores.map((s, i) => (
                <span key={i} className="mono" style={{ fontSize: '1.05rem', color: i === scores.length - 1 ? 'var(--accent-electric)' : 'var(--text-secondary)' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="Rising readiness score over sessions">
            <defs>
              <linearGradient id="sparkArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(0,210,255,0.25)" />
                <stop offset="100%" stopColor="rgba(0,210,255,0)" />
              </linearGradient>
              <linearGradient id="sparkLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--accent-indigo)" />
                <stop offset="100%" stopColor="var(--accent-electric)" />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#sparkArea)" />
            <motion.path
              d={line}
              fill="none"
              stroke="url(#sparkLine)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: 'easeInOut' }}
            />
            {pts.map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="3" fill="var(--bg-void)" stroke={i === pts.length - 1 ? 'var(--accent-electric)' : 'var(--text-muted)'} strokeWidth="1.5" />
                <text x={x} y={H - 2} textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontFamily="var(--font-mono)">
                  {memory.sessions[i].date}
                </text>
              </g>
            ))}
          </svg>

          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <span className="badge badge-indigo" style={{ flexShrink: 0 }}>NEXT SESSION</span>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
              <strong style={{ color: 'var(--text-primary)' }}>{memory.nextSession.focus}.</strong>{' '}
              {memory.nextSession.context}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemoryGrowth;
