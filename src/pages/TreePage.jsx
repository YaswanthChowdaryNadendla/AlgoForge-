import { motion } from 'framer-motion';
import TreeVisualizer from '../components/visualizers/tree/TreeVisualizer';

export default function TreePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <TreeVisualizer />
    </motion.div>
  );
}
