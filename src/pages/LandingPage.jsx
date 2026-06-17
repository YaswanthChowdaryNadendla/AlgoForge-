import { motion } from 'framer-motion';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Stats from '../components/landing/Stats';
import Showcase from '../components/landing/Showcase';
import Footer from '../components/landing/Footer';

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

export default function LandingPage() {
  return (
    <motion.div
      className="min-h-screen bg-dark-950"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Hero />
      <Features />
      <Stats />
      <Showcase />
      <Footer />
    </motion.div>
  );
}
