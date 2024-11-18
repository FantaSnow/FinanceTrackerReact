import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import Login from "../components/Login";
import Register from "../components/Register";
import BankList from "../components/BankList";
import ProtectedRoute from "./ProtectedRoute";
import TransactionComponent from "../components/transaction/TransactionComponent";
import StatisticComponent from "../components/statistic/StatisticComponent";
import CategoryStatisticComponent from "../components/categoryStatistic/CategoryStatisticComponent";

import { Navigate } from "react-router-dom";
import AuthService from "../api/services/AuthService";

const BasicRouter: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    AuthService.isAuthenticated()
  );

  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/bank" element={<BankList />} />
          <Route path="/transaction" element={<TransactionComponent />} />
          <Route path="/statistic" element={<StatisticComponent />} />
          <Route path="/category" element={<CategoryStatisticComponent />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
};

export default BasicRouter;
