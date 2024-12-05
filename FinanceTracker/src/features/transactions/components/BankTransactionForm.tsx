import React, { useState } from "react";
import { BankDto, BankAddBalanceDto } from "../../../api/dto/BankDto";
import { BankTransactionCreateDto } from "../../../api/dto/BankTransactionDto";
import "../../../css/Transaction.css";
import BankService from "../../../api/services/BankService";
import BankTransactionService from "../../../api/services/BankTransactionService";
import { useNotification } from "../../../components/notification/NotificationProvider";

type Props = {
  banks: BankDto[];
  balance: number;
  fetchBalance: () => void;
  fetchBanks: () => void; // Додана функція
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

  const handleDeposit = async () => {
    if (!newTransactionBankId) {
      addNotification("Будь ласка, оберіть банку.", "error");
      return;
    }

    const parsedSum = parseFloat(newTransactionSumBank);
    if (isNaN(parsedSum)) {
      addNotification(
        "Будь ласка, введіть числове значення для суми.",
        "error"
      );
      return;
    }

    if (parsedSum <= 0) {
      addNotification(
        "Неможна вводити від’ємне число для поповнення.",
        "error"
      );
      return;
    }

    const selectedBank = banks.find(
      (bank) => bank.bankId === newTransactionBankId
    );
    if (selectedBank && parsedSum > balance) {
      addNotification("У вас недостатньо балансу.", "error");
      return;
    }

    try {
      const balanceDto: BankTransactionCreateDto = { amount: parsedSum };
      await BankTransactionService.create(newTransactionBankId, balanceDto);
      setNewTransactionSumBank("");
      fetchBanks();
      fetchBalance();
      addNotification("Поповненя банки пройшло успішно", "success");
    } catch (error) {
      console.error("Failed to deposit bank transaction", error);
      addNotification("Не вдалось створити транзакцію для банки.", "error");
    }
  };

  const handleWithdraw = async () => {
    if (!newTransactionBankId) {
      addNotification("Будь ласка, оберіть банку.", "error");
      return;
    }

    const parsedSum = parseFloat(newTransactionSumBank);
    if (isNaN(parsedSum)) {
      addNotification(
        "Будь ласка, введіть числове значення для суми.",
        "error"
      );
      return;
    }

    if (parsedSum <= 0) {
      addNotification("Неможна вводити від’ємне число для зняття.", "error");
      return;
    }

    const selectedBank = banks.find(
      (bank) => bank.bankId === newTransactionBankId
    );
    if (selectedBank && parsedSum > selectedBank.balance) {
      addNotification("У вас недостатньо балансу в банці.", "error");
      return;
    }

    try {
      const balanceDto: BankTransactionCreateDto = { amount: -parsedSum };
      await BankTransactionService.create(newTransactionBankId, balanceDto);
      setNewTransactionSumBank("");
      fetchBanks();
      fetchBalance();
      addNotification("Зняття балансу з банки пройшло успішно", "success");
    } catch (error) {
      addNotification("Не вдалось зняти баланс з банки", "error");
      console.error("Failed to withdraw bank transaction", error);
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
    </div>
  );
};

export default BankTransactionForm;
