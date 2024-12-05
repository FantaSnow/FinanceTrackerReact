import React, { useState, useEffect, useCallback, useMemo } from "react";
import BankService from "../../api/services/BankService";
import BankTransactionService from "../../api/services/BankTransactionService";
import { BankDto } from "../../api/dto/BankDto";
import TransactionHistoryModal from "./TransactionHistoryModal";
import { useNotification } from "../../components/notification/NotificationProvider";
import "../../css/BankComponent.css";

const BankComponent: React.FC = () => {
  const [banks, setBanks] = useState<BankDto[]>([]);
  const [newBank, setNewBank] = useState({
    name: "",
    balanceGoal: 0,
  });
  const [editingBankId, setEditingBankId] = useState<string | null>(null);
  const [editedBank, setEditedBank] = useState<BankDto | null>(null);
  const [selectedTransactions, setSelectedTransactions] = useState<
    { createdAt: Date; amount: number }[] | null
  >(null);
  const { addNotification } = useNotification();
  const fetchBanks = useCallback(async () => {
    try {
      const data = await BankService.getAllBanksByUser();
      setBanks(data);
    } catch (error) {
      console.error("Не вдалося завантажити банки.", error);
      addNotification("Не вдалося завантажити банки.", "error");
    }
  }, [addNotification]);

  const handleViewHistory = useCallback(
    async (bankId: string) => {
      try {
        const transactions = await BankTransactionService.getAllByBank(bankId);

        setSelectedTransactions(transactions);
      } catch (error) {
        console.error("Не вдалося завантажити історію транзакцій.", error);
        addNotification("Не вдалося завантажити історію транзакцій.", "error");
      }
    },
    [addNotification]
  );

  const closeHistoryModal = () => {
    setSelectedTransactions(null);
  };

  const calculateProgress = useCallback(
    (balance: number, goal: number) => (balance / goal) * 100,
    []
  );

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  const handleCreateBank = useCallback(async () => {
    try {
      const createdBank = await BankService.createBank(newBank);
      setBanks((prevBanks) => [...prevBanks, createdBank]);
      setNewBank({ name: "", balanceGoal: 0 });
      addNotification("Банку успішно створено.", "success");
    } catch (error) {
      addNotification("Не вдалося створити банку.", "error");
    }
  }, [newBank, addNotification]);

  const handleEditClick = useCallback((bank: BankDto) => {
    setEditingBankId(bank.bankId);
    setEditedBank(bank);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (editedBank) {
      try {
        const updatedBank = await BankService.updateBank(
          editedBank.bankId,
          editedBank
        );
        setBanks((prevBanks) =>
          prevBanks.map((bank) =>
            bank.bankId === updatedBank.bankId ? updatedBank : bank
          )
        );
        setEditingBankId(null);
        setEditedBank(null);
        addNotification("Зміни успішно внесені", "success");
      } catch (error) {
        addNotification("Не вдалося зберегти зміни.", "error");
      }
    }
  }, [editedBank, addNotification]);

  const handleDeleteBank = useCallback(
    async (bankId: string) => {
      const isConfirmed = window.confirm("Ви дійсно хочете видалити цю банку?");

      if (isConfirmed) {
        try {
          await BankService.deleteBank(bankId);
          setBanks((prevBanks) =>
            prevBanks.filter((bank) => bank.bankId !== bankId)
          );
          addNotification("Банку успішно видалено.", "success");
        } catch (error) {
          addNotification("Не вдалося видалити банку.", "error");
        }
      }
    },
    [addNotification]
  );

  const bankCards = useMemo(
    () =>
      banks.map((bank) => (
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
            <button onClick={() => handleViewHistory(bank.bankId)}>
              Історія
            </button>
          </div>
        </div>
      )),
    [
      banks,
      editingBankId,
      editedBank,
      calculateProgress,
      handleEditClick,
      handleSaveEdit,
      handleDeleteBank,
      handleViewHistory,
    ]
  );

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
          <button onClick={handleCreateBank}>Додати банку</button>
        </div>
        <h1>Список банків</h1>
        <div className="card-container">{bankCards}</div>
      </div>
      {selectedTransactions && (
        <TransactionHistoryModal
          transactions={selectedTransactions}
          onClose={closeHistoryModal}
        />
      )}
    </div>
  );
};

export default BankComponent;
