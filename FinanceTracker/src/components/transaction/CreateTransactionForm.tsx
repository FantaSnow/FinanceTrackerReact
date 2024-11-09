import React from "react";
import { CategoryDto } from "../../api/dto/CategoryDto";
import "../../css/Transaction.css";

type Props = {
  categories: CategoryDto[];
  newTransactionSum: string;
  setNewTransactionSum: (value: string) => void;
  newTransactionCategoryId: string | null;
  setNewTransactionCategoryId: (id: string) => void;
  handleCreateTransaction: () => void;
  error: string | null;
};

const CreateTransactionForm: React.FC<Props> = ({
  categories,
  newTransactionSum,
  setNewTransactionSum,
  newTransactionCategoryId,
  setNewTransactionCategoryId,
  handleCreateTransaction,
  error,
}) => (
  <div className="AddBalance">
    <div className="UperCreateBalance">
      <div className="column-header table-cell column-sumCreate">Sum</div>
      <div className="column-header table-cell column-categoryCreate">
        Category
      </div>
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
      <button
        className="ButtonTransactionCreate"
        onClick={handleCreateTransaction}
      >
        Create
      </button>
    </div>
    {error && <div className="errorCreateTransaction error">{error}</div>}
  </div>
);

export default CreateTransactionForm;
