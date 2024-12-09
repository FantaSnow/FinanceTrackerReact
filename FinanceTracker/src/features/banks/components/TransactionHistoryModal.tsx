import React, { useState, useMemo, useCallback } from "react";
import "../../../css/TransactionHistoryModal.css";
import Pagination from "../../../components/Pagination";

interface TransactionHistoryModalProps {
  transactions: { createdAt: Date; amount: number }[];
  onClose: () => void;
}

const TransactionHistoryModal: React.FC<TransactionHistoryModalProps> = ({
  transactions,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = useMemo(
    () => Math.ceil(transactions.length / itemsPerPage),
    [transactions.length]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const paginatedTransactions = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return transactions.slice(startIdx, startIdx + itemsPerPage);
  }, [currentPage, transactions]);

  const renderTableHeader = () => (
    <thead className="files-table-header-bank">
      <tr>
        <th className="table-cell-bank">Дата</th>
        <th className="table-cell-bank">Сума</th>
      </tr>
    </thead>
  );

  const renderTableBody = () => (
    <tbody>
      {paginatedTransactions.map((transaction, index) => (
        <tr className="files-table-row-bank" key={index}>
          <td className="table-cell-bank">
            {new Date(transaction.createdAt).toLocaleString("uk-UA", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </td>
          <td className="table-cell-bank">{transaction.amount}$</td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <div className="modal-overlay-bank">
      <div className="modal-content-bank">
        <h2>Історія транзакцій</h2>
        <table className="files-table-bank">
          {renderTableHeader()}
          {renderTableBody()}
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
        <button onClick={onClose} className="modal-close-button-bank">
          Закрити
        </button>
      </div>
    </div>
  );
};

export default TransactionHistoryModal;
