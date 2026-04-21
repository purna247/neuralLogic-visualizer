import { BookOpen, MonitorPlay, ChevronLeft, ChevronRight, Heart, HelpCircle } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

interface SidebarProps {
  currentPage: 'playground' | 'docs';
  setCurrentPage: (page: 'playground' | 'docs') => void;
  onStartTour?: () => void;
}

export default function Sidebar({ currentPage, setCurrentPage, onStartTour }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={clsx(
      "h-full bg-white/[0.02] border-r border-white/10 py-6 flex flex-col transition-all duration-300 overflow-visible shrink-0 relative z-20",
      isCollapsed ? "w-[64px] px-2" : "w-[64px] lg:w-[220px] px-2 lg:px-4"
    )}>
      
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute right-[-12px] top-10 w-6 h-6 bg-[#1F2937] border border-white/10 rounded-full items-center justify-center text-gray-400 hover:text-white z-10 hover:bg-[#374151] transition-colors"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className={clsx(
        "flex items-center mb-8 mt-2 transition-all duration-300 border border-transparent",
        isCollapsed ? "justify-center" : "justify-center lg:justify-start lg:gap-3 lg:px-3"
      )}>
        <div className="w-8 h-8 rounded bg-blue-500/20 border border-blue-500/50 flex items-center justify-center shrink-0">
          <div className="w-3 h-3 rounded-full bg-blue-400" />
        </div>
        <span className={clsx(
          "font-bold text-white whitespace-nowrap hidden lg:block transition-all duration-300 origin-left",
          isCollapsed ? "opacity-0 w-0 scale-0" : "opacity-100 w-auto scale-100"
        )}>NeuralLogic</span>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        <button
          onClick={() => setCurrentPage('playground')}
          className={clsx(
            "flex items-center rounded-lg transition-all text-left overflow-hidden border",
            isCollapsed ? "justify-center h-10 w-10 mx-auto" : "justify-center h-10 w-10 mx-auto lg:h-auto lg:w-full lg:mx-0 lg:justify-start lg:px-3 lg:py-3 lg:gap-3",
            currentPage === 'playground' 
              ? "bg-blue-500/20 text-blue-400 border-blue-500/30" 
              : "border-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200"
          )}
        >
          <div className="w-8 flex items-center justify-center shrink-0">
            <MonitorPlay size={20} />
          </div>
          <span className={clsx(
            "text-sm font-medium whitespace-nowrap hidden lg:block transition-all duration-300 origin-left",
            isCollapsed ? "opacity-0 w-0 scale-0" : "opacity-100 w-auto scale-100"
          )}>Playground</span>
        </button>

        <button
          onClick={() => setCurrentPage('docs')}
          className={clsx(
            "flex items-center rounded-lg transition-all text-left overflow-hidden border",
            isCollapsed ? "justify-center h-10 w-10 mx-auto" : "justify-center h-10 w-10 mx-auto lg:h-auto lg:w-full lg:mx-0 lg:justify-start lg:px-3 lg:py-3 lg:gap-3",
            currentPage === 'docs' 
              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
              : "border-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200"
          )}
        >
          <div className="w-8 flex items-center justify-center shrink-0">
            <BookOpen size={20} />
          </div>
          <span className={clsx(
            "text-sm font-medium whitespace-nowrap hidden lg:block transition-all duration-300 origin-left",
            isCollapsed ? "opacity-0 w-0 scale-0" : "opacity-100 w-auto scale-100"
          )}>Documentation</span>
        </button>

        {onStartTour && (
          <button
            onClick={() => {
              setCurrentPage('playground');
              setTimeout(() => onStartTour(), 100);
            }}
            className={clsx(
              "flex items-center rounded-lg transition-all text-left overflow-hidden border border-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200 mt-2",
              isCollapsed ? "justify-center h-10 w-10 mx-auto" : "justify-center h-10 w-10 mx-auto lg:h-auto lg:w-full lg:mx-0 lg:justify-start lg:px-3 lg:py-3 lg:gap-3"
            )}
          >
            <div className="w-8 flex items-center justify-center shrink-0">
              <HelpCircle size={20} />
            </div>
            <span className={clsx(
              "text-sm font-medium whitespace-nowrap hidden lg:block transition-all duration-300 origin-left",
              isCollapsed ? "opacity-0 w-0 scale-0" : "opacity-100 w-auto scale-100"
            )}>Interactive Tour</span>
          </button>
        )}
      </nav>

      <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-center text-[10px] text-gray-500 overflow-hidden whitespace-nowrap min-h-[40px]">
        {/* Mobile or Collapsed View: Just Heart */}
        <div className={clsx(
          "flex items-center justify-center transition-all duration-300",
          !isCollapsed ? "lg:hidden" : "block"
        )}>
           <Heart size={14} className="text-red-500/80" />
        </div>

        {/* Expanded Desktop View: Full Text */}
        <div className={clsx(
          "items-center justify-center gap-1.5 transition-all duration-300 hidden",
          !isCollapsed ? "lg:flex" : "hidden"
        )}>
          Made with <Heart size={10} className="text-red-500" fill="currentColor" /> by <a href="https://github.com/purna247" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline underline-offset-2">Purna</a>
        </div>
      </div>
    </div>
  );
}
