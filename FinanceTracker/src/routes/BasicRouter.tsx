import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/leyouts/Layout";
import Login from "../components/Register/Login";
import Register from "../components/Register/Register";
import BankList from "../components/banks/BankPage";
import ProtectedRoute from "./ProtectedRoute";
import TransactionPage from "../components/transactions/TransactionPage";
import StatisticPage from "../components/statistics/StatisticPage";
import CategoryStatisticComponent from "../components/categoryStatistics/CategoryStatisticPage";

const BasicRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <Layout>
            <ProtectedRoute />
          </Layout>
        }
      >
        <Route path="/bank" element={<BankList />} />
        <Route path="/transaction" element={<TransactionPage />} />
        <Route path="/statistic" element={<StatisticPage />} />
        <Route path="/category" element={<CategoryStatisticComponent />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default BasicRouter;
