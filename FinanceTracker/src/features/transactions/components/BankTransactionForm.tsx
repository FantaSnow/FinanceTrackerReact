import React, { useState } from "react";
import { BankDto } from "../../../api/dto/BankDto";
import { BankTransactionCreateDto } from "../../../api/dto/BankTransactionDto";
import "../../../css/Transaction.css";
import BankTransactionService from "../../../api/services/BankTransactionService";
import { useNotification } from "../../../components/notification/NotificationProvider";

type Props = {
  banks: BankDto[];
  balance: number;
  fetchBalance: () => void;
  fetchBanks: () => void;
};

const BankTransactionForm: React.FC<Props> = ({
  banks,
  balance,
  fetchBalance,
  fetchBanks,
}) => {
  const { addNotification } = useNotification();
  const [newTransactionBankId, setNewTransactionBankId] = useState<
    string | null
  >(null);
  const [newTransactionSumBank, setNewTransactionSumBank] =
    useState<string>("");

  const handleTransaction = async (isDeposit: boolean) => {
    if (!newTransactionBankId) {
      addNotification("Будь ласка, оберіть банку.", "error");
      return;
    }

    const parsedSum = parseFloat(newTransactionSumBank);
    if (isNaN(parsedSum) || parsedSum <= 0) {
      addNotification("Неправильна сума", "error");
      return;
    }

    const selectedBank = banks.find(
      (bank) => bank.bankId === newTransactionBankId
    );
    const sumCheck = isDeposit
      ? parsedSum > balance
      : parsedSum > (selectedBank ? selectedBank.balance : 0);
    if (sumCheck) {
      addNotification(
        isDeposit
          ? "У вас недостатньо балансу."
          : "У вас недостатньо балансу в банці.",
        "error"
      );
      return;
    }

    try {
      const amount = isDeposit ? parsedSum : -parsedSum;
      await BankTransactionService.create(newTransactionBankId, { amount });
      setNewTransactionSumBank("");
      fetchBanks();
      fetchBalance();
      addNotification(
        isDeposit
          ? "Поповненя банки пройшло успішно"
          : "Зняття балансу з банки пройшло успішно",
        "success"
      );
    } catch (error) {
      console.error("Failed to process bank transaction", error);
      addNotification("Не вдалось виконати операцію з банком.", "error");
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
          <button
            className="ButtonTransactionCreate"
            onClick={() => handleTransaction(true)}
          >
            Поповнити
          </button>
          <button
            className="ButtonTransactionCreate"
            onClick={() => handleTransaction(false)}
          >
            Зняти
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankTransactionForm;
