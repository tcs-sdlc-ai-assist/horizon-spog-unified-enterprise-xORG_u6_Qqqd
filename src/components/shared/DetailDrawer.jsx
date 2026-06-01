import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function DetailDrawer({ isOpen, onClose, title, children }) {
  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-dark-950/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white dark:bg-dark-900 h-full shadow-2xl border-l border-dark-200 dark:border-dark-800 flex flex-col justify-between z-10 animate-fade-in animate-slide-up">
        {/* Header */}
        <div className="h-16 px-6 border-b border-dark-200 dark:border-dark-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-dark-950 dark:text-dark-50 truncate">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin space-y-6 text-sm">
          {children}
        </div>

        {/* Footer */}
        <div className="h-16 px-6 border-t border-dark-200 dark:border-dark-800 flex items-center justify-end bg-dark-50 dark:bg-dark-950/30">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 text-xs font-semibold text-dark-700 dark:text-dark-300 rounded-lg transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
