export const BAR_COLORS = {
  default: 'viz-bar',
  comparing: 'viz-bar comparing',
  swapping: 'viz-bar swapping',
  sorted: 'viz-bar sorted',
  active: 'viz-bar active',
  found: 'viz-bar found',
};

export function getBarColor(index, state) {
  if (!state) return BAR_COLORS.default;
  if (state.sorted && state.sorted.includes(index)) return BAR_COLORS.sorted;
  if (state.swapping && state.swapping.includes(index)) return BAR_COLORS.swapping;
  if (state.comparing && state.comparing.includes(index)) return BAR_COLORS.comparing;
  if (state.active === index) return BAR_COLORS.active;
  if (state.found === index) return BAR_COLORS.found;
  return BAR_COLORS.default;
}

export function getBarGradient(index, state) {
  if (!state) return 'linear-gradient(180deg, #3B82F6, #2563EB)';
  if (state.sorted && state.sorted.includes(index))
    return 'linear-gradient(180deg, #10B981, #059669)';
  if (state.swapping && state.swapping.includes(index))
    return 'linear-gradient(180deg, #EF4444, #DC2626)';
  if (state.comparing && state.comparing.includes(index))
    return 'linear-gradient(180deg, #F59E0B, #D97706)';
  if (state.active === index)
    return 'linear-gradient(180deg, #06B6D4, #0891B2)';
  return 'linear-gradient(180deg, #3B82F6, #2563EB)';
}

export function getBarShadow(index, state) {
  if (!state) return '0 0 8px rgba(59,130,246,0.3)';
  if (state.sorted && state.sorted.includes(index))
    return '0 0 12px rgba(16,185,129,0.5)';
  if (state.swapping && state.swapping.includes(index))
    return '0 0 15px rgba(239,68,68,0.6)';
  if (state.comparing && state.comparing.includes(index))
    return '0 0 15px rgba(245,158,11,0.6)';
  if (state.active === index)
    return '0 0 15px rgba(6,182,212,0.5)';
  return '0 0 8px rgba(59,130,246,0.3)';
}
