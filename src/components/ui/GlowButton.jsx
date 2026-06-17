import { motion } from 'framer-motion';

export default function GlowButton({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  ...props
}) {
  const variants = {
    primary: 'bg-primary hover:bg-primary-600 text-white shadow-glow-sm hover:shadow-glow-md',
    secondary: 'bg-secondary hover:bg-secondary-600 text-white shadow-glow-purple hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]',
    accent: 'bg-accent hover:bg-accent-600 text-white shadow-glow-cyan hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]',
    ghost: 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border border-white/[0.08] hover:border-white/[0.15]',
    danger: 'bg-danger/20 hover:bg-danger/30 text-danger border border-danger/20 hover:border-danger/40',
    success: 'bg-success/20 hover:bg-success/30 text-success border border-success/20 hover:border-success/40',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
  };

  return (
    <motion.button
      className={`
        inline-flex items-center justify-center rounded-xl font-semibold
        transition-all duration-300 ease-out
        disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      {...props}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
      {children}
    </motion.button>
  );
}
