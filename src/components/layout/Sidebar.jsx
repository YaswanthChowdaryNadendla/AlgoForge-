import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Search, Link2, Layers, ArrowRightLeft,
  GitBranch, Network, Gauge, ChevronLeft, ChevronRight,
  Home, Brain, Globe, Github, Linkedin
} from 'lucide-react';
import Logo from '../ui/Logo';

const navItems = [
  { path: '/sorting', label: 'Sorting', icon: BarChart3 },
  { path: '/searching', label: 'Searching', icon: Search },
  { path: '/linked-list', label: 'Linked List', icon: Link2 },
  { path: '/stack', label: 'Stack', icon: Layers },
  { path: '/queue', label: 'Queue', icon: ArrowRightLeft },
  { path: '/tree', label: 'Tree', icon: GitBranch },
  { path: '/graph', label: 'Graph', icon: Network },
  { path: '/comparison', label: 'Comparison', icon: Gauge },
  { path: '/challenge', label: 'Challenge', icon: Brain },
];

const socialLinks = [
  { href: 'https://yashportfolio-two.vercel.app/', icon: Globe, label: 'Portfolio', tooltipText: 'Developer Portfolio' },
  { href: 'https://github.com/YaswanthChowdaryNadendla', icon: Github, label: 'GitHub', tooltipText: 'Developer GitHub' },
  { href: 'https://www.linkedin.com/in/yaswanth-chowdary-nadendla-174a662a8/', icon: Linkedin, label: 'LinkedIn', tooltipText: 'Developer LinkedIn' },
];

function SocialLink({ href, icon: Icon, tooltipText, collapsed }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative">
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onTouchStart={() => setHovered(true)}
        onTouchEnd={() => setTimeout(() => setHovered(false), 2000)}
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-slate-500 hover:text-white border border-white/[0.04] hover:border-white/[0.1] transition-all duration-200"
        whileHover={{ scale: 1.1 }}
      >
        <Icon className="w-4 h-4" />
      </motion.a>
      
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute z-50 px-2.5 py-1 rounded-md bg-dark-900 border border-white/10 shadow-lg text-[10px] font-semibold text-slate-200 whitespace-nowrap pointer-events-none backdrop-blur-md
              ${collapsed 
                ? 'left-full ml-3 top-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(0,0,0,0.5)]' 
                : 'bottom-full mb-2.5 left-1/2 -translate-x-1/2 shadow-[0_0_10px_rgba(0,0,0,0.5)]'
              }`}
          >
            {tooltipText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Sidebar({ collapsed = false, onToggle }) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-screen flex flex-col border-r border-white/[0.06] bg-dark-950/80 backdrop-blur-xl overflow-hidden"
    >
      {/* Logo */}
      <div className="flex flex-col justify-center px-4 py-4 border-b border-white/[0.06] shrink-0">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          <Logo className="w-9 h-9 rounded-xl shrink-0 shadow-glow-sm" />
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-bold gradient-text whitespace-nowrap"
            >
              AlgoForge
            </motion.span>
          )}
        </Link>
        {!collapsed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] text-slate-500 mt-2 leading-relaxed"
          >
            Interactive DSA learning platform featuring visualizations, execution tracing, complexity analysis, and challenge-based learning.
          </motion.p>
        )}
      </div>

      {/* Toggle Button */}
      <div className="px-3 py-2 shrink-0">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 rounded-lg
                     text-slate-500 hover:text-slate-300 hover:bg-white/[0.05]
                     transition-all duration-200"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
               transition-all duration-200 relative
                ${isActive
                  ? 'text-white bg-white/[0.08]'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
                }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-primary shadow-glow-sm"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <item.icon className={`w-[18px] h-[18px] shrink-0 transition-colors duration-200
                  ${isActive ? 'text-primary' : 'text-slate-500 group-hover:text-slate-300'}`}
                />
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>


      {/* Social Links Footer */}
      <div className={`px-3 py-2 border-t border-white/[0.06] shrink-0 flex ${collapsed ? 'flex-col items-center' : 'flex-row justify-around'} gap-2`}>
        {socialLinks.map((social) => (
          <SocialLink
            key={social.label}
            href={social.href}
            icon={social.icon}
            tooltipText={social.tooltipText}
            collapsed={collapsed}
          />
        ))}
      </div>

      {/* Home Link at Bottom */}
      <div className="px-3 py-3 border-t border-white/[0.06] shrink-0">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                     text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]
                     transition-all duration-200"
        >
          <Home className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && <span className="whitespace-nowrap">Home</span>}
        </Link>
      </div>
    </motion.aside>
  );
}
