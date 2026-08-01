import { useParams } from 'react-router-dom';
import { useSync } from '../hooks/useSync';
import Sidebar from '../components/Sidebar';
import Editor from '../components/Editor';
import ImagesView from '../components/ImagesView';
import FilesView from '../components/FilesView';
import { useStore } from '../store/useStore';
import { Check, CloudRain, Users, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Workspace() {
  const { secretCode } = useParams<{ secretCode: string }>();
  const { handleNoteChange, uploadFile } = useSync(secretCode || '');
  const { isSaving, connectedDevices } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'images' | 'files'>('notes');

  if (!secretCode) return <div className="p-8">Invalid code</div>;

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      
      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <div className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar secretCode={secretCode} onMobileClose={() => setMobileMenuOpen(false)} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      
      <main className="flex-1 flex flex-col relative min-w-0 w-full">
        {/* Top Navigation Bar */}
        <header className="h-14 border-b border-neutral-200 dark:border-neutral-800/50 flex items-center justify-between px-4 sm:px-6 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-sm z-10 shrink-0">
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 -ml-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 md:hidden transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-semibold text-base sm:text-lg tracking-tight truncate max-w-[120px] sm:max-w-none">#{secretCode}</h2>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">{connectedDevices} {connectedDevices === 1 ? 'Device' : 'Devices'}</span>
              <span className="sm:hidden">{connectedDevices}</span>
            </div>
            <div className="flex items-center gap-2 w-16 sm:w-24 justify-end">
              {isSaving ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1 sm:gap-1.5 text-neutral-500"
                >
                  <CloudRain className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
                  <span className="hidden sm:inline">Saving...</span>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1 sm:gap-1.5 text-green-600 dark:text-green-500"
                >
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Saved</span>
                </motion.div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        {activeTab === 'notes' && (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-8 w-full">
              <Editor onChange={handleNoteChange} onUploadFile={uploadFile} />
            </div>
          </div>
        )}
        {activeTab === 'images' && <ImagesView onUploadFile={uploadFile} />}
        {activeTab === 'files' && <FilesView onUploadFile={uploadFile} />}
      </main>
    </div>
  );
}
