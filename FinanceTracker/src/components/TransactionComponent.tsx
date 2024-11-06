import React, { useState, useEffect } from "react";
import TransactionService from "../api/services/TransactionService";
import { TransactionDto } from "../api/dto/TransactionDto";
import CategoryService from "../api/services/CategoryService";
import { CategoryDto } from "../api/dto/CategoryDto";

import "../css/Transaction.css";

const TransactionComponent: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(4);
  const [itemsPerPage] = useState(8);
  const [editingTransactionId, setEditingTransactionId] = useState<
    string | null
  >(null);
  const [updatedTransaction, setUpdatedTransaction] =
    useState<TransactionDto | null>(null);
  const [categories, setCategories] = useState<CategoryDto[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await TransactionService.getAllByUser(
          currentPage,
          itemsPerPage
        );
        setTransactions(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage)); // Встановлюємо totalPages на основі нової кількості елементів
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      }
    };
    fetchTransactions();
  }, [currentPage]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (transaction: TransactionDto) => {
    setEditingTransactionId(transaction.id);
    setUpdatedTransaction({ ...transaction });
  };

  const handleSave = async () => {
    if (updatedTransaction && updatedTransaction.id) {
      try {
        await TransactionService.update(updatedTransaction.id, {
          sum: updatedTransaction.sum,
          categoryId: updatedTransaction.categoryName,
        });
        setEditingTransactionId(null);
        setUpdatedTransaction(null);
        // After saving, refresh the transactions
        const data = await TransactionService.getAllByUser(
          currentPage,
          itemsPerPage
        );
        setTransactions(data);
      } catch (error) {
        console.error("Failed to save transaction", error);
      }
    }
  };

  const handleDelete = async (transactionId: string) => {
    try {
      await TransactionService.delete(transactionId);
      // After deletion, refresh the transactions
      const data = await TransactionService.getAllByUser(
        currentPage,
        itemsPerPage
      );
      setTransactions(data);
    } catch (error) {
      console.error("Failed to delete transaction", error);
    }
  };

  const renderPaginationButtons = () => {
    const maxPagesToShow = 5;
    let buttons = [];
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
        buttons.push(
          <button
            key="last"
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

  return (
    <div className="MainContainerTransaction">
      <h1>Ваші транзакції</h1>
      <div className="containerTransaction">
        <div className="Table">
          <div className="files-table">
            <div className="files-table-header">
              <div className="column-header table-cell column-create-date">
                Create Date
              </div>
              <div className="column-header table-cell column-sum">Sum</div>
              <div className="column-header table-cell column-category">
                Category
              </div>
              <div className="column-header table-cell column-action">
                Action
              </div>
            </div>
            {transactions
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((transaction) => (
                <div key={transaction.id} className="files-table-row">
                  <div className="table-cell column-create-date">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </div>
                  <div className="table-cell column-sum">
                    {editingTransactionId === transaction.id ? (
                      <input
                        type="number"
                        value={updatedTransaction?.sum || ""}
                        onChange={(e) =>
                          setUpdatedTransaction({
                            ...updatedTransaction!,
                            sum: Number(e.target.value),
                          })
                        }
                      />
                    ) : (
                      transaction.sum
                    )}
                  </div>
                  <div className="table-cell column-category">
                    {editingTransactionId === transaction.id ? (
                      <select
                        value={updatedTransaction?.categoryName || ""}
                        onChange={(e) =>
                          setUpdatedTransaction({
                            ...updatedTransaction!,
                            categoryName: e.target.value,
                          })
                        }
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      transaction.categoryName
                    )}
                  </div>
                  <div className="table-cell column-action action-cell">
                    {editingTransactionId === transaction.id ? (
                      <button className="more-action" onClick={handleSave}>
                        Save
                      </button>
                    ) : (
                      <button
                        className="more-action"
                        onClick={() => handleEdit(transaction)}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="more-action"
                      onClick={() => handleDelete(transaction.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            <div className="pagination">{renderPaginationButtons()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionComponent;
