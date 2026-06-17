import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, BookOpen, Cpu, BarChart2, Lightbulb, ThumbsUp, ThumbsDown, HelpCircle, AlertTriangle } from 'lucide-react';
import Badge from '../ui/Badge';

const sections = [
  { key: 'overview', label: 'Overview', icon: BookOpen },
  { key: 'howItWorks', label: 'How It Works', icon: Cpu },
  { key: 'complexity', label: 'Complexity Analysis', icon: BarChart2 },
  { key: 'applications', label: 'Applications', icon: Lightbulb },
  { key: 'proscons', label: 'Pros & Cons', icon: ThumbsUp },
  { key: 'interviewQuestions', label: 'Interview Questions', icon: HelpCircle },
  { key: 'commonMistakes', label: 'Common Mistakes', icon: AlertTriangle },
];

function AccordionItem({ section, isOpen, onToggle, sectionRef, children }) {
  const Icon = section.icon;
  return (
    <div ref={sectionRef} className="border-b border-white/[0.04] last:border-0 scroll-mt-2">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left
                   hover:bg-white/[0.02] transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-slate-200">{section.label}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pl-12 text-sm text-slate-300 leading-relaxed font-sans space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AlgorithmInfo({ algorithmName }) {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState({
    overview: true,
    howItWorks: false,
    complexity: false,
    applications: false,
    proscons: false,
    interviewQuestions: false,
    commonMistakes: false,
  });

  const scrollContainerRef = useRef(null);
  
  // Section refs for Table of Contents scrolling
  const sectionRefs = {
    overview: useRef(null),
    howItWorks: useRef(null),
    complexity: useRef(null),
    applications: useRef(null),
    proscons: useRef(null),
    interviewQuestions: useRef(null),
    commonMistakes: useRef(null),
  };

  useEffect(() => {
    setLoading(true);
    import('../../data/algorithmInfo.json')
      .then((module) => {
        setInfo(module.default[algorithmName] || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load algorithm info:', err);
        setInfo(null);
        setLoading(false);
      });
  }, [algorithmName]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center gap-2">
        <div className="w-4 h-4 rounded-full border border-primary/20 border-t-primary animate-spin" />
        <span className="text-slate-500 text-xs font-medium">Loading documentation...</span>
      </div>
    );
  }

  if (!info) {
    return (
      <div className="p-6">
        <p className="text-slate-500 text-sm">No information available for this algorithm.</p>
      </div>
    );
  }

  const toggle = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const scrollToSection = (key) => {
    // 1. Force the target section to be open
    setOpenSections((prev) => ({ ...prev, [key]: true }));

    // 2. Scroll content container to the element's position relative to container
    setTimeout(() => {
      const target = sectionRefs[key].current;
      if (target) {
        const isMobileLayout = window.innerWidth < 1024; // lg breakpoint matches Tailwind

        if (isMobileLayout) {
          const mainElement = document.querySelector('main');
          if (mainElement) {
            const mainTop = mainElement.getBoundingClientRect().top;
            const targetTop = target.getBoundingClientRect().top;
            // Offsets: Tab Header (41px) + Chips Nav Bar (40px) = 81px + small padding = 85px
            const scrollOffset = targetTop - mainTop + mainElement.scrollTop - 85;
            
            mainElement.scrollTo({
              top: scrollOffset,
              behavior: 'smooth'
            });
          }
        } else {
          const container = scrollContainerRef.current;
          if (container) {
            const containerTop = container.getBoundingClientRect().top;
            const targetTop = target.getBoundingClientRect().top;
            const scrollOffset = targetTop - containerTop + container.scrollTop - 4;
            
            container.scrollTo({
              top: scrollOffset,
              behavior: 'smooth'
            });
          }
        }
      }
    }, 120);
  };

  return (
    <div className="flex flex-col h-auto lg:h-full overflow-visible lg:overflow-hidden bg-transparent">
      {/* Title Header */}
      <div className="px-5 py-3.5 border-b border-white/[0.06] shrink-0">
        <h3 className="text-base font-bold text-white leading-snug">{info.name}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{info.category}</p>
      </div>

      {/* Table of Contents Section Nav Bar (Sticky on mobile below Tab Header, relative on desktop) */}
      <div className="flex gap-1.5 overflow-x-auto py-2.5 px-5 border-b border-white/[0.06] no-scrollbar shrink-0 bg-dark-950/95 backdrop-blur-md sticky top-[41px] lg:relative lg:top-auto lg:bg-white/[0.01] lg:backdrop-filter-none z-20">
        {sections.map((sec) => {
          if (sec.key === 'interviewQuestions' && !info.interviewQuestions) return null;
          if (sec.key === 'commonMistakes' && !info.commonMistakes) return null;
          
          return (
            <button
              key={sec.key}
              onClick={() => scrollToSection(sec.key)}
              className="px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.05] transition-all"
            >
              {sec.label}
            </button>
          );
        })}
      </div>

      {/* Scrollable Content Panel (Scrolls internally on desktop, expands fully on mobile) */}
      <div ref={scrollContainerRef} className="flex-1 overflow-visible lg:overflow-y-auto custom-scrollbar scroll-smooth pr-1 py-1">
        {/* Overview */}
        <AccordionItem
          section={sections[0]}
          isOpen={openSections.overview}
          onToggle={() => toggle('overview')}
          sectionRef={sectionRefs.overview}
        >
          <p className="text-slate-300 leading-relaxed text-xs sm:text-sm text-balance">
            {info.description}
          </p>
        </AccordionItem>

        {/* How It Works */}
        <AccordionItem
          section={sections[1]}
          isOpen={openSections.howItWorks}
          onToggle={() => toggle('howItWorks')}
          sectionRef={sectionRefs.howItWorks}
        >
          <ol className="space-y-3">
            {info.howItWorks.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded bg-white/[0.04] text-[10px] font-mono text-slate-400 border border-white/[0.06] shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-slate-300 text-xs sm:text-sm leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </AccordionItem>

        {/* Complexity Analysis */}
        <AccordionItem
          section={sections[2]}
          isOpen={openSections.complexity}
          onToggle={() => toggle('complexity')}
          sectionRef={sectionRefs.complexity}
        >
          <div className="grid grid-cols-2 gap-3 font-sans">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.01] border border-white/[0.04]">
              <span className="text-xs text-slate-500">Best Case</span>
              <Badge variant="best">{info.complexity.best}</Badge>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.01] border border-white/[0.04]">
              <span className="text-xs text-slate-500">Average</span>
              <Badge variant="average">{info.complexity.average}</Badge>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.01] border border-white/[0.04]">
              <span className="text-xs text-slate-500">Worst Case</span>
              <Badge variant="worst">{info.complexity.worst}</Badge>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.01] border border-white/[0.04]">
              <span className="text-xs text-slate-500">Space</span>
              <Badge variant="info">{info.complexity.space}</Badge>
            </div>
          </div>
        </AccordionItem>

        {/* Applications */}
        <AccordionItem
          section={sections[3]}
          isOpen={openSections.applications}
          onToggle={() => toggle('applications')}
          sectionRef={sectionRefs.applications}
        >
          <ul className="space-y-2">
            {info.applications.map((app, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-primary mt-1 text-xs shrink-0">•</span>
                <span className="text-slate-300 text-xs sm:text-sm leading-relaxed">{app}</span>
              </li>
            ))}
          </ul>
        </AccordionItem>

        {/* Pros & Cons */}
        <AccordionItem
          section={sections[4]}
          isOpen={openSections.proscons}
          onToggle={() => toggle('proscons')}
          sectionRef={sectionRefs.proscons}
        >
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-success mb-2 flex items-center gap-1.5">
                <ThumbsUp className="w-3.5 h-3.5" /> Advantages
              </p>
              <ul className="space-y-1.5">
                {info.advantages.map((adv, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-success mt-0.5 text-xs font-bold font-mono">+</span>
                    <span className="text-slate-300 text-xs sm:text-sm leading-relaxed">{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-white/[0.03] pt-3">
              <p className="text-xs font-semibold text-danger mb-2 flex items-center gap-1.5">
                <ThumbsDown className="w-3.5 h-3.5" /> Disadvantages
              </p>
              <ul className="space-y-1.5">
                {info.disadvantages.map((dis, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-danger mt-0.5 text-xs font-bold font-mono">−</span>
                    <span className="text-slate-300 text-xs sm:text-sm leading-relaxed">{dis}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AccordionItem>

        {/* Interview Questions */}
        {info.interviewQuestions && (
          <AccordionItem
            section={sections[5]}
            isOpen={openSections.interviewQuestions}
            onToggle={() => toggle('interviewQuestions')}
            sectionRef={sectionRefs.interviewQuestions}
          >
            <ul className="space-y-3">
              {info.interviewQuestions.map((q, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-[9px] font-bold text-primary shrink-0 mt-0.5">
                    Q
                  </span>
                  <span className="text-slate-300 text-xs sm:text-sm leading-relaxed font-semibold">{q}</span>
                </li>
              ))}
            </ul>
          </AccordionItem>
        )}

        {/* Common Mistakes */}
        {info.commonMistakes && (
          <AccordionItem
            section={sections[6]}
            isOpen={openSections.commonMistakes}
            onToggle={() => toggle('commonMistakes')}
            sectionRef={sectionRefs.commonMistakes}
          >
            <ul className="space-y-2">
              {info.commonMistakes.map((mistake, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-amber-400 mt-0.5 text-xs shrink-0">⚠</span>
                  <span className="text-slate-300 text-xs sm:text-sm leading-relaxed">{mistake}</span>
                </li>
              ))}
            </ul>
          </AccordionItem>
        )}
      </div>
    </div>
  );
}
