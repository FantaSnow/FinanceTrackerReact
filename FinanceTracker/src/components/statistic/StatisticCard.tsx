import React from "react";
import "../../css/StatisticComponent.css";
import TransactionTable from "../transaction/TransactionTable";
import { TransactionDto } from "../../api/dto/TransactionDto";
import { CategoryDto } from "../../api/dto/CategoryDto";

type Props = {
  activeForm: string;
  transactions: TransactionDto[];
  categories: CategoryDto[];
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
          <h1 className="SumPlus2">Сума:</h1>
          <h1 className="SumPlus">+1202$</h1>
        </div>
        <div>
          <h1 className="SumPlusSecond">Транзакції: 32</h1>
        </div>
        <div>
          <h1 className="SumPlusSecond">Категорій: 32</h1>
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
          <h1 className="SumMinus2">Сума:</h1>
          <h1 className="SumMinus">-1202$</h1>
        </div>
        <div>
          <h1 className="SumMinusSecond">Транзакції: 32</h1>
        </div>
        <div>
          <h1 className="SumMinusSecond">Категорій: 32</h1>
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
