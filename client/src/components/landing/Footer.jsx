import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '2.5rem 0 3rem' }}>
    <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem' }}>
        <span style={{ display: 'inline-flex', width: '14px', height: '14px', borderRadius: '50%', border: '1.5px solid var(--accent-electric)' }} />
        Interview Mirror
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/interview" className="nav-link">Interview</Link>
        <Link to="/report" className="nav-link">Reports</Link>
        <Link to="/memory" className="nav-link">Memory</Link>
        <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>© 2026</span>
      </div>
    </div>
  </footer>
);

export default Footer;
