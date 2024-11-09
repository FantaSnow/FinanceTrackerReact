import React, { useState, useEffect } from "react";
import TransactionService from "../api/services/TransactionService";
import { TransactionDto } from "../api/dto/TransactionDto";
import CategoryService from "../api/services/CategoryService";
import { CategoryDto } from "../api/dto/CategoryDto";
import { BankDto } from "../api/dto/BankDto";

import "../css/Transaction.css";
import UserService from "../api/services/UserService";
import BankService from "../api/services/BankService";

const TransactionComponent: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [banks, setBanks] = useState<BankDto[]>([]);
  const [activeForm, setActiveForm] = useState("createTransaction"); // Стан для визначення активної форми

  const [editingTransactionId, setEditingTransactionId] = useState<
    string | null
  >(null);
  const [newTransactionSum, setNewTransactionSum] = useState<string>("");
  const [newTransactionSumBank, setNewTransactionSumBank] =
    useState<string>("");

  const [newTransactionCategoryId, setNewTransactionCategoryId] = useState<
    string | null
  >(null);
  const [newTransactionBankId, setNewTransactionBankId] = useState<
    string | null
  >(null);

  const [updatedTransaction, setUpdatedTransaction] =
    useState<TransactionDto | null>(null);

  const [categories, setCategories] = useState<CategoryDto[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [bankerror, setBankError] = useState<string | null>(null);

  const [balance, setBalance] = useState<number>(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(8);

  const fetchBalance = async () => {
    try {
      const balanceData = await UserService.getBalanceById();
      setBalance(balanceData.balance);
    } catch (error) {
      console.error("Failed to fetch balance", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const data = await TransactionService.getAllByUser(
        currentPage,
        itemsPerPage
      );
      const sortedData = data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setTransactions(sortedData);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchBalance();
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

  const handleCreateTransaction = async () => {
    if (!newTransactionCategoryId) {
      setError("Будь ласка, оберіть категорію");
      return;
    }

    const parsedSum = parseFloat(newTransactionSum);
    if (isNaN(parsedSum)) {
      setError("Будь ласка, введіть числове значення для суми");
      return;
    }

    try {
      await TransactionService.create({
        sum: parsedSum,
        categoryId: newTransactionCategoryId,
      });
      fetchTransactions();
      setNewTransactionSum("");
      setNewTransactionCategoryId(null);
      setError(null);
      fetchBalance();
    } catch (error) {
      console.error("Failed to create transaction", error);
    }
  };

  const handleCreateTransactionBank = async () => {
    if (!newTransactionBankId) {
      setBankError("Будь ласка, оберіть банку");
      return;
    }

    const parsedSum = parseFloat(newTransactionSumBank);
    if (isNaN(parsedSum)) {
      setBankError("Будь ласка, введіть числове значення для суми");
      return;
    }

    try {
      await BankService.addToBalance(newTransactionBankId, parsedSum);
      setNewTransactionSumBank("");
      setNewTransactionBankId(null);
      setBankError(null);
    } catch (error) {
      console.error("Failed to create bank transaction", error);
    }
  };
  const fetchBanks = async () => {
    try {
      const data = await BankService.getAllBanksByUser();
      setBanks(data);
    } catch (error) {
      console.error("Failed to fetch banks", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchBalance();
    fetchBanks();
  }, [currentPage]);
  const handleSave = async () => {
    if (updatedTransaction && updatedTransaction.id) {
      try {
        const selectedCategory = categories.find(
          (category) => category.name === updatedTransaction.categoryName
        );

        if (!selectedCategory) {
          throw new Error("Категорія не знайдена");
        }

        await TransactionService.update(updatedTransaction.id, {
          sum: updatedTransaction.sum,
          categoryId: selectedCategory.id!,
        });

        setTransactions((prevTransactions) =>
          prevTransactions.map((transaction) =>
            transaction.id === updatedTransaction.id
              ? updatedTransaction
              : transaction
          )
        );
        setEditingTransactionId(null);
        setUpdatedTransaction(null);
        fetchBalance();
      } catch (error) {
        console.error("Failed to save transaction", error);
      }
    }
  };

  const handleDelete = async (transactionId: string) => {
    try {
      await TransactionService.delete(transactionId);
      setTransactions((prevTransactions) =>
        prevTransactions.filter(
          (transaction) => transaction.id !== transactionId
        )
      );
      fetchBalance();
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
      <div className="AddBalance">
        <div className="AddBalance">
          <div className="TranasctionNameDiv">
            <h1
              className={`TransactionName ${
                activeForm === "createTransaction" ? "active" : ""
              }`}
              onClick={() => setActiveForm("createTransaction")}
            >
              Створити транзакцію
            </h1>
            <h1
              className={`TransactionName ${
                activeForm === "interactionWithBank" ? "active" : ""
              }`}
              onClick={() => setActiveForm("interactionWithBank")}
            >
              Взаємодія з банкою
            </h1>
          </div>

          {/* Інші частини компоненту */}
        </div>

        {/* Умовне рендерення форми для створення транзакції */}
        {activeForm === "createTransaction" && (
          <div className="AddBalance">
            <div className="UperCreateBalance">
              <div className="column-header table-cell column-sumCreate">
                Sum
              </div>
              <div className="column-header table-cell column-categoryCreate">
                Category
              </div>
              <div className="column-header table-cell column-actionCreate">
                Action
              </div>
            </div>
            <div className="BottomCreateBalance">
              <input
                className="inputSumCreate"
                type="text"
                value={newTransactionSum}
                onChange={(e) => setNewTransactionSum(e.target.value)}
              />
              <select
                className="SelectCategoryCreate"
                value={newTransactionCategoryId || ""}
                onChange={(e) => setNewTransactionCategoryId(e.target.value)}
              >
                <option value="" disabled>
                  Оберіть категорію
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button
                className="ButtonTransactionCreate"
                onClick={handleCreateTransaction}
              >
                Create
              </button>
            </div>
            <div className="errorCreateTransaction">
              {error && <div className="error">{error}</div>}
            </div>
          </div>
        )}

        {/* Умовне рендерення форми для взаємодії з банком */}
        {activeForm === "interactionWithBank" && (
          <div className="AddBalance">
            <div className="UperCreateBalance">
              <div className="column-header table-cell column-sumCreate">
                Sum
              </div>
              <div className="column-header table-cell column-categoryCreate">
                Bank
              </div>
              <div className="column-header table-cell column-actionCreate">
                Action
              </div>
            </div>
            <div className="BottomCreateBalance">
              <input
                className="inputSumCreate"
                type="text"
                value={newTransactionSumBank}
                onChange={(e) => setNewTransactionSumBank(e.target.value)}
              />
              <select
                className="SelectCategoryCreate"
                value={newTransactionBankId || ""}
                onChange={(e) => setNewTransactionBankId(e.target.value)}
              >
                <option value="" disabled>
                  Оберіть банку
                </option>
                {banks.map((bank) => (
                  <option key={bank.bankId} value={bank.bankId}>
                    {bank.name}
                  </option>
                ))}
              </select>
              <button
                className="ButtonTransactionCreate"
                onClick={handleCreateTransactionBank}
              >
                Create
              </button>
            </div>
            <div className="errorCreateTransaction">
              {bankerror && <div className="error">{bankerror}</div>}
            </div>
          </div>
        )}
      </div>
      <div className="containerTransaction">
        <div className="Table">
          <div>
            <h1 className="TransactionName">Ваші транзакції</h1>
          </div>
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
            <div className="pagination">{renderPaginationButtons()}</div>
          </div>
        </div>
        <div className="RightContainer">
          <h1 className="TransactionName">Баланс</h1>
          <div className="Balance">
            <h1 className="BalanceText">{balance} $</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionComponent;
