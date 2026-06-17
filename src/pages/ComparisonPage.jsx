import { motion } from 'framer-motion';
import ComparisonMode from '../components/comparison/ComparisonMode';

export default function ComparisonPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <ComparisonMode />
    </motion.div>
  );
}
