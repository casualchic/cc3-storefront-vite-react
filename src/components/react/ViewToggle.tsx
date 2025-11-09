/**
 * ViewToggle Component
 * Toggle between grid and list views for product listings
 */

import { useState, useEffect } from 'react';

interface ViewToggleProps {
  currentView?: 'grid' | 'list';
  onViewChange?: (view: 'grid' | 'list') => void;
}

export default function ViewToggle({
  currentView = 'grid',
  onViewChange,
}: ViewToggleProps) {
  const [view, setView] = useState<'grid' | 'list'>(currentView);

  useEffect(() => {
    setView(currentView);
  }, [currentView]);

  const handleViewChange = (newView: 'grid' | 'list') => {
    setView(newView);

    if (onViewChange) {
      onViewChange(newView);
    } else {
      // Store in localStorage for persistence
      localStorage.setItem('productView', newView);
      // Optionally trigger a custom event for other components to listen to
      window.dispatchEvent(new CustomEvent('viewChange', { detail: { view: newView } }));
    }
  };

  return (
    <div className="flex items-center gap-1 border border-neutral rounded-lg p-1">
      {/* Grid View Button */}
      <button
        onClick={() => handleViewChange('grid')}
        className={`
          p-2 rounded transition-colors
          ${view === 'grid'
            ? 'bg-primary text-white'
            : 'text-charcoal hover:bg-neutral'
          }
        `}
        aria-label="Grid view"
        aria-pressed={view === 'grid'}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>

      {/* List View Button */}
      <button
        onClick={() => handleViewChange('list')}
        className={`
          p-2 rounded transition-colors
          ${view === 'list'
            ? 'bg-primary text-white'
            : 'text-charcoal hover:bg-neutral'
          }
        `}
        aria-label="List view"
        aria-pressed={view === 'list'}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}
