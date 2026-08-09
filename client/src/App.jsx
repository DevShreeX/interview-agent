import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Interview from './pages/Interview';
import Report from './pages/Report';
import Battle from './pages/Battle';
import Memory from './pages/Memory';

const IMMERSIVE_PATHS = ['/interview', '/battle'];

const Navigation = () => {
  const { pathname } = useLocation();
  const hidden = IMMERSIVE_PATHS.includes(pathname);

  if (hidden) return null;

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '1.25rem 0',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(6, 6, 10, 0.8)',
      backdropFilter: 'blur(12px)',
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          <span style={{ display: 'inline-flex', width: '18px', height: '18px', borderRadius: '50%', border: '1.5px solid var(--accent-electric)', boxShadow: '0 0 12px rgba(0,210,255,0.5)' }} />
          Interview Mirror
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/report" className="nav-link">Reports</Link>
          <Link to="/memory" className="nav-link">Memory</Link>
          <Link to="/interview" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Start Interview</Link>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navigation />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/report" element={<Report />} />
            <Route path="/battle" element={<Battle />} />
            <Route path="/memory" element={<Memory />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
