import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = true, glow = false, ...props }) {
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl
        bg-white/[0.03] backdrop-blur-xl
        border border-white/[0.06]
        ${hover ? 'transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.12]' : ''}
        ${glow ? 'shadow-glow-sm hover:shadow-glow-md' : ''}
        ${className}
      `}
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className={`relative z-10 w-full h-full ${className.includes('flex') ? 'flex flex-col flex-1 min-h-0' : ''}`}>
        {children}
      </div>
    </motion.div>
  );
}
