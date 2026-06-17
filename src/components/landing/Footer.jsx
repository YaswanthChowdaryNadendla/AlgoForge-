import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3, Search, GitBranch, Network, Layers, ListOrdered,
  Map, FileText, Target, Brain, Activity,
  Linkedin, Github, ArrowUpRight
} from 'lucide-react';
import Logo from '../ui/Logo';

const visualizers = [
  { name: 'Sorting', path: '/sorting', icon: BarChart3 },
  { name: 'Searching', path: '/searching', icon: Search },
  { name: 'Trees', path: '/tree', icon: GitBranch },
  { name: 'Graphs', path: '/graph', icon: Network },
  { name: 'Stacks', path: '/stack', icon: Layers },
  { name: 'Queues', path: '/queue', icon: ListOrdered },
];

const resources = [
  {
    name: 'DSA Roadmap',
    description: 'Complete learning path from beginner to advanced.',
    path: 'https://roadmap.sh/datastructures-and-algorithms',
    icon: Map
  },
  {
    name: 'Striver A2Z DSA Sheet',
    description: 'Comprehensive DSA problem-solving roadmap.',
    path: 'https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z',
    icon: FileText
  },
  {
    name: 'Blind 75',
    description: 'Most important interview preparation questions.',
    path: 'https://leetcode.com/problem-list/oizxjoit/',
    icon: Target
  },
  {
    name: 'NeetCode 150',
    description: 'Structured coding interview preparation sheet.',
    path: 'https://neetcode.io/practice/practice/neetcode150',
    icon: Brain
  },
  {
    name: 'Complexity Cheat Sheet',
    description: 'Quick reference for time and space complexities.',
    path: 'https://www.hackerearth.com/practice/notes/big-o-cheatsheet-series-data-structures-and-algorithms-with-thier-complexities-1/',
    icon: Activity
  },
  {
    name: 'Practice Company Based Problems',
    description: 'Collection of problems asked in top tech companies.',
    path: 'https://leetcode.com/explore/interview/card/top-interview-questions-easy/',
    icon: BarChart3
  },

];

function FooterLink({ to, icon: Icon, label, description }) {
  return (
    <Link to={to} className="group block select-none">
      <div className="flex items-start gap-3">
        <motion.div
          whileHover={{ scale: 1.15, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          className="w-8 h-8 rounded-lg bg-white/[0.03] group-hover:bg-primary/10 border border-white/[0.06] group-hover:border-primary/30 flex items-center justify-center text-slate-500 group-hover:text-primary transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.25)] shrink-0 mt-0.5"
        >
          <Icon className="w-4 h-4" />
        </motion.div>
        <div>
          <span className="text-sm font-semibold text-slate-400 group-hover:text-slate-200 transition-colors duration-200 block">
            {label}
          </span>
          {description && (
            <span className="text-xs text-slate-600 group-hover:text-slate-500 transition-colors duration-200 block mt-0.5 leading-normal">
              {description}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06]">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 to-dark-900/50 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
              <Logo className="w-9 h-9 rounded-xl shrink-0 shadow-glow-sm" />
              <span className="text-xl font-bold text-slate-100">AlgoForge</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Interactive DSA learning platform featuring visualizations,
              execution tracing, complexity analysis, and challenge-based learning.
            </p>

            {/* CONNECT Section */}
            <div className="mt-8 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Connect</h4>
              
              {/* LinkedIn Card */}
              <motion.a
                href="https://www.linkedin.com/in/yaswanth-chowdary-nadendla-174a662a8/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                {/* Background glow animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="relative flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#0077B5]/10 group-hover:bg-[#0077B5]/20 flex items-center justify-center text-[#0077B5] transition-colors duration-200">
                      <Linkedin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">LinkedIn</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Connect with me on LinkedIn</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-primary transition-all duration-200 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </motion.a>

              {/* GitHub Card */}
              <motion.a
                href="https://github.com/YaswanthChowdaryNadendla"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-[#8B5CF6]/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                {/* Background glow animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="relative flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center text-slate-200 transition-colors duration-200">
                      <Github className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">GitHub</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Check out my projects on GitHub</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-[#8B5CF6] transition-all duration-200 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </motion.a>
            </div>
          </motion.div>

          {/* Visualizers Column */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-5">
              Visualizers
            </h4>
            <div className="space-y-4">
              {visualizers.map((vis) => (
                <FooterLink
                  key={vis.name}
                  to={vis.path}
                  icon={vis.icon}
                  label={vis.name}
                />
              ))}
            </div>
          </motion.div>

          {/* Resources Column */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-5">
              Resources
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              {resources.map((res) => (
                <FooterLink
                  key={res.name}
                  to={res.path}
                  icon={res.icon}
                  label={res.name}
                  description={res.description}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-xs text-slate-500 font-semibold select-none">
          <span className="text-slate-400">{`Turning TLEs into ACs.`}</span>
          <span className="hidden md:inline text-white/[0.08]">|</span>
          <span className="text-slate-400">© 2026 AlgoForge</span>
          <span className="hidden md:inline text-white/[0.08]">|</span>
          <div className="flex items-center gap-1">
            <span>Built by</span>
            <a
              href="https://www.linkedin.com/in/yaswanth-chowdary-nadendla-174a662a8/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white hover:underline transition-all duration-200"
            >
              Yaswanth Chowdary Nadendla
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
