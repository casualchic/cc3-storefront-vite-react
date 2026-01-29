import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ProductDescriptionProps {
  description: string;
  isHtml?: boolean;
}

export function ProductDescription({ description, isHtml = false }: ProductDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="border-t dark:border-gray-800">
      <button
        onClick={toggleExpanded}
        className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
        aria-expanded={isExpanded}
      >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Product Description
        </h3>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[1000px] opacity-100 pb-6' : 'max-h-0 opacity-0'
        }`}
      >
        {isHtml ? (
          <div
            className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        ) : (
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
