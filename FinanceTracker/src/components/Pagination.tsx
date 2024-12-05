import React from "react";
import "../css/Transaction.css";

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

    const createButton = (page: number) => (
      <button
        key={page}
        className={`page-btn ${page === currentPage ? "active" : ""}`}
        onClick={() => handlePageChange(page)}
      >
        {page}
      </button>
    );

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(createButton(i));
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          buttons.push(createButton(i));
        }
        buttons.push(<span key="ellipsis">...</span>);
        buttons.push(createButton(totalPages));
      } else if (currentPage >= totalPages - 2) {
        buttons.push(createButton(1));
        buttons.push(<span key="ellipsis">...</span>);
        for (let i = totalPages - 3; i <= totalPages; i++) {
          buttons.push(createButton(i));
        }
      } else {
        buttons.push(createButton(1));
        buttons.push(<span key="ellipsis">...</span>);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          buttons.push(createButton(i));
        }
        buttons.push(<span key="ellipsis-last">...</span>);
        buttons.push(createButton(totalPages));
      }
    }
    return buttons;
  };

  return <div className="pagination">{renderPaginationButtons()}</div>;
};

export default Pagination;
