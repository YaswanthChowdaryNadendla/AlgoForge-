import { motion } from 'framer-motion';
import StackVisualizer from '../components/visualizers/stack/StackVisualizer';

export default function StackPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <StackVisualizer />
    </motion.div>
  );
}
