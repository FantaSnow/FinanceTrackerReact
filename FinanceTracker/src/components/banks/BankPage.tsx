import React, { useState, useEffect } from "react";
import BankService from "../../api/services/BankService";
import { BankDto, BankCreateDto } from "../../api/dto/BankDto";
import "../../css/BankComponent.css";
import Footer from "../leyouts/Footer";

const BankComponent: React.FC = () => {
  const [banks, setBanks] = useState<BankDto[]>([]);
  const [newBank, setNewBank] = useState<BankCreateDto>({
    name: "",
    balanceGoal: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [editingBankId, setEditingBankId] = useState<string | null>(null);
  const [editedBank, setEditedBank] = useState<BankDto | null>(null);

  const fetchBanks = async () => {
    try {
      const data = await BankService.getAllBanksByUser();
      setBanks(data);
    } catch (error) {
      setError("Не вдалося завантажити банки.");
    }
  };
  const calculateProgress = (balance: number, goal: number) =>
    (balance / goal) * 100;
  useEffect(() => {
    fetchBanks();
  }, []);

  const handleCreateBank = async () => {
    try {
      const createdBank = await BankService.createBank(newBank);
      setBanks([...banks, createdBank]);
      setNewBank({ name: "", balanceGoal: 0 });
    } catch (error) {
      setError("Не вдалося створити банку.");
    }
  };

  const handleEditClick = (bank: BankDto) => {
    setEditingBankId(bank.bankId);
    setEditedBank(bank);
  };

  const handleSaveEdit = async () => {
    if (editedBank) {
      try {
        const updatedBank = await BankService.updateBank(
          editedBank.bankId,
          editedBank
        );
        setBanks(
          banks.map((bank) =>
            bank.bankId === updatedBank.bankId ? updatedBank : bank
          )
        );
        setEditingBankId(null);
        setEditedBank(null);
      } catch (error) {
        setError("Не вдалося зберегти зміни.");
      }
    }
  };

  const handleDeleteBank = async (bankId: string) => {
    const isConfirmed = window.confirm("Ви дійсно хочете видалити цю банку?");

    if (isConfirmed) {
      try {
        await BankService.deleteBank(bankId);
        setBanks(banks.filter((bank) => bank.bankId !== bankId));
      } catch (error) {
        setError("Не вдалося видалити банк.");
      }
    }
  };

  return (
    <div>
      <div className="bank-container">
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
                onChange={(e) =>
                  setNewBank({ ...newBank, name: e.target.value })
                }
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
          {error && <p style={{ color: "red" }}>{error}</p>}

          <button onClick={handleCreateBank}>Додати банку</button>
        </div>
        <h1>Список банків</h1>

        <div className="card-container">
          {banks.map((bank) => (
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
                    width: `${calculateProgress(
                      bank.balance,
                      bank.balanceGoal
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="card-actions">
                {editingBankId === bank.bankId ? (
                  <button onClick={handleSaveEdit}>Зберегти</button>
                ) : (
                  <button onClick={() => handleEditClick(bank)}>
                    Редагувати
                  </button>
                )}
                <button onClick={() => handleDeleteBank(bank.bankId)}>
                  Закрити Банку
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BankComponent;
