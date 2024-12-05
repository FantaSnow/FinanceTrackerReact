import React, { useState, useEffect } from "react";
import "../../css/CategoryStatisticComponent.css";
import StatisticSelectDate from "./components/CategoryStatisticSelectDate";
import CategoryStatisticCard from "./components/CategoryStatisticCard";
import StatisticService from "../../api/services/StatisticService";
import { StatisticCategoryDto } from "../../api/dto/StatisticDto";

const CategoryStatisticPage: React.FC = () => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [statisticsForAllCategories, setStatisticsForAllCategories] = useState<
    StatisticCategoryDto[]
  >([]);

  const fetchStatisticsForAllCategories = async () => {
    try {
      const data = await StatisticService.getForAllCategories(
        startDate,
        endDate
      );
      setStatisticsForAllCategories(data);
    } catch (error) {
      console.error("Failed to fetch statistics by category", error);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchStatisticsForAllCategories();
    }
  }, [startDate, endDate]);

  return (
    <div className="Main">
      <StatisticSelectDate
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
      <CategoryStatisticCard
        statisticsForAllCategories={statisticsForAllCategories}
      />
    </div>
  );
};

export default CategoryStatisticPage;
