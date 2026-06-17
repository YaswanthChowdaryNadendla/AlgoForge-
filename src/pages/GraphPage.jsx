import { motion } from 'framer-motion';
import GraphVisualizer from '../components/visualizers/graph/GraphVisualizer';

export default function GraphPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <GraphVisualizer />
    </motion.div>
  );
}
