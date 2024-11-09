import React from "react";
import { TransactionDto } from "../../api/dto/TransactionDto";
import { CategoryDto } from "../../api/dto/CategoryDto";
import "../../css/Transaction.css";
import Pagination from "./Pagination";

type Props = {
  transactions: TransactionDto[];
  categories: CategoryDto[];
  editingTransactionId: string | null;
  updatedTransaction: TransactionDto | null;
  setUpdatedTransaction: (transaction: TransactionDto | null) => void;
  handleEdit: (transaction: TransactionDto) => void;
  handleSave: () => void;
  handleDelete: (transactionId: string) => void;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  handlePageChange: (page: number) => void;
};

const TransactionTable: React.FC<Props> = ({
  transactions,
  categories,
  editingTransactionId,
  updatedTransaction,
  setUpdatedTransaction,
  handleEdit,
  handleSave,
  handleDelete,
  currentPage,
  totalPages,
  itemsPerPage,
  handlePageChange,
}) => (
  <div className="Table">
    <h1 className="TransactionName">Ваші транзакції</h1>
    <div className="files-table">
      <div className="files-table-header">
        <div className="column-header table-cell column-create-date">
          Create Date
        </div>
        <div className="column-header table-cell column-sum">Sum</div>
        <div className="column-header table-cell column-category">Category</div>
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
                <div style={{ position: "relative" }}>
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
                  <span
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  >
                    $
                  </span>
                </div>
              ) : (
                `${transaction.sum} $`
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
                <button className="action-button save-btn" onClick={handleSave}>
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

export default TransactionTable;
