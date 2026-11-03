import React from "react";

export default function AUPAGINATION({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showPageSize = false,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  onPageSizeChange,
  showJumpToPage = false,
  className = "",
  ...rest
}) {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    onPageSizeChange(newSize);
  };

  const handleJumpToPage = (e) => {
    e.preventDefault();
    const page = parseInt(e.target.elements.page.value);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            className={`au-pagination__page ${i === currentPage ? 'au-pagination__page--active' : ''}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }
    } else {
      // Always show first page
      pages.push(
        <button
          key={1}
          className={`au-pagination__page ${1 === currentPage ? 'au-pagination__page--active' : ''}`}
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );

      // Show ellipsis if needed
      if (currentPage > 3) {
        pages.push(<span key="start-ellipsis" className="au-pagination__ellipsis">...</span>);
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(
          <button
            key={i}
            className={`au-pagination__page ${i === currentPage ? 'au-pagination__page--active' : ''}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        pages.push(<span key="end-ellipsis" className="au-pagination__ellipsis">...</span>);
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(
          <button
            key={totalPages}
            className={`au-pagination__page ${totalPages === currentPage ? 'au-pagination__page--active' : ''}`}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </button>
        );
      }
    }

    return pages;
  };

  const classes = [
    "au-pagination",
    className
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} {...rest}>
      {showPageSize && (
        <div className="au-pagination__page-size">
          <label htmlFor="page-size">Items per page:</label>
          <select
            id="page-size"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      )}

      <div className="au-pagination__controls">
        <button
          className="au-pagination__nav au-pagination__nav--prev"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <div className="au-pagination__pages">
          {renderPageNumbers()}
        </div>

        <button
          className="au-pagination__nav au-pagination__nav--next"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {showJumpToPage && (
        <form className="au-pagination__jump" onSubmit={handleJumpToPage}>
          <label htmlFor="jump-page">Go to page:</label>
          <input
            id="jump-page"
            name="page"
            type="number"
            min="1"
            max={totalPages}
            defaultValue={currentPage}
          />
          <button type="submit">Go</button>
        </form>
      )}
    </div>
  );
}