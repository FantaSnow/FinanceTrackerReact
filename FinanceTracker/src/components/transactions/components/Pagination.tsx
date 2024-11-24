import React from "react";
import "../../../css/Transaction.css";

type Props = {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
};

const Pagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  handlePageChange,
}) => {
  const renderPaginationButtons = () => {
    const maxPagesToShow = 5;
    const buttons = [];
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            className={`page-btn ${i === currentPage ? "active" : ""}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          buttons.push(
            <button
              key={i}
              className={`page-btn ${i === currentPage ? "active" : ""}`}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </button>
          );
        }
        buttons.push(<span key="ellipsis">...</span>);
        buttons.push(
          <button
            key={totalPages}
            className={`page-btn ${totalPages === currentPage ? "active" : ""}`}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </button>
        );
      } else if (currentPage >= totalPages - 2) {
        buttons.push(
          <button
            key={1}
            className={`page-btn ${1 === currentPage ? "active" : ""}`}
            onClick={() => handlePageChange(1)}
          >
            1
          </button>
        );
        buttons.push(<span key="ellipsis">...</span>);
        for (let i = totalPages - 3; i <= totalPages; i++) {
          buttons.push(
            <button
              key={i}
              className={`page-btn ${i === currentPage ? "active" : ""}`}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </button>
          );
        }
      } else {
        buttons.push(
          <button
            key={1}
            className={`page-btn ${1 === currentPage ? "active" : ""}`}
            onClick={() => handlePageChange(1)}
          >
            1
          </button>
        );
        buttons.push(<span key="ellipsis">...</span>);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          buttons.push(
            <button
              key={i}
              className={`page-btn ${i === currentPage ? "active" : ""}`}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </button>
          );
        }
        buttons.push(<span key="ellipsis-last">...</span>);
        buttons.push(
          <button
            key={totalPages}
            className={`page-btn ${totalPages === currentPage ? "active" : ""}`}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </button>
        );
      }
    }
    return buttons;
  };

  return <div className="pagination">{renderPaginationButtons()}</div>;
};

export default Pagination;
