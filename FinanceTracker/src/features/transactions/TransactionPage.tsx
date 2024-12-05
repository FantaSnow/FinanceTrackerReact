import React, { useState, useEffect } from "react";
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

  const fetchData = async () => {
    try {
      const [balanceData, transactionsData, categoriesData, banksData] =
        await Promise.all([
          UserService.getBalanceById(),
          TransactionService.getAllByUser(currentPage, itemsPerPage),
          CategoryService.getAllCategories(),
          BankService.getAllBanksByUser(),
        ]);

      setBalance(balanceData.balance);
      setTransactions(
        transactionsData.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
      setTotalPages(Math.ceil(transactionsData.length / itemsPerPage));
      setCategories(categoriesData);
      setBanks(banksData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  useEffect(() => {
    fetchData();
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
              fetchTransactions={fetchData}
              fetchBalance={fetchData}
            />
          ) : (
            <BankTransactionForm
              banks={banks}
              balance={balance}
              fetchBalance={fetchData}
              fetchBanks={fetchData}
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
              fetchBalance={fetchData}
            />
          </div>
          <BalanceDisplay balance={balance} />
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;
