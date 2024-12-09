import React, { useState, useEffect, useCallback } from "react";
import "../../css/StatisticComponent.css";
import StatisticSelectDate from "./components/StatisticSelectDate";
import StatisticFormToggle from "./components/StatisticFormToggle";
import { TransactionDto } from "../../api/dto/TransactionDto";
import StatisticCard from "./components/StatisticCard";
import { CategoryDto } from "../../api/dto/CategoryDto";
import UserService from "../../api/services/UserService";
import TransactionService from "../../api/services/TransactionService";
import CategoryService from "../../api/services/CategoryService";
import StatisticService from "../../api/services/StatisticService";
import { StatisticDto } from "../../api/dto/StatisticDto";
import LoadingIndicator from "../../components/loading/LoadingIndicator";

const StatisticPage: React.FC = () => {
  const [activeForm, setActiveForm] = useState<string>("CardPlusActive");
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

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

  const fetchBalance = useCallback(async () => {
    try {
      const balanceData = await UserService.getBalanceById();
      setBalance(balanceData.balance);
    } catch (error) {
      console.error("Failed to fetch balance", error);
    }
  }, []);

  const handlePageChange = useCallback(
    (page: number) => setCurrentPage(page),
    []
  );

  const fetchTransactionsData = async (
    activeForm: string,
    currentPage: number,
    itemsPerPage: number,
    startDate: string,
    endDate: string,
    selectedCategory: string
  ): Promise<TransactionDto[]> => {
    if (activeForm === "CardPlusActive") {
      return selectedCategory
        ? await TransactionService.getAllPlusByUserAndDateAndCategory(
            currentPage,
            itemsPerPage,
            startDate,
            endDate,
            selectedCategory
          )
        : await TransactionService.getAllPlusByUserAndDate(
            currentPage,
            itemsPerPage,
            startDate,
            endDate
          );
    } else if (activeForm === "CardMinusActive") {
      return selectedCategory
        ? await TransactionService.getAllMinusByUserAndDateAndCategory(
            currentPage,
            itemsPerPage,
            startDate,
            endDate,
            selectedCategory
          )
        : await TransactionService.getAllMinusByUserAndDate(
            currentPage,
            itemsPerPage,
            startDate,
            endDate
          );
    }
    return [];
  };

  const fetchStatisticsData = async (
    startDate: string,
    endDate: string,
    selectedCategory: string
  ): Promise<StatisticDto> => {
    return selectedCategory
      ? await StatisticService.getByTimeAndCategory(
          startDate,
          endDate,
          selectedCategory
        )
      : await StatisticService.getByTimeAndCategoryForAll(startDate, endDate);
  };

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTransactionsData(
        activeForm,
        currentPage,
        itemsPerPage,
        startDate,
        endDate,
        selectedCategory
      );
      setTransactions(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    } finally {
      setLoading(false);
    }
  }, [
    activeForm,
    currentPage,
    itemsPerPage,
    startDate,
    endDate,
    selectedCategory,
  ]);

  const fetchStatisticsByTimeAndCategory = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchStatisticsData(
        startDate,
        endDate,
        selectedCategory
      );
      setStatisticsByTimeAndCategory(data);
    } catch (error) {
      console.error("Failed to fetch statistics by category", error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, selectedCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeForm, selectedCategory]);

  useEffect(() => {
    fetchTransactions();
    fetchStatisticsByTimeAndCategory();
  }, [activeForm, currentPage, startDate, endDate, selectedCategory]);

  const handleFormToggle = useCallback(
    (form: string) => {
      if (activeForm !== form) {
        setActiveForm(form);
      }
    },
    [activeForm]
  );

  const fetchCategories = useCallback(async () => {
    try {
      const data = await CategoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  }, []);

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
      {loading && <LoadingIndicator />}
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
    </div>
  );
};

export default StatisticPage;
