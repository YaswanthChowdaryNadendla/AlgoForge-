import { motion } from 'framer-motion';
import ChallengeMode from '../components/challenge/ChallengeMode';

export default function ChallengePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <ChallengeMode />
    </motion.div>
  );
}
