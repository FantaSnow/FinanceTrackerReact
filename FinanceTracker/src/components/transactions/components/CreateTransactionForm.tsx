import React, { useState } from "react";
import { CategoryDto } from "../../../api/dto/CategoryDto";
import "../../../css/Transaction.css";
import TransactionService from "../../../api/services/TransactionService";
import { useNotification } from "../../notification/NotificationProvider";

type Props = {
  categories: CategoryDto[];
  balance: number;
  fetchTransactions: () => void;
  fetchBalance: () => void;
};

const CreateTransactionForm: React.FC<Props> = ({
  categories,
  balance,
  fetchTransactions,
  fetchBalance,
}) => {
  const { addNotification } = useNotification();
  const [newTransactionCategoryId, setNewTransactionCategoryId] = useState<
    string | null
  >(null);
  const [newTransactionSum, setNewTransactionSum] = useState<string>("");

  const handleIncomeTransaction = async () => {
    if (!newTransactionCategoryId) {
      addNotification("Будь ласка, оберіть категорію.", "error");
      return;
    }

    const parsedSum = parseFloat(newTransactionSum);
    if (isNaN(parsedSum)) {
      addNotification(
        "Будь ласка, введіть числове значення для суми.",
        "error"
      );
      return;
    }

    if (parsedSum <= 0) {
      addNotification("Неможна вводити від’ємне число для доходу.", "error");
      return;
    }

    try {
      await TransactionService.create({
        sum: parsedSum,
        categoryId: newTransactionCategoryId,
      });
      setNewTransactionSum("");
      setNewTransactionCategoryId(null);
      fetchTransactions();
      fetchBalance();
      addNotification("Транзакція доходу створена успішно.", "success");
    } catch (error) {
      console.error("Failed to create income transaction", error);
      addNotification("Не вдалося створити транзакцію доходу.", "error");
    }
  };

  const handleExpenseTransaction = async () => {
    if (!newTransactionCategoryId) {
      addNotification("Будь ласка, оберіть категорію.", "error");
      return;
    }

    const parsedSum = parseFloat(newTransactionSum);
    if (isNaN(parsedSum)) {
      addNotification(
        "Будь ласка, введіть числове значення для суми.",
        "error"
      );
      return;
    }

    if (parsedSum <= 0) {
      addNotification("Неможна вводити від’ємне число для витрат.", "error");
      return;
    }

    if (parsedSum > balance) {
      addNotification("У вас недостатньо балансу для цієї витрати.", "error");
      return;
    }

    try {
      await TransactionService.create({
        sum: -parsedSum,
        categoryId: newTransactionCategoryId,
      });
      setNewTransactionSum("");
      setNewTransactionCategoryId(null);
      fetchTransactions();
      fetchBalance();
      addNotification("Транзакція витрати створена успішно.", "success");
    } catch (error) {
      console.error("Failed to create expense transaction", error);
      addNotification("Не вдалося створити транзакцію витрати.", "error");
    }
  };

  return (
    <div className="AddBalance">
      <div className="UperCreateBalance">
        <div className="column-header table-cell column-sumCreate">Sum</div>
        <div className="column-header table-cell column-categoryCreate">
          Category
        </div>
        <div className="column-header table-cell column-actionCreate">
          Action
        </div>
      </div>
      <div className="BottomCreateBalance">
        <input
          className="inputSumCreate"
          type="text"
          value={newTransactionSum}
          onChange={(e) => setNewTransactionSum(e.target.value)}
        />
        <select
          className="SelectCategoryCreate"
          value={newTransactionCategoryId || ""}
          onChange={(e) => setNewTransactionCategoryId(e.target.value)}
        >
          <option value="" disabled>
            Оберіть категорію
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <div className="Buttondiv">
          <button
            className="ButtonTransactionCreate"
            onClick={handleIncomeTransaction}
          >
            Дохід
          </button>
          <button
            className="ButtonTransactionCreate"
            onClick={handleExpenseTransaction}
          >
            Витрата
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTransactionForm;
