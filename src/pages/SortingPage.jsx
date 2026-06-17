import { motion } from 'framer-motion';
import SortingVisualizer from '../components/visualizers/sorting/SortingVisualizer';

export default function SortingPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <SortingVisualizer />
    </motion.div>
  );
}
