import { motion } from 'framer-motion';
import LinkedListVisualizer from '../components/visualizers/linkedlist/LinkedListVisualizer';

export default function LinkedListPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <LinkedListVisualizer />
    </motion.div>
  );
}
