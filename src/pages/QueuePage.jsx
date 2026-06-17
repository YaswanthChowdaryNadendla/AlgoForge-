import { motion } from 'framer-motion';
import QueueVisualizer from '../components/visualizers/queue/QueueVisualizer';

export default function QueuePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <QueueVisualizer />
    </motion.div>
  );
}
