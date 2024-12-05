import React, { useState, useEffect, useMemo, useCallback } from "react";
import TransactionFormToggle from "./components/TransactionFormToggle";
import CreateTransactionForm from "./components/CreateTransactionForm";
import BankTransactionForm from "./components/BankTransactionForm";
import TransactionTable from "./components/TransactionTable";
import BalanceDisplay from "./components/BalanceDisplay";
import TransactionService from "../../api/services/TransactionService";
import CategoryService from "../../api/services/CategoryService";
import UserService from "../../api/services/UserService";
import BankService from "../../api/services/BankService";
import { TransactionDto } from "../../api/dto/TransactionDto";
import { CategoryDto } from "../../api/dto/CategoryDto";
import { BankDto } from "../../api/dto/BankDto";
import "../../css/Transaction.css";

const TransactionPage: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [banks, setBanks] = useState<BankDto[]>([]);
  const [balance, setBalance] = useState<number>(0);

  const [activeForm, setActiveForm] = useState("createTransaction");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;

  const fetchBalance = useCallback(async () => {
    try {
      const balanceData = await UserService.getBalanceById();
      setBalance(balanceData.balance);
    } catch (error) {
      console.error("Failed to fetch balance", error);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      const transactionsData = await TransactionService.getAllByUser(
        currentPage,
        itemsPerPage
      );
      setTransactions(
        transactionsData.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
      setTotalPages(Math.ceil(transactionsData.length / itemsPerPage));
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  }, [currentPage, itemsPerPage]);

  const fetchCategories = useCallback(async () => {
    try {
      const categoriesData = await CategoryService.getAllCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  }, []);

  const fetchBanks = useCallback(async () => {
    try {
      const banksData = await BankService.getAllBanksByUser();
      setBanks(banksData);
    } catch (error) {
      console.error("Failed to fetch banks", error);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, [fetchBalance, fetchTransactions]);

  useEffect(() => {
    fetchCategories();
    fetchBanks();
  }, [fetchCategories, fetchBanks]);

  const memoizedTransactions = useMemo(() => transactions, [transactions]);
  const memoizedCategories = useMemo(() => categories, [categories]);
  const memoizedBanks = useMemo(() => banks, [banks]);

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div>
      <div className="MainContainerTransaction">
        <div className="AddBalance">
          <TransactionFormToggle
            activeForm={activeForm}
            setActiveForm={setActiveForm}
          />
          {activeForm === "createTransaction" ? (
            <CreateTransactionForm
              categories={memoizedCategories}
              balance={balance}
              fetchTransactions={fetchTransactions}
              fetchBalance={fetchBalance}
            />
          ) : (
            <BankTransactionForm
              banks={memoizedBanks}
              balance={balance}
              fetchBalance={fetchBalance}
              fetchBanks={fetchBanks}
            />
          )}
        </div>

        <div className="containerTransaction">
          <div className="TableDiv">
            <TransactionTable
              transactions={memoizedTransactions}
              categories={memoizedCategories}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              handlePageChange={handlePageChange}
              setTransactions={setTransactions}
              fetchBalance={fetchBalance}
            />
          </div>
          <BalanceDisplay balance={balance} />
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;
