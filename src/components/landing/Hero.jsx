import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ParticleNetwork from './ParticleNetwork';
import GlowButton from '../ui/GlowButton';
import Logo from '../ui/Logo';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const floatingVariants = {
  animate: (i) => ({
    y: [0, -20, 0],
    x: [0, 10 * (i % 2 === 0 ? 1 : -1), 0],
    scale: [1, 1.05, 1],
    transition: {
      duration: 6 + i * 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  }),
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Particle Network Background */}
      <div className="absolute inset-0 z-0">
        <ParticleNetwork />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-dark-950/50 via-transparent to-dark-950" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-dark-950/30 via-transparent to-dark-950/30" />

      {/* Floating Decorative Elements */}
      <motion.div
        className="absolute top-[15%] left-[10%] w-72 h-72 bg-primary/10 rounded-full blur-[100px]"
        custom={0}
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div
        className="absolute top-[60%] right-[10%] w-96 h-96 bg-secondary/10 rounded-full blur-[120px]"
        custom={1}
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-[20%] left-[30%] w-64 h-64 bg-accent/8 rounded-full blur-[80px]"
        custom={2}
        variants={floatingVariants}
        animate="animate"
      />

      {/* Main Content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase bg-white/[0.05] border border-white/[0.08] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Interactive Learning Platform
          </span>
        </motion.div>

        {/* Brand Logo */}
        <motion.div variants={itemVariants} className="mb-8 flex justify-center">
          <Logo className="w-24 h-24 rounded-3xl shadow-glow-sm" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.2] mb-8 overflow-visible"
        >
          <span
            className="gradient-text block mb-4"
            style={{ lineHeight: '1.25', paddingBottom: '0.15em', overflow: 'visible' }}
          >
            AlgoForge
          </span>
          <span className="text-slate-100 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-wide block">
            Visualize Algorithms Like Never Before
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed text-balance"
        >
          Master Data Structures and Algorithms through interactive visualizations,
          challenge-based learning, and real-time execution insights.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center"
        >
          <Link to="/sorting">
            <GlowButton variant="primary" size="lg" icon={ArrowRight}>
              Explore Algorithms
            </GlowButton>
          </Link>
        </motion.div>
      </motion.div>


    </section>
  );
}
