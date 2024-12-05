import React, { useState, useCallback } from "react";
import { TransactionDto } from "../../../api/dto/TransactionDto";
import { CategoryDto } from "../../../api/dto/CategoryDto";
import "../../../css/Transaction.css";
import Pagination from "../../../components/Pagination";
import TransactionService from "../../../api/services/TransactionService";
import { useNotification } from "../../../components/notification/NotificationProvider";

type Props = {
  transactions: TransactionDto[];
  categories: CategoryDto[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  handlePageChange: (page: number) => void;
  fetchBalance: () => void;
  setTransactions: (transactions: TransactionDto[]) => void;
};

const TransactionTable: React.FC<Props> = ({
  transactions,
  categories,
  currentPage,
  totalPages,
  itemsPerPage,
  handlePageChange,
  fetchBalance,
  setTransactions,
}) => {
  const { addNotification } = useNotification();
  const [editingTransactionId, setEditingTransactionId] = useState<
    string | null
  >(null);
  const [updatedTransaction, setUpdatedTransaction] =
    useState<TransactionDto | null>(null);

  const handleEdit = useCallback((transaction: TransactionDto) => {
    setEditingTransactionId(transaction.id);
    setUpdatedTransaction(transaction);
  }, []);

  const handleDelete = useCallback(
    async (transactionId: string) => {
      try {
        await TransactionService.delete(transactionId);
        const updatedTransactions = transactions.filter(
          (transaction) => transaction.id !== transactionId
        );
        setTransactions(updatedTransactions);
        fetchBalance();
        addNotification("Транзакцію успішно видалено.", "success");
      } catch (error) {
        addNotification("Не вдалось видалити транзакцію.", "error");
        console.error("Failed to delete transaction", error);
      }
    },
    [transactions, setTransactions, fetchBalance, addNotification]
  );

  const handleSave = useCallback(async () => {
    if (updatedTransaction && updatedTransaction.id) {
      try {
        const selectedCategory = categories.find(
          (category) => category.name === updatedTransaction.categoryName
        );
        if (!selectedCategory) throw new Error("Категорія не знайдена");

        await TransactionService.update(updatedTransaction.id, {
          sum: updatedTransaction.sum,
          categoryId: selectedCategory.id!,
        });

        const updatedTransactions = transactions.map((tx) =>
          tx.id === updatedTransaction.id ? updatedTransaction : tx
        );
        setTransactions(updatedTransactions);
        setEditingTransactionId(null);
        setUpdatedTransaction(null);
        fetchBalance();
        addNotification("Транзакцію успішно збережено.", "success");
      } catch (error) {
        addNotification("Не вдалось зберегти транзакцію.", "error");
        console.error("Failed to save transaction", error);
      }
    }
  }, [
    updatedTransaction,
    categories,
    transactions,
    setTransactions,
    fetchBalance,
    addNotification,
  ]);

  return (
    <div className="Table">
      <h1 className="TransactionName">Ваші транзакції</h1>
      <div className="files-table">
        <div className="files-table-header">
          <div className="column-header table-cell column-create-date">
            Create Date
          </div>
          <div className="column-header table-cell column-sum">Sum</div>
          <div className="column-header table-cell column-category">
            Category
          </div>
          <div className="column-header table-cell column-action">Action</div>
        </div>
        {transactions
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((transaction) => (
            <div key={transaction.id} className="files-table-row">
              <div className="table-cell column-create-date">
                {new Date(transaction.createdAt).toLocaleString("uk-UA", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
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
                    style={{ paddingRight: "20px" }}
                  />
                ) : (
                  `${transaction.sum.toLocaleString()} $`
                )}
              </div>

              <div className="table-cell column-category">
                {editingTransactionId === transaction.id ? (
                  <select
                    className="SelectCategoryEdit"
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
                  <button
                    className="action-button save-btn"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="action-button edit-btn"
                    onClick={() => handleEdit(transaction)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="action-button delete-btn"
                  onClick={() => handleDelete(transaction.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};
export default TransactionTable;
