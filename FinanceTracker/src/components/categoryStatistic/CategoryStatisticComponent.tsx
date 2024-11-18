import React, { useState, useEffect } from "react";
import "../../css/CategoryStatisticComponent.css";
import StatisticSelectDate from "./CategoryStatisticSelectDate";
import CategoryStatisticCard from "./CategoryStatisticCard";
import Footer from "../Footer";
import StatisticService from "../../api/services/StatisticService";
import { StatisticCategoryDto } from "../../api/dto/StatisticDto";

const CategoryStatisticComponent: React.FC = () => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [statisticsForAllCategories, setStatisticsForAllCategories] = useState<
    StatisticCategoryDto[]
  >([]);

  const fetchStatisticsForAllCategories = async () => {
    try {
      let data;
      data = await StatisticService.getForAllCategories(startDate, endDate);

      setStatisticsForAllCategories(data);
    } catch (error) {
      console.error("Failed to fetch statistics by category", error);
    }
  };

  return (
    <div>
      <StatisticSelectDate
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
      <CategoryStatisticCard
        statisticsForAllCategories={statisticsForAllCategories}
      />
      <Footer />
    </div>
  );
};

export default CategoryStatisticComponent;
