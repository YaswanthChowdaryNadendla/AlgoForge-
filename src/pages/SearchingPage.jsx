import { motion } from 'framer-motion';
import SearchingVisualizer from '../components/visualizers/searching/SearchingVisualizer';

export default function SearchingPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <SearchingVisualizer />
    </motion.div>
  );
}
