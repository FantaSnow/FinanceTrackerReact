import React from "react";

interface NewBankCardProps {
  newBank: { name: string; balanceGoal: number };
  setNewBank: React.Dispatch<
    React.SetStateAction<{ name: string; balanceGoal: number }>
  >;
  handleCreateBank: () => void;
}

const NewBankCard: React.FC<NewBankCardProps> = ({
  newBank,
  setNewBank,
  handleCreateBank,
}) => (
  <div className="new-bank-card">
    <div className="new-bank-card-name">
      <h2>Створити нову банку</h2>
    </div>
    <div className="rowCard">
      <div className="leftCard">
        <div className="card-icon"></div>
        <input
          type="text"
          placeholder="Назва банку"
          value={newBank.name}
          onChange={(e) => setNewBank({ ...newBank, name: e.target.value })}
        />
      </div>
      <div className="rightCard">
        <div className="new-bank-card-balance">Баланс: 0</div>
        <div className="new-bank-card-balancegoal">
          <input
            type="number"
            placeholder="Цільовий баланс"
            value={newBank.balanceGoal}
            onChange={(e) =>
              setNewBank({
                ...newBank,
                balanceGoal: parseFloat(e.target.value),
              })
            }
          />
        </div>
      </div>
    </div>
    <button onClick={handleCreateBank}>Додати банку</button>
  </div>
);

export default NewBankCard;
