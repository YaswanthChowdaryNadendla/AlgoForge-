import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import GlassCard from './GlassCard';
import GlowButton from './GlowButton';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <GlassCard hover={false} className="p-6 md:p-8 max-w-lg w-full border border-red-500/20 bg-red-500/[0.02] text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <div className="space-y-1.5">
              <h2 className="text-lg font-bold text-red-400">Visualization Error</h2>
              <p className="text-slate-400 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
                An error occurred while loading or rendering this visualizer page. Stale assets or a failed dynamic module import might be the cause.
              </p>
            </div>

            {this.state.error && (
              <pre className="p-3.5 rounded-xl bg-black/40 text-[10px] md:text-xs font-mono text-slate-500 overflow-auto max-h-36 border border-white/[0.05] text-left">
                {this.state.error.stack || this.state.error.toString()}
              </pre>
            )}

            <div className="pt-2">
              <GlowButton
                variant="danger"
                icon={RefreshCw}
                onClick={() => window.location.reload()}
                size="sm"
                className="mx-auto"
              >
                Reload Application
              </GlowButton>
            </div>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}
