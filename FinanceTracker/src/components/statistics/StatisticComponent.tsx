import React, { useState, useEffect } from "react";
import "../../css/StatisticComponent.css";
import StatisticSelectDate from "./StatisticSelectDate";
import StatisticFormToggle from "./StatisticFormToggle";
import { TransactionDto } from "../../api/dto/TransactionDto";
import StatisticCard from "./StatisticCard";
import { CategoryDto } from "../../api/dto/CategoryDto";
import Footer from "../leyouts/Footer";
import UserService from "../../api/services/UserService";
import TransactionService from "../../api/services/TransactionService";
import CategoryService from "../../api/services/CategoryService";
import StatisticService from "../../api/services/StatisticService";
import { StatisticDto } from "../../api/dto/StatisticDto";

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

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [statisticsByTimeAndCategory, setStatisticsByTimeAndCategory] =
    useState<StatisticDto>({
      minusSum: 0,
      minusCountTransaction: 0,
      minusCountCategory: 0,
      plusSum: 0,
      plusCountTransaction: 0,
      plusCountCategory: 0,
    });

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
      if (activeForm === "CardPlusActive" && !selectedCategory) {
        data = await TransactionService.getAllPlusByUserAndDate(
          currentPage,
          itemsPerPage,
          startDate,
          endDate
        );
      }

      if (activeForm === "CardPlusActive" && selectedCategory) {
        data = await TransactionService.getAllPlusByUserAndDateAndCategory(
          currentPage,
          itemsPerPage,
          startDate,
          endDate,
          selectedCategory
        );
      }

      if (activeForm === "CardMinusActive" && !selectedCategory) {
        data = await TransactionService.getAllMinusByUserAndDate(
          currentPage,
          itemsPerPage,
          startDate,
          endDate
        );
      }

      if (activeForm === "CardMinusActive" && selectedCategory) {
        data = await TransactionService.getAllMinusByUserAndDateAndCategory(
          currentPage,
          itemsPerPage,
          startDate,
          endDate,
          selectedCategory
        );
      }

      setTransactions(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  };

  const fetchStatisticsByTimeAndCategory = async () => {
    try {
      let data;
      if (!selectedCategory) {
        data = await StatisticService.getByTimeAndCategoryForAll(
          startDate,
          endDate
        );
      } else {
        data = await StatisticService.getByTimeAndCategory(
          startDate,
          endDate,
          selectedCategory
        );
      }
      setStatisticsByTimeAndCategory(data);
    } catch (error) {
      console.error("Failed to fetch statistics by category", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    setCurrentPage(1);
    fetchStatisticsByTimeAndCategory();
  }, [activeForm, selectedCategory]);

  useEffect(() => {
    fetchTransactions();
    fetchStatisticsByTimeAndCategory();
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
        categories={categories}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        fetchTransactions={fetchTransactions}
        onCategorySelect={setSelectedCategory}
      />
      <StatisticFormToggle
        activeForm={activeForm}
        handleFormToggle={handleFormToggle}
      />
      <StatisticCard
        activeForm={activeForm}
        transactions={transactions}
        categories={categories}
        statisticsForAllCategories={statisticsByTimeAndCategory}
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
