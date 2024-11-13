import React, { useState, useEffect } from "react";
import TransactionFormToggle from "./TransactionFormToggle";
import CreateTransactionForm from "./CreateTransactionForm";
import BankTransactionForm from "./BankTransactionForm";
import TransactionTable from "./TransactionTable";
import BalanceDisplay from "./BalanceDisplay";
import TransactionService from "../../api/services/TransactionService";
import CategoryService from "../../api/services/CategoryService";
import UserService from "../../api/services/UserService";
import BankService from "../../api/services/BankService";
import { TransactionDto } from "../../api/dto/TransactionDto";
import { CategoryDto } from "../../api/dto/CategoryDto";
import { BankDto, BankAddBalanceDto } from "../../api/dto/BankDto";
import "../../css/Transaction.css";
const TransactionComponent: React.FC = () => {
  // State variables for managing transactions, banks, categories, etc.
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [banks, setBanks] = useState<BankDto[]>([]);
  const [balance, setBalance] = useState<number>(0);

  const [activeForm, setActiveForm] = useState("createTransaction");
  const [newTransactionSum, setNewTransactionSum] = useState<string>("");
  const [newTransactionCategoryId, setNewTransactionCategoryId] = useState<
    string | null
  >(null);
  const [newTransactionSumBank, setNewTransactionSumBank] =
    useState<string>("");
  const [newTransactionBankId, setNewTransactionBankId] = useState<
    string | null
  >(null);

  const [editingTransactionId, setEditingTransactionId] = useState<
    string | null
  >(null);
  const [updatedTransaction, setUpdatedTransaction] =
    useState<TransactionDto | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [bankError, setBankError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 8;

  // Fetch user balance
  const fetchBalance = async () => {
    try {
      const balanceData = await UserService.getBalanceById();
      setBalance(balanceData.balance);
    } catch (error) {
      console.error("Failed to fetch balance", error);
    }
  };

  // Fetch transactions based on pagination
  const fetchTransactions = async () => {
    try {
      const data = await TransactionService.getAllByUser(
        currentPage,
        itemsPerPage
      );
      setTransactions(
        data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  };

  // Fetch categories and banks data
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

  // Handler for creating a new transaction
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

  // Handler for creating a bank transaction
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
      const balanceDto: BankAddBalanceDto = { balance: parsedSum };

      await BankService.addToBalance(newTransactionBankId, balanceDto);
      fetchTransactions();
      fetchBalance();
      setNewTransactionSumBank("");
      setNewTransactionBankId(null);
      setBankError(null);
    } catch (error) {
      console.error("Failed to create bank transaction", error);
    }
  };

  // Handler for editing and saving a transaction
  const handleEdit = (transaction: TransactionDto) => {
    setEditingTransactionId(transaction.id);
    setUpdatedTransaction({ ...transaction });
  };

  const handleSave = async () => {
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
        setTransactions((prev) =>
          prev.map((tx) =>
            tx.id === updatedTransaction.id ? updatedTransaction : tx
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

  // Handler for deleting a transaction
  const handleDelete = async (transactionId: string) => {
    try {
      await TransactionService.delete(transactionId);
      setTransactions((prev) =>
        prev.filter((transaction) => transaction.id !== transactionId)
      );
      fetchBalance();
    } catch (error) {
      console.error("Failed to delete transaction", error);
    }
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="MainContainerTransaction">
      <div className="AddBalance">
        <TransactionFormToggle
          activeForm={activeForm}
          setActiveForm={setActiveForm}
        />
        {activeForm === "createTransaction" ? (
          <CreateTransactionForm
            categories={categories}
            newTransactionSum={newTransactionSum}
            setNewTransactionSum={setNewTransactionSum}
            newTransactionCategoryId={newTransactionCategoryId}
            setNewTransactionCategoryId={setNewTransactionCategoryId}
            handleCreateTransaction={handleCreateTransaction}
            error={error}
          />
        ) : (
          <BankTransactionForm
            banks={banks}
            newTransactionSumBank={newTransactionSumBank}
            setNewTransactionSumBank={setNewTransactionSumBank}
            newTransactionBankId={newTransactionBankId}
            setNewTransactionBankId={setNewTransactionBankId}
            handleCreateTransactionBank={handleCreateTransactionBank}
            bankError={bankError}
          />
        )}
      </div>
      <div className="containerTransaction">
        <TransactionTable
          transactions={transactions}
          categories={categories}
          editingTransactionId={editingTransactionId}
          updatedTransaction={updatedTransaction}
          setUpdatedTransaction={setUpdatedTransaction}
          handleEdit={handleEdit}
          handleSave={handleSave}
          handleDelete={handleDelete}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          handlePageChange={handlePageChange}
        />
        <BalanceDisplay balance={balance} />
      </div>
    </div>
  );
};

export default TransactionComponent;
