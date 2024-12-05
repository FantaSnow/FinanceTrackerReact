import React, { useEffect, useState } from "react";
import "../../../css/StatisticComponent.css";
import { CategoryDto } from "../../../api/dto/CategoryDto";

type Props = {
  startDate: string;
  endDate: string;
  categories: CategoryDto[];
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  fetchTransactions: () => void;
  onCategorySelect: (categoryId: string) => void;
};

const StatisticSelectDate: React.FC<Props> = ({
  startDate,
  endDate,
  categories,
  setStartDate,
  setEndDate,
  fetchTransactions,
  onCategorySelect,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    const endDate = new Date(currentDate);

    startDate.setFullYear(currentDate.getFullYear() - 1);
    endDate.setFullYear(currentDate.getFullYear() + 1);

    setStartDate(startDate.toISOString().split("T")[0]);
    setEndDate(endDate.toISOString().split("T")[0]);
  }, [setStartDate, setEndDate]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    onCategorySelect(categoryId);
  };

  useEffect(() => {
    fetchTransactions();
  }, [startDate, endDate, selectedCategory]);

  return (
    <div className="date-selector">
      <label className="rowDate">
        <span>Start Date:</span>
        <span className="date-wrapper">
          <input
            type="date"
            name="start-date"
            value={startDate}
            onChange={handleStartDateChange}
          />
        </span>
      </label>
      <label className="rowDate">
        <span>End Date:</span>
        <span className="date-wrapper">
          <input
            type="date"
            name="end-date"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </span>
      </label>
      <label className="rowDate">
        <span>Category:</span>
        <span className="date-wrapper">
          <select
            className="statistic-selector"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </span>
      </label>
    </div>
  );
};

export default StatisticSelectDate;
