import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BarChart3, Search, GitBranch, Network, Layers, Gauge } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const features = [
  {
    icon: BarChart3,
    title: 'Sorting Algorithms',
    description:
      'Watch Bubble Sort, Quick Sort, Merge Sort, and more come alive with real-time bar animations and step-by-step execution.',
    link: '/sorting',
    color: 'text-blue-400',
    glow: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Search,
    title: 'Searching Algorithms',
    description:
      'Visualize Linear Search, Binary Search, and advanced techniques with highlighted comparisons and instant feedback.',
    link: '/searching',
    color: 'text-purple-400',
    glow: 'group-hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]',
    bg: 'bg-purple-500/10',
  },
  {
    icon: GitBranch,
    title: 'Tree Structures',
    description:
      'Explore Binary Trees, BSTs, AVL Trees, and heap structures with interactive node insertion and traversal animations.',
    link: '/tree',
    color: 'text-cyan-400',
    glow: 'group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: Network,
    title: 'Graph Algorithms',
    description:
      'Dive into BFS, DFS, Dijkstra, and more with interactive graph editors and animated path-finding visualizations.',
    link: '/graph',
    color: 'text-emerald-400',
    glow: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Layers,
    title: 'Data Structures',
    description:
      'Master Stacks, Queues, and Linked Lists with push/pop animations, pointer visualizations, and operation tracing.',
    link: '/stack',
    color: 'text-amber-400',
    glow: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Gauge,
    title: 'Algorithm Racing',
    description:
      'Race algorithms head-to-head on identical datasets. Compare performance, step counts, and time complexity in real time.',
    link: '/comparison',
    color: 'text-rose-400',
    glow: 'group-hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]',
    bg: 'bg-rose-500/10',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="relative py-32 px-6" id="features">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900/50 to-dark-950 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="gradient-text">Powerful</span>{' '}
            <span className="text-slate-100">Visualizations</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Explore a comprehensive suite of algorithm and data structure
            visualizers designed to make complex concepts intuitive.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={cardVariants}>
                <Link to={feature.link} className="block group">
                  <GlassCard className={`p-8 h-full ${feature.glow}`} glow>
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-slate-100 mb-3">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                      {feature.description}
                    </p>

                    {/* Link */}
                    <span
                      className={`inline-flex items-center gap-1.5 text-sm font-medium ${feature.color} transition-all duration-300 group-hover:gap-3`}
                    >
                      Explore
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
