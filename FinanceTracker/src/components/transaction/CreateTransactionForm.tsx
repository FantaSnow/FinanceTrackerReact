import React, { useState } from "react";
import { CategoryDto } from "../../api/dto/CategoryDto";
import "../../css/Transaction.css";
import TransactionService from "../../api/services/TransactionService";

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
  const [error, setError] = useState<string | null>(null);
  const [newTransactionCategoryId, setNewTransactionCategoryId] = useState<string | null>(null);
  const [newTransactionSum, setNewTransactionSum] = useState<string>("");

  // Handler for income transactions
  const handleIncomeTransaction = async () => {
    if (!newTransactionCategoryId) {
      setError("Будь ласка, оберіть категорію");
      return;
    }

    const parsedSum = parseFloat(newTransactionSum);
    if (isNaN(parsedSum)) {
      setError("Будь ласка, введіть числове значення для суми");
      return;
    }

    if (parsedSum <= 0) {
      setError("Неможна вводити від’ємне число для доходу");
      return;
    }

    try {
      await TransactionService.create({
        sum: parsedSum,
        categoryId: newTransactionCategoryId,
      });
      setNewTransactionSum("");
      setNewTransactionCategoryId(null);
      setError(null);
      fetchTransactions();
      fetchBalance();
    } catch (error) {
      console.error("Failed to create income transaction", error);
    }
  };

  // Handler for expense transactions
  const handleExpenseTransaction = async () => {
    if (!newTransactionCategoryId) {
      setError("Будь ласка, оберіть категорію");
      return;
    }

    const parsedSum = parseFloat(newTransactionSum);
    if (isNaN(parsedSum)) {
      setError("Будь ласка, введіть числове значення для суми");
      return;
    }

    if (parsedSum <= 0) {
      setError("Неможна вводити від’ємне число для витрат");
      return;
    }

    if (parsedSum > balance) {
      setError("У вас недостатньо балансу для цієї витрати");
      return;
    }

    try {
      await TransactionService.create({
        sum: -parsedSum, // Expenses are recorded as negative values
        categoryId: newTransactionCategoryId,
      });
      setNewTransactionSum("");
      setNewTransactionCategoryId(null);
      setError(null);
      fetchTransactions();
      fetchBalance();
    } catch (error) {
      console.error("Failed to create expense transaction", error);
    }
  };

  return (
    <div className="AddBalance">
      <div className="UperCreateBalance">
        <div className="column-header table-cell column-sumCreate">Sum</div>
        <div className="column-header table-cell column-categoryCreate">Category</div>
        <div className="column-header table-cell column-actionCreate">Action</div>
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
      {error && <div className="errorCreateTransaction error">{error}</div>}
    </div>
  );
};

export default CreateTransactionForm;
