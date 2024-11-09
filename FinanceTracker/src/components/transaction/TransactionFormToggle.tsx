import React from "react";
import "../../css/Transaction.css";

type Props = {
  activeForm: string;
  setActiveForm: (form: string) => void;
};

const TransactionFormToggle: React.FC<Props> = ({
  activeForm,
  setActiveForm,
}) => (
  <div className="TranasctionNameDiv">
    <h1
      className={`TransactionName ${
        activeForm === "createTransaction" ? "active" : ""
      }`}
      onClick={() => setActiveForm("createTransaction")}
    >
      Створити транзакцію
    </h1>
    <h1
      className={`TransactionName ${
        activeForm === "interactionWithBank" ? "active" : ""
      }`}
      onClick={() => setActiveForm("interactionWithBank")}
    >
      Взаємодія з банкою
    </h1>
  </div>
);

export default TransactionFormToggle;
