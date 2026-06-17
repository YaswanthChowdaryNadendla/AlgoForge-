export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-primary/10 border-primary/20 text-primary',
    best: 'bg-success/10 border-success/20 text-success',
    average: 'bg-warning/10 border-warning/20 text-warning',
    worst: 'bg-danger/10 border-danger/20 text-danger',
    info: 'bg-accent/10 border-accent/20 text-accent',
    purple: 'bg-secondary/10 border-secondary/20 text-secondary',
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-1 rounded-lg
        text-xs font-mono font-semibold
        border transition-all duration-200
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
