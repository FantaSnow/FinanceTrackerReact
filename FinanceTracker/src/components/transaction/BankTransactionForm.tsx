import React from "react";
import { BankDto } from "../../api/dto/BankDto";
import "../../css/Transaction.css";

type Props = {
  banks: BankDto[];
  newTransactionSumBank: string;
  setNewTransactionSumBank: (value: string) => void;
  newTransactionBankId: string | null;
  setNewTransactionBankId: (id: string) => void;
  handleCreateTransactionBank: () => void;
  bankError: string | null;
};

const BankTransactionForm: React.FC<Props> = ({
  banks,
  newTransactionSumBank,
  setNewTransactionSumBank,
  newTransactionBankId,
  setNewTransactionBankId,
  handleCreateTransactionBank,
  bankError,
}) => (
  <div className="AddBalance">
    <div className="UperCreateBalance">
      <div className="column-header table-cell column-sumCreate">Sum</div>
      <div className="column-header table-cell column-categoryCreate">Bank</div>
      <div className="column-header table-cell column-actionCreate">Action</div>
    </div>
    <div className="BottomCreateBalance">
      <input
        className="inputSumCreate"
        type="text"
        value={newTransactionSumBank}
        onChange={(e) => setNewTransactionSumBank(e.target.value)}
      />
      <select
        className="SelectCategoryCreate"
        value={newTransactionBankId || ""}
        onChange={(e) => setNewTransactionBankId(e.target.value)}
      >
        <option value="" disabled>
          Оберіть банку
        </option>
        {banks.map((bank) => (
          <option key={bank.bankId} value={bank.bankId}>
            {bank.name}
          </option>
        ))}
      </select>
      <div className="Buttondiv">
        <button
          className="ButtonTransactionCreate"
          onClick={handleCreateTransactionBank}
        >
          Create
        </button>
        <button
          className="ButtonTransactionCreate"
          onClick={handleCreateTransactionBank}
        >
          Create
        </button>
      </div>
    </div>
    {bankError && (
      <div className="errorCreateTransaction error">{bankError}</div>
    )}
  </div>
);

export default BankTransactionForm;
