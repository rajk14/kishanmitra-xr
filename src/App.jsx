import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot';
import LoadingScanner from './components/LoadingScanner';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Diagnose = lazy(() => import('./pages/Diagnose'));
const History = lazy(() => import('./pages/History'));
const Learn = lazy(() => import('./pages/Learn'));
const Pricing = lazy(() => import('./pages/Pricing'));

function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-background selection:bg-primary/30">
        <Navbar />
        
        <main>
          <Suspense fallback={<LoadingScanner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/diagnose" element={<Diagnose />} />
              <Route path="/history" element={<History />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>

        <ChatBot />
      </div>
    </Router>
  );
}

export default App;
