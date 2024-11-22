import React from "react";

type Props = {
  balance: number;
};

const BalanceDisplay: React.FC<Props> = ({ balance }) => (
  <div className="RightContainer">
    <h1 className="TransactionName">Баланс</h1>
    <div className="Balance">
      <h1 className="BalanceText">{balance} $</h1>
    </div>
  </div>
);

export default BalanceDisplay;
