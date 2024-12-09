import React from "react";
import { BankDto } from "../../../api/dto/BankDto";

interface BankCardProps {
  bank: BankDto;
  editingBankId: string | null;
  editedBank: BankDto | null;
  calculateProgress: (balance: number, goal: number) => number;
  handleEditClick: (bank: BankDto) => void;
  handleSaveEdit: () => void;
  handleDeleteBank: (bankId: string) => void;
  handleViewHistory: (bankId: string) => void;
  setEditedBank: React.Dispatch<React.SetStateAction<BankDto | null>>;
}

const BankCard: React.FC<BankCardProps> = ({
  bank,
  editingBankId,
  editedBank,
  calculateProgress,
  handleEditClick,
  handleSaveEdit,
  handleDeleteBank,
  handleViewHistory,
  setEditedBank,
}) => (
  <div
    className={`card ${
      bank.balance > bank.balanceGoal ? "card-with-border" : ""
    }`}
    key={bank.bankId}
  >
    <div className="rowCard">
      <div className="leftCard">
        <div className="card-icon"></div>
        <div className="card-name">
          {editingBankId === bank.bankId ? (
            <input
              type="text"
              value={editedBank?.name}
              onChange={(e) =>
                setEditedBank({
                  ...editedBank!,
                  name: e.target.value,
                })
              }
            />
          ) : (
            bank.name
          )}
        </div>
      </div>
      <div className="rightCard">
        <div className="card-balance">Баланс: {bank.balance}</div>
        <div className="card-goal">
          {editingBankId === bank.bankId ? (
            <input
              type="number"
              value={editedBank?.balanceGoal}
              onChange={(e) =>
                setEditedBank({
                  ...editedBank!,
                  balanceGoal: parseFloat(e.target.value),
                })
              }
            />
          ) : (
            `Ціль: ${bank.balanceGoal}`
          )}
        </div>
      </div>
    </div>
    <div className="card-progress">
      <div
        className="card-progress-bar"
        style={{
          width: `${calculateProgress(bank.balance, bank.balanceGoal)}%`,
        }}
      ></div>
    </div>
    <div className="card-actions">
      {editingBankId === bank.bankId ? (
        <button onClick={handleSaveEdit}>Зберегти</button>
      ) : (
        <button onClick={() => handleEditClick(bank)}>Редагувати</button>
      )}
      <button onClick={() => handleDeleteBank(bank.bankId)}>
        Закрити Банку
      </button>
      <button onClick={() => handleViewHistory(bank.bankId)}>Історія</button>
    </div>
  </div>
);

export default BankCard;
