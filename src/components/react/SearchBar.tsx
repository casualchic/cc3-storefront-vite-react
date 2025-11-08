/**
 * SearchBar Component
 * Search input with autocomplete suggestions
 */

import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../../lib/hooks/useDebounce';
import { SEARCH } from '../../lib/constants';

interface SearchBarProps {
  placeholder?: string;
  initialQuery?: string;
  onSearch?: (query: string) => void;
  showSuggestions?: boolean;
}

export default function SearchBar({
  placeholder = 'Search products...',
  initialQuery = '',
  onSearch,
  showSuggestions = true
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, SEARCH.DEBOUNCE_DELAY);

  // Fetch suggestions when query changes
  useEffect(() => {
    const abortController = new AbortController();

    if (showSuggestions && debouncedQuery.trim().length >= SEARCH.MIN_QUERY_LENGTH) {
      fetchSuggestions(debouncedQuery, abortController.signal);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }

    // Cleanup: abort pending requests when component unmounts or query changes
    return () => {
      abortController.abort();
    };
  }, [debouncedQuery, showSuggestions]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (searchQuery: string, signal: AbortSignal) => {
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&suggestions=true`,
        { signal }
      );
      const data = await response.json() as { suggestions?: string[] };
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
        setIsOpen(true);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    } catch (error) {
      // Don't update state if request was aborted
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
      }
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setIsOpen(false);
    if (onSearch) {
      onSearch(suggestion);
    } else {
      window.location.href = `/search?q=${encodeURIComponent(suggestion)}`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault();
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />

        {/* Search Icon */}
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                index === selectedIndex ? 'bg-gray-100' : ''
              }`}
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-gray-900">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
