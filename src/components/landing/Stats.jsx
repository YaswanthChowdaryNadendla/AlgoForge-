import { motion } from 'framer-motion';
import AnimatedCounter from '../ui/AnimatedCounter';

const stats = [
  { value: 15, suffix: '+', label: 'Algorithms', description: 'Sorting, Searching, Trees, Graphs' },
  { value: null, symbol: 'Live', label: 'Real-Time Visualization', description: 'Step-by-step execution engine' },
  { value: null, symbol: 'VS', label: 'Algorithm Comparison', description: 'Compare performance side-by-side' },
  { value: null, symbol: 'Learn', label: 'Interactive Learning', description: 'Learn through visualization' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function Stats() {
  return (
    <section className="relative py-24 px-6">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900/30 to-dark-950 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          className="glass-strong p-10 sm:p-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center"
              >
                <div className="mb-3">
                  {stat.value !== null ? (
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      className="text-4xl sm:text-5xl lg:text-6xl gradient-text"
                      duration={2.5}
                    />
                  ) : (
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold gradient-text tracking-tight">
                      {stat.symbol}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-slate-200 mb-1">
                  {stat.label}
                </h3>
                <p className="text-sm text-slate-500">{stat.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
