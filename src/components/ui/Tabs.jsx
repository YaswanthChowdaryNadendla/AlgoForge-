import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Tabs({ tabs, defaultTab = 0, onChange, className = '' }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (index) => {
    setActiveTab(index);
    onChange?.(index, tabs[index]);
  };

  return (
    <div className={className}>
      <div className="flex gap-1 p-1 rounded-xl bg-dark-800/50 border border-white/[0.04]">
        {tabs.map((tab, index) => (
          <button
            key={tab.label || index}
            onClick={() => handleTabChange(index)}
            className={`
              relative px-4 py-2 rounded-lg text-sm font-medium
              transition-colors duration-200 flex-1
              ${activeTab === index ? 'text-white' : 'text-slate-500 hover:text-slate-300'}
            `}
          >
            {activeTab === index && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-lg bg-white/[0.08] border border-white/[0.08]"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-2">
              {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
              {tab.label}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-4">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {tabs[activeTab]?.content}
        </motion.div>
      </div>
    </div>
  );
}
