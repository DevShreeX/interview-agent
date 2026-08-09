import React from 'react';
import Hero from '../components/landing/Hero';
import Problem from '../components/landing/Problem';
import CalibrationGap from '../components/landing/CalibrationGap';
import HowItThinks from '../components/landing/HowItThinks';
import EvidenceTrail from '../components/landing/EvidenceTrail';
import PersonasStrip from '../components/landing/PersonasStrip';
import BreakpointCard from '../components/landing/BreakpointCard';
import BattleTeaser from '../components/landing/BattleTeaser';
import MemoryGrowth from '../components/landing/MemoryGrowth';
import PrivacySection from '../components/landing/PrivacySection';
import FinalCTA from '../components/landing/FinalCTA';
import Footer from '../components/landing/Footer';

const Landing = () => (
  <div className="landing-page">
    <Hero />
    <PersonasStrip />
    <Problem />
    <CalibrationGap />
    <HowItThinks />
    <EvidenceTrail />
    <BreakpointCard />
    <BattleTeaser />
    <MemoryGrowth />
    <PrivacySection />
    <FinalCTA />
    <Footer />
  </div>
);

export default Landing;
