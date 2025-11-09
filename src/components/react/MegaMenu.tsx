/**
 * Mega Menu Component
 * Dropdown mega menu for desktop navigation
 */

import { useState, useRef, useEffect } from 'react';

interface MegaMenuProps {
  label: string;
  sections: {
    title: string;
    items: { label: string; href: string; description?: string }[];
  }[];
}

export default function MegaMenu({ label, sections }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {/* Trigger */}
      <button
        className="text-gray-700 hover:text-primary font-medium transition-colors flex items-center gap-1"
        aria-expanded={isOpen}
      >
        {label}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Mega Menu Dropdown */}
      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-screen max-w-4xl">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-8">
            <div className="grid grid-cols-3 gap-8">
              {sections.map((section) => (
                <div key={section.title}>
                  <h3 className="font-semibold text-forest mb-4 text-sm uppercase tracking-wide">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.items.map((item) => (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          className="block group"
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                            {item.label}
                          </div>
                          {item.description && (
                            <div className="text-sm text-gray-500 mt-1">
                              {item.description}
                            </div>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
