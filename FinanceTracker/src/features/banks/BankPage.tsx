import React, { useState, useEffect, useCallback, useMemo } from "react";
import BankService from "../../api/services/BankService";
import BankTransactionService from "../../api/services/BankTransactionService";
import { BankDto } from "../../api/dto/BankDto";
import TransactionHistoryModal from "./components/TransactionHistoryModal";
import { useNotification } from "../../components/notification/NotificationProvider";
import BankCard from "./components/BankCard";
import NewBankCard from "./components/NewBankCard";
import "../../css/BankComponent.css";
import LoadingIndicator from "../../components/loading/LoadingIndicator";

const BankComponent: React.FC = () => {
  const [banks, setBanks] = useState<BankDto[]>([]);
  const [newBank, setNewBank] = useState({ name: "", balanceGoal: 0 });
  const [editingBankId, setEditingBankId] = useState<string | null>(null);
  const [editedBank, setEditedBank] = useState<BankDto | null>(null);
  const [selectedTransactions, setSelectedTransactions] = useState<
    { createdAt: Date; amount: number }[] | null
  >(null);
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchBanks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await BankService.getAllBanksByUser();
      setBanks(data);
    } catch (error) {
      console.error("Не вдалося завантажити банки.", error);
      addNotification("Не вдалося завантажити банки.", "error");
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  const handleViewHistory = useCallback(
    async (bankId: string) => {
      setLoading(true);
      try {
        const transactions = await BankTransactionService.getAllByBank(bankId);
        setSelectedTransactions(transactions);
      } catch (error) {
        console.error("Не вдалося завантажити історію транзакцій.", error);
        addNotification("Не вдалося завантажити історію транзакцій.", "error");
      } finally {
        setLoading(false);
      }
    },
    [addNotification]
  );

  const closeHistoryModal = useCallback(() => {
    setSelectedTransactions(null);
  }, []);

  const calculateProgress = useCallback(
    (balance: number, goal: number) => (balance / goal) * 100,
    []
  );

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  const handleCreateBank = useCallback(async () => {
    setLoading(true);
    try {
      const createdBank = await BankService.createBank(newBank);
      setBanks((prevBanks) => [...prevBanks, createdBank]);
      setNewBank({ name: "", balanceGoal: 0 });
      addNotification("Банку успішно створено.", "success");
    } catch (error) {
      addNotification("Не вдалося створити банку.", "error");
    } finally {
      setLoading(false);
    }
  }, [newBank, addNotification]);

  const handleEditClick = useCallback((bank: BankDto) => {
    setEditingBankId(bank.bankId);
    setEditedBank(bank);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (editedBank) {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    }
  }, [editedBank, addNotification]);

  const handleDeleteBank = useCallback(
    async (bankId: string) => {
      const isConfirmed = window.confirm("Ви дійсно хочете видалити цю банку?");
      if (isConfirmed) {
        setLoading(true);
        try {
          await BankService.deleteBank(bankId);
          setBanks((prevBanks) =>
            prevBanks.filter((bank) => bank.bankId !== bankId)
          );
          addNotification("Банку успішно видалено.", "success");
        } catch (error) {
          addNotification("Не вдалося видалити банку.", "error");
        } finally {
          setLoading(false);
        }
      }
    },
    [addNotification]
  );

  return (
    <div>
      <div className="bank-container">
        <NewBankCard
          newBank={newBank}
          setNewBank={setNewBank}
          handleCreateBank={handleCreateBank}
        />
        {loading && <LoadingIndicator />}

        <h1>Список банків</h1>
        <div className="card-container">
          {banks.map((bank) => (
            <BankCard
              key={bank.bankId}
              bank={bank}
              editingBankId={editingBankId}
              editedBank={editedBank}
              calculateProgress={calculateProgress}
              handleEditClick={handleEditClick}
              handleSaveEdit={handleSaveEdit}
              handleDeleteBank={handleDeleteBank}
              handleViewHistory={handleViewHistory}
              setEditedBank={setEditedBank}
            />
          ))}
        </div>
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
