import React from "react";
import "../../../css/StatisticComponent.css";

type Props = {
  activeForm: string;
  handleFormToggle: (form: string) => void;
};

const StatisticFormToggle: React.FC<Props> = ({
  activeForm,
  handleFormToggle,
}) => {
  return (
    <div className="StatisticNameDiv">
      <h1
        className={`StatisticName ${
          activeForm === "CardPlusActive" ? "active" : ""
        }`}
        onClick={() => handleFormToggle("CardPlusActive")}
      >
        Доходи
      </h1>
      <h1
        className={`StatisticName ${
          activeForm === "CardMinusActive" ? "active" : ""
        }`}
        onClick={() => handleFormToggle("CardMinusActive")}
      >
        Витрати
      </h1>
    </div>
  );
};

export default StatisticFormToggle;
