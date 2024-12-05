import React from "react";
import "../../../css/Transaction.css";

type Props = {
  activeForm: string;
  setActiveForm: (form: string) => void;
};

const TransactionFormToggle: React.FC<Props> = ({
  activeForm,
  setActiveForm,
}) => {
  const handleCreateTransaction = () => setActiveForm("createTransaction");
  const handleInteractionWithBank = () => setActiveForm("interactionWithBank");

  return (
    <div className="TranasctionNameDiv">
      <h1
        className={`TransactionName ${
          activeForm === "createTransaction" ? "active" : ""
        }`}
        onClick={handleCreateTransaction}
      >
        Створити транзакцію
      </h1>
      <h1
        className={`TransactionName ${
          activeForm === "interactionWithBank" ? "active" : ""
        }`}
        onClick={handleInteractionWithBank}
      >
        Взаємодія з банкою
      </h1>
    </div>
  );
};

export default TransactionFormToggle;
