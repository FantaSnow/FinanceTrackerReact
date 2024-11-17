import React, { useState, useEffect } from "react";
import "../../css/StatisticComponent.css";
import StatisticSelectDate from "./StatisticSelectDate";
import StatisticFormToggle from "./StatisticFormToggle";
import { TransactionDto } from "../../api/dto/TransactionDto";
import StatisticCard from "./StatisticCard";
import { CategoryDto } from "../../api/dto/CategoryDto";
import Footer from "../Footer";
import UserService from "../../api/services/UserService";
import TransactionService from "../../api/services/TransactionService";
import CategoryService from "../../api/services/CategoryService";

const StatisticComponent: React.FC = () => {
  const [activeForm, setActiveForm] = useState<string>("CardPlusActive");
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [balance, setBalance] = useState<number>(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 11;

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const fetchBalance = async () => {
    try {
      const balanceData = await UserService.getBalanceById();
      setBalance(balanceData.balance);
    } catch (error) {
      console.error("Failed to fetch balance", error);
    }
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const fetchTransactions = async () => {
    try {
      let data: TransactionDto[] = [];
      if (activeForm === "CardPlusActive") {
        data = await TransactionService.getAllPlusByUserAndDate(
          currentPage,
          itemsPerPage,
          startDate,
          endDate
        );
      }
      if (activeForm === "CardMinusActive") {
        data = await TransactionService.getAllMinusByUserAndDate(
          currentPage,
          itemsPerPage,
          startDate,
          endDate
        );
      }
      setTransactions(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeForm]);

  useEffect(() => {
    fetchTransactions();
  }, [activeForm, currentPage, startDate, endDate]);

  const handleFormToggle = (form: string) => {
    if (activeForm !== form) {
      setActiveForm(form);
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

  useEffect(() => {
    fetchCategories();
    fetchBalance();
  }, []);

  return (
    <div>
      <StatisticSelectDate
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        fetchTransactions={fetchTransactions}
      />
      <StatisticFormToggle
        activeForm={activeForm}
        handleFormToggle={handleFormToggle}
      />
      <StatisticCard
        activeForm={activeForm}
        transactions={transactions}
        categories={categories}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        handlePageChange={handlePageChange}
        setTransactions={setTransactions}
        fetchBalance={fetchBalance}
      />
      <Footer />
    </div>
  );
};

export default StatisticComponent;
