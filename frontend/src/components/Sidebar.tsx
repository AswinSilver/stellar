import { FileText, Image as ImageIcon, Files, Settings, Info, Search, Menu, LogOut } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  secretCode: string;
  onMobileClose?: () => void;
}

export default function Sidebar({ secretCode: _, onMobileClose }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();

  const navItems = [
    { icon: FileText, label: 'Notes', active: true },
    { icon: ImageIcon, label: 'Images' },
    { icon: Files, label: 'Files' },
    { icon: Search, label: 'Search' },
  ];

  const bottomItems = [
    { icon: Settings, label: 'Settings' },
    { icon: Info, label: 'About' },
  ];

  return (
    <motion.aside
      animate={{ width: isExpanded ? 240 : 72 }}
      className="h-full border-r border-neutral-200 dark:border-neutral-800/50 bg-neutral-50 dark:bg-neutral-900 flex flex-col transition-colors duration-300 z-20"
    >
      <div className="p-4 flex items-center justify-between h-14">
        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-bold text-xl tracking-tight text-neutral-800 dark:text-neutral-100 flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              SyncPad
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 transition-colors hidden md:block"
          >
            <Menu className="w-5 h-5" />
          </button>
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 transition-colors md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
        {navItems.map((item, i) => (
          <button
            key={i}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
              item.active 
                ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 font-medium' 
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <item.icon className={`w-5 h-5 ${item.active ? 'text-blue-500' : 'group-hover:text-neutral-900 dark:group-hover:text-neutral-200'}`} />
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap overflow-hidden text-sm"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800/50 flex flex-col gap-1">
        {bottomItems.map((item, i) => (
          <button
            key={i}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-200 transition-all group"
          >
            <item.icon className="w-5 h-5 group-hover:text-neutral-900 dark:group-hover:text-neutral-200" />
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap overflow-hidden text-sm"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
        
        <button
          onClick={() => {
            onMobileClose?.();
            navigate('/');
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all group mt-2"
        >
          <LogOut className="w-5 h-5" />
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="whitespace-nowrap overflow-hidden text-sm font-medium"
              >
                Leave Room
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
