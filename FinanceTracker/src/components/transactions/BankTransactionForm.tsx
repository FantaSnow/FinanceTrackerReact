import React, { useState } from "react";
import { BankDto, BankAddBalanceDto } from "../../api/dto/BankDto";
import "../../css/Transaction.css";
import BankService from "../../api/services/BankService";

type Props = {
  banks: BankDto[];
  balance: number;
  fetchBalance: () => void;
};

const BankTransactionForm: React.FC<Props> = ({
  banks,
  balance,
  fetchBalance,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [newTransactionBankId, setNewTransactionBankId] = useState<
    string | null
  >(null);
  const [newTransactionSumBank, setNewTransactionSumBank] =
    useState<string>("");

  const handleDeposit = async () => {
    if (!newTransactionBankId) {
      setError("Будь ласка, оберіть банку");
      return;
    }

    const parsedSum = parseFloat(newTransactionSumBank);
    if (isNaN(parsedSum)) {
      setError("Будь ласка, введіть числове значення для суми");
      return;
    }

    if (parsedSum <= 0) {
      setError("Неможна вводити від’ємне число для поповнення");
      return;
    }

    const selectedBank = banks.find(
      (bank) => bank.bankId === newTransactionBankId
    );
    if (selectedBank && parsedSum > balance) {
      setError("У вас недостатньо балансу");
      return;
    }

    try {
      const balanceDto: BankAddBalanceDto = { balance: parsedSum };
      await BankService.addToBalance(newTransactionBankId, balanceDto);
      setNewTransactionSumBank("");
      setNewTransactionBankId(null);
      setError(null);
      fetchBalance();
    } catch (error) {
      console.error("Failed to create bank transaction", error);
    }
  };

  const handleWithdraw = async () => {
    if (!newTransactionBankId) {
      setError("Будь ласка, оберіть банку");
      return;
    }

    const parsedSum = parseFloat(newTransactionSumBank);
    if (isNaN(parsedSum)) {
      setError("Будь ласка, введіть числове значення для суми");
      return;
    }

    if (parsedSum <= 0) {
      setError("Неможна вводити від’ємне число для зняття");
      return;
    }

    const selectedBank = banks.find(
      (bank) => bank.bankId === newTransactionBankId
    );
    if (selectedBank && parsedSum > selectedBank.balance) {
      setError("У вас недостатньо балансу в банку");
      return;
    }

    try {
      const balanceDto: BankAddBalanceDto = { balance: -parsedSum };
      await BankService.addToBalance(newTransactionBankId, balanceDto);
      setNewTransactionSumBank("");
      setNewTransactionBankId(null);
      setError(null);
      fetchBalance();
    } catch (error) {
      console.error("Failed to create bank transaction", error);
    }
  };

  return (
    <div className="AddBalance">
      <div className="UperCreateBalance">
        <div className="column-header table-cell column-sumCreate">Sum</div>
        <div className="column-header table-cell column-categoryCreate">
          Bank
        </div>
        <div className="column-header table-cell column-actionCreate">
          Action
        </div>
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
          <button className="ButtonTransactionCreate" onClick={handleDeposit}>
            Поповнити
          </button>
          <button className="ButtonTransactionCreate" onClick={handleWithdraw}>
            Зняти
          </button>
        </div>
      </div>
      {error && <div className="errorCreateTransaction error">{error}</div>}
    </div>
  );
};

export default BankTransactionForm;
