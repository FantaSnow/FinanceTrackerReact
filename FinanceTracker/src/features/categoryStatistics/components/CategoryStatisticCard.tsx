import React from "react";
import "../../../css/CategoryStatisticComponent.css";
import { StatisticCategoryDto } from "../../../api/dto/StatisticDto";

type Props = {
  statisticsForAllCategories: StatisticCategoryDto[];
};

const CategoryStatisticCard: React.FC<Props> = ({
  statisticsForAllCategories,
}) => {
  return (
    <div className="Container_Category">
      <h1 className="TopName_Category">Категорії: </h1>
      <div className="Card_Category">
        {statisticsForAllCategories.map((category) => (
          <div
            key={category.name}
            className={
              category.plusSum >= category.minusSum
                ? "card_Category CardPlus_Category"
                : "card_Category CardMinus_Category"
            }
          >
            <div className="StatisticCard_Category">
              <div className="StatisticName_Category">{category.name}</div>
              <div className="RowStatistic">
                <div>
                  Дохід:
                  <div>
                    <span className="SumPlus_Category">
                      +{category.plusSum.toLocaleString()} $
                    </span>
                  </div>
                </div>
                <div>
                  Витрати:
                  <div>
                    <span className="SumMinus_Category">
                      {category.minusSum.toLocaleString()} $
                    </span>
                  </div>
                </div>
              </div>
              <div>Транзакції: {category.countTransaction}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CategoryStatisticCard;
