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
import { BankDto } from "../../api/dto/BankDto";
import "../../css/Transaction.css";
import Footer from "../Footer";

const TransactionComponent: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [banks, setBanks] = useState<BankDto[]>([]);
  const [balance, setBalance] = useState<number>(0);

  const [activeForm, setActiveForm] = useState("createTransaction");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;

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

  const fetchCategories = async () => {
    try {
      const data = await CategoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
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
    fetchCategories();
    fetchTransactions();
    fetchBalance();
    fetchBanks();
  }, [currentPage]);

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
              categories={categories}
              balance={balance}
              fetchTransactions={fetchTransactions}
              fetchBalance={fetchBalance}
            />
          ) : (
            <BankTransactionForm
              banks={banks}
              balance={balance}
              fetchBalance={fetchBalance}
            />
          )}
        </div>

        <div className="containerTransaction">
          <div className="TableDiv">
            <TransactionTable
              transactions={transactions}
              categories={categories}
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
      <Footer />
    </div>
  );
};

export default TransactionComponent;
