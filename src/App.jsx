import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from './components/ui/Logo';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const SortingPage = lazy(() => import('./pages/SortingPage'));
const SearchingPage = lazy(() => import('./pages/SearchingPage'));
const LinkedListPage = lazy(() => import('./pages/LinkedListPage'));
const StackPage = lazy(() => import('./pages/StackPage'));
const QueuePage = lazy(() => import('./pages/QueuePage'));
const TreePage = lazy(() => import('./pages/TreePage'));
const GraphPage = lazy(() => import('./pages/GraphPage'));
const ComparisonPage = lazy(() => import('./pages/ComparisonPage'));
const ChallengePage = lazy(() => import('./pages/ChallengePage'));

import AppLayout from './components/layout/AppLayout';

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-dark-950">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Logo className="w-16 h-16 rounded-2xl shadow-glow-sm" />
        </motion.div>
        <p className="text-slate-500 text-xs font-semibold tracking-widest uppercase animate-pulse mt-2">
          Loading AlgoForge...
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<AppLayout />}>
          <Route path="/sorting" element={<SortingPage />} />
          <Route path="/searching" element={<SearchingPage />} />
          <Route path="/linked-list" element={<LinkedListPage />} />
          <Route path="/stack" element={<StackPage />} />
          <Route path="/queue" element={<QueuePage />} />
          <Route path="/tree" element={<TreePage />} />
          <Route path="/graph" element={<GraphPage />} />
          <Route path="/comparison" element={<ComparisonPage />} />
          <Route path="/challenge" element={<ChallengePage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
