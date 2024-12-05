import React from "react";
import "../../../css/StatisticComponent.css";
import TransactionTable from "../../transactions/components/TransactionTable";
import { TransactionDto } from "../../../api/dto/TransactionDto";
import { CategoryDto } from "../../../api/dto/CategoryDto";
import { StatisticDto } from "../../../api/dto/StatisticDto";

type Props = {
  activeForm: string;
  transactions: TransactionDto[];
  categories: CategoryDto[];
  statisticsForAllCategories: StatisticDto;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  handlePageChange: (page: number) => void;
  setTransactions: React.Dispatch<React.SetStateAction<TransactionDto[]>>;
  fetchBalance: () => void;
};

const StatisticCard: React.FC<Props> = ({
  activeForm,
  transactions,
  categories,
  statisticsForAllCategories,
  currentPage,
  totalPages,
  itemsPerPage,
  handlePageChange,
  setTransactions,
  fetchBalance,
}) => (
  <div className="CardContainer">
    <div
      className={`CardPlus ${activeForm === "CardPlusActive" ? "active" : ""}`}
    >
      <div className="StatisticCard">
        <div>
          <h1 className="SumPlus2">Доходи:</h1>
          <h1 className="SumPlus">
            {statisticsForAllCategories !== null
              ? `${statisticsForAllCategories.plusSum.toLocaleString()}$`
              : "N/A"}
          </h1>
        </div>
        <div>
          <h1 className="SumPlusSecond">
            {statisticsForAllCategories !== null
              ? `Транзакції: ${statisticsForAllCategories.plusCountTransaction}`
              : "N/A"}
          </h1>
        </div>
        <div>
          <h1 className="SumPlusSecond">
            {statisticsForAllCategories !== null
              ? `Категорій: ${statisticsForAllCategories.plusCountCategory}`
              : "N/A"}
          </h1>
        </div>
      </div>
      <div className="StatisticTablePlus">
        {activeForm === "CardPlusActive" && (
          <TransactionTable
            transactions={transactions}
            categories={categories}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            handlePageChange={handlePageChange}
            setTransactions={setTransactions}
            fetchBalance={fetchBalance}
          />
        )}
      </div>
    </div>
    <div
      className={`CardMinus ${
        activeForm === "CardMinusActive" ? "active" : ""
      }`}
    >
      <div className="StatisticCard">
        <div>
          <h1 className="SumMinus2">Витрати:</h1>
          <h1 className="SumMinus">
            {statisticsForAllCategories !== null
              ? `${statisticsForAllCategories.minusSum.toLocaleString()}$`
              : "N/A"}
          </h1>
        </div>
        <div>
          <h1 className="SumMinusSecond">
            {statisticsForAllCategories !== null
              ? `Транзакції: ${statisticsForAllCategories.minusCountTransaction}`
              : "N/A"}
          </h1>
        </div>
        <div>
          <h1 className="SumMinusSecond">
            {statisticsForAllCategories !== null
              ? `Категорій: ${statisticsForAllCategories.minusCountCategory}`
              : "N/A"}
          </h1>
        </div>
      </div>
      <div className="StatisticTableMinus">
        {activeForm === "CardMinusActive" && (
          <TransactionTable
            transactions={transactions}
            categories={categories}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            handlePageChange={handlePageChange}
            setTransactions={setTransactions}
            fetchBalance={fetchBalance}
          />
        )}
      </div>
    </div>
  </div>
);
export default StatisticCard;
