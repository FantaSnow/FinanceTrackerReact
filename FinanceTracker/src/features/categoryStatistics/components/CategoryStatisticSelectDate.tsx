import React, { useEffect, useState } from "react";
import "../../../css/CategoryStatisticComponent.css";

type Props = {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
};

const CategoryStatisticSelectDate: React.FC<Props> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  useEffect(() => {
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    const endDate = new Date(currentDate);

    startDate.setFullYear(currentDate.getFullYear() - 1);
    endDate.setFullYear(currentDate.getFullYear() + 1);

    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];

    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
  }, []);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

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
    </div>
  );
};

export default CategoryStatisticSelectDate;
