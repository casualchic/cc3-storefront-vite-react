/**
 * Pagination Component
 * Smart pagination with centered current page
 */

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  maxVisiblePages?: number;
}

/**
 * Calculate which page numbers to display
 * Centers current page when possible, shows first/last with ellipsis
 */
function getVisiblePages(currentPage: number, totalPages: number, maxVisible: number = 7): number[] {
  // If total pages fit in maxVisible, show all
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Calculate how many pages to show on each side of current page
  const sidePages = Math.floor((maxVisible - 3) / 2); // -3 for first, last, and current

  // Calculate range around current page
  let startPage = Math.max(2, currentPage - sidePages);
  let endPage = Math.min(totalPages - 1, currentPage + sidePages);

  // Adjust if we're near the start
  if (currentPage <= sidePages + 2) {
    endPage = Math.min(totalPages - 1, maxVisible - 2);
    startPage = 2;
  }

  // Adjust if we're near the end
  if (currentPage >= totalPages - sidePages - 1) {
    startPage = Math.max(2, totalPages - maxVisible + 2);
    endPage = totalPages - 1;
  }

  // Build the array of page numbers
  const pages: number[] = [1];

  // Add ellipsis marker before start if needed
  if (startPage > 2) {
    pages.push(-1); // -1 represents ellipsis
  }

  // Add middle pages
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // Add ellipsis marker after end if needed
  if (endPage < totalPages - 1) {
    pages.push(-2); // -2 represents ellipsis
  }

  // Always show last page if there's more than one page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  maxVisiblePages = 7
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages(currentPage, totalPages, maxVisiblePages);

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <a
          href={`${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${currentPage - 1}`}
          className="px-4 py-2 rounded bg-gray-100 text-gray-900 hover:bg-primary hover:text-white transition-colors font-medium"
          aria-label="Previous page"
        >
          Previous
        </a>
      ) : (
        <span className="px-4 py-2 rounded bg-gray-100 text-gray-400 opacity-50 cursor-not-allowed font-medium">
          Previous
        </span>
      )}

      {/* Page Numbers */}
      {visiblePages.map((pageNum, index) => {
        // Render ellipsis
        if (pageNum < 0) {
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-600">
              ...
            </span>
          );
        }

        // Render page button
        return (
          <a
            key={pageNum}
            href={`${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${pageNum}`}
            className={`px-4 py-2 rounded transition-colors font-medium ${
              pageNum === currentPage
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
            aria-label={`Page ${pageNum}`}
            aria-current={pageNum === currentPage ? 'page' : undefined}
          >
            {pageNum}
          </a>
        );
      })}

      {/* Next Button */}
      {currentPage < totalPages ? (
        <a
          href={`${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${currentPage + 1}`}
          className="px-4 py-2 rounded bg-gray-100 text-gray-900 hover:bg-primary hover:text-white transition-colors font-medium"
          aria-label="Next page"
        >
          Next
        </a>
      ) : (
        <span className="px-4 py-2 rounded bg-gray-100 text-gray-400 opacity-50 cursor-not-allowed font-medium">
          Next
        </span>
      )}
    </nav>
  );
}
