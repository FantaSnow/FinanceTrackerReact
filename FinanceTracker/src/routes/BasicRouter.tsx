import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../components/leyouts/Header";
import Login from "../components/Register/Login";
import Register from "../components/Register/Register";
import BankList from "../components/banks/BankList";
import ProtectedRoute from "./ProtectedRoute";
import TransactionComponent from "../components/transactions/TransactionComponent";
import StatisticComponent from "../components/statistics/StatisticComponent";
import CategoryStatisticComponent from "../components/categoryStatistics/CategoryStatisticComponent";

const BasicRouter: React.FC = () => {
  return (
    <>
      <Header />
      <Routes>
        {/* Публічні сторінки */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Приватні сторінки */}
        <Route element={<ProtectedRoute />}>
          <Route path="/bank" element={<BankList />} />
          <Route path="/transaction" element={<TransactionComponent />} />
          <Route path="/statistic" element={<StatisticComponent />} />
          <Route path="/category" element={<CategoryStatisticComponent />} />
        </Route>

        {/* Редирект на логін для невідомих маршрутів */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
};

export default BasicRouter;
