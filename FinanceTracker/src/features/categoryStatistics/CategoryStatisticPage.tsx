import React, { useState, useEffect, useCallback } from "react";
import "../../css/CategoryStatisticComponent.css";
import StatisticSelectDate from "./components/CategoryStatisticSelectDate";
import CategoryStatisticCard from "./components/CategoryStatisticCard";
import StatisticService from "../../api/services/StatisticService";
import { StatisticCategoryDto } from "../../api/dto/StatisticDto";
import LoadingIndicator from "../../components/loading/LoadingIndicator";

const CategoryStatisticPage: React.FC = () => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [statisticsForAllCategories, setStatisticsForAllCategories] = useState<
    StatisticCategoryDto[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchStatisticsForAllCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await StatisticService.getForAllCategories(
        startDate,
        endDate
      );
      setStatisticsForAllCategories(data);
    } catch (error) {
      console.error("Failed to fetch statistics by category", error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (startDate && endDate) {
      fetchStatisticsForAllCategories();
    }
  }, [startDate, endDate, fetchStatisticsForAllCategories]);

  return (
    <div className="Main">
      <StatisticSelectDate
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
      {loading && <LoadingIndicator />}

      <CategoryStatisticCard
        statisticsForAllCategories={statisticsForAllCategories}
      />
    </div>
  );
};

export default CategoryStatisticPage;
