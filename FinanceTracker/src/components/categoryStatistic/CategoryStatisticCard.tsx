import React from "react";
import "../../css/CategoryStatisticComponent.css";
import { StatisticCategoryDto } from "../../api/dto/StatisticDto";

type Props = {
  statisticsForAllCategories: StatisticCategoryDto[];
};

const CategoryStatisticCard: React.FC<Props> = ({
  statisticsForAllCategories,
}) => <div className="CardContainer"></div>;
export default CategoryStatisticCard;
