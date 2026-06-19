import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Code2 } from 'lucide-react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('cpp', cpp);

const languages = [
  { key: 'javascript', label: 'JavaScript', lang: 'javascript' },
  { key: 'python', label: 'Python', lang: 'python' },
  { key: 'java', label: 'Java', lang: 'java' },
  { key: 'cpp', label: 'C++', lang: 'cpp' },
];

const customTheme = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: 'transparent',
    margin: 0,
    padding: '1rem',
    fontSize: '0.8125rem',
    lineHeight: '1.7',
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: 'transparent',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  },
};

/**
 * CodeViewer with active line highlighting for code synchronization.
 * @param {string} algorithmName - key into codeSnippets
 * @param {number|null} activeLine - 1-indexed line to highlight (from step.codeLine)
 */
export default function CodeViewer({ algorithmName, activeLine = null }) {
  const [snippets, setSnippets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLang, setActiveLang] = useState(0);
  const [copied, setCopied] = useState(false);
  const codeContainerRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    import('../../data/codeSnippets.json')
      .then((module) => {
        setSnippets(module.default[algorithmName] || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load code snippets:', err);
        setSnippets(null);
        setLoading(false);
      });
  }, [algorithmName]);

  // Auto-scroll to active line
  useEffect(() => {
    if (activeLine && codeContainerRef.current) {
      const lineEl = codeContainerRef.current.querySelector(`[data-line="${activeLine}"]`);
      if (lineEl) {
        lineEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeLine]);

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6 flex items-center justify-center gap-2">
        <div className="w-4 h-4 rounded-full border border-primary/20 border-t-primary animate-spin" />
        <span className="text-slate-500 text-xs font-medium">Loading code viewer...</span>
      </div>
    );
  }

  if (!snippets) {
    return (
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 text-slate-500">
          <Code2 className="w-5 h-5" />
          <span className="text-sm">No code available for this algorithm.</span>
        </div>
      </div>
    );
  }

  const currentLang = languages[activeLang];
  const code = snippets[currentLang.key] || '// Code not available';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Custom line props for highlighting the active line
  const lineProps = (lineNumber) => {
    const isActive = activeLine === lineNumber;
    return {
      'data-line': lineNumber,
      style: {
        display: 'block',
        backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
        borderLeft: isActive ? '3px solid #3B82F6' : '3px solid transparent',
        paddingLeft: isActive ? '0.75rem' : '0.75rem',
        transition: 'background-color 0.2s, border-color 0.2s',
        position: 'relative',
      },
    };
  };

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-slate-300">Implementation</span>
          {activeLine && (
            <span className="px-1.5 py-0.5 rounded bg-primary/15 text-primary text-[10px] font-mono">
              Line {activeLine}
            </span>
          )}
        </div>
        <motion.button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                      bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-slate-900 dark:hover:text-white
                     border border-white/[0.06] transition-all duration-200"
          whileTap={{ scale: 0.95 }}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-success" />
              <span className="text-success">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Language Tabs */}
      <div className="flex gap-1 px-4 pt-3">
        {languages.map((lang, index) => (
          <button
            key={lang.key}
            onClick={() => { setActiveLang(index); setCopied(false); }}
            className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
              ${activeLang === index
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
          >
            {activeLang === index && (
              <motion.div
                layoutId="code-tab"
                className="absolute inset-0 rounded-lg bg-white/[0.08] border border-white/[0.08]"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">{lang.label}</span>
          </button>
        ))}
      </div>

      {/* Code */}
      <div ref={codeContainerRef} className="max-h-[400px] overflow-auto">
        <SyntaxHighlighter
          language={currentLang.lang}
          style={customTheme}
          showLineNumbers
          wrapLines
          lineProps={lineProps}
          lineNumberStyle={{
            color: '#334155',
            fontSize: '0.75rem',
            paddingRight: '1rem',
            minWidth: '2.5rem',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
